import { Vec } from './vec.mjs';
import { randColor } from './util.mjs';
import * as THREE from './three.module.js';

class CubePart {
  static CUBE_PART_SIZE = 5;

  constructor(points, color) {
    this.points = points;
    this.pointSet = new Set();
    this.color = color || randColor();

    for (const point of points) {
      this.pointSet.add(point.hash());
    }
  }

  getThree(solid, striking) {
    const dimension = 0.9;
    const geometry = new THREE.BoxGeometry(dimension, dimension, dimension);
// const material = new THREE.MeshBasicMaterial({color: 0x049ef4, wireframe: false, fog: true});
// const material = new THREE.MeshStandardMaterial({color: 0x049ef4, wireframe: false, fog: true});
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      wireframe: !solid,
      transparent: true,
      opacity: striking ? 0.8 : 0.5
    });
// const material = new THREE.MeshNormalMaterial({wireframe: true});

    const threeCubes = [];
    for (const point of this.points) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = point.x;
      cube.position.y = point.y;
      cube.position.z = point.z;
      threeCubes.push(cube);
    }
    return threeCubes;
  }

  static ofNormVecs(mainDir, secondDir, near) {
    const points = [
      Vec.nullVec(),
      Vec.nullVec().addToNew(mainDir),
      Vec.nullVec().addToNew(mainDir.multToNew(2)),
      Vec.nullVec().addToNew(mainDir.multToNew(3))
    ];
    if (near)
      points.push(Vec.nullVec().addToNew(mainDir).addToNew(secondDir));
    else
      points.push(Vec.nullVec().addToNew(mainDir.multToNew(2)).addToNew(secondDir));

    return new CubePart(points);
  }

  static createCubePartsAt(vec) {
    const cubeParts = [];

    function buildParts(v1, v2) {
      cubeParts.push(CubePart.ofNormVecs(v1.clone(), v2.clone()).move(vec));
      cubeParts.push(CubePart.ofNormVecs(v1.clone(), v2.clone(), true).move(vec));
      cubeParts.push(CubePart.ofNormVecs(v1.clone(), v2.clone().invert()).move(vec));
      cubeParts.push(CubePart.ofNormVecs(v1.clone(), v2.clone().invert(), true).move(vec));
      cubeParts.push(CubePart.ofNormVecs(v1.clone().invert(), v2.clone()).move(vec));
      cubeParts.push(CubePart.ofNormVecs(v1.clone().invert(), v2.clone(), true).move(vec));
      cubeParts.push(CubePart.ofNormVecs(v1.clone().invert(), v2.clone().invert()).move(vec));
      cubeParts.push(CubePart.ofNormVecs(v1.clone().invert(), v2.clone().invert(), true).move(vec));
    }

    buildParts(Vec.normX(), Vec.normY());
    buildParts(Vec.normX(), Vec.normZ());
    buildParts(Vec.normY(), Vec.normX());
    buildParts(Vec.normY(), Vec.normZ());
    buildParts(Vec.normZ(), Vec.normX());
    buildParts(Vec.normZ(), Vec.normY());

    return cubeParts;
  }

  static createCubePartAt(vec, num) {
    let cubePart;
    let mainDir, secondDir;

    const near = num % 8 < 4;
    const dir = Math.floor(num / 8);
    const sDir = num % 4;
    if (dir === 0) { // +x
      mainDir = Vec.normX();
      secondDir = sDir < 2 ? Vec.normZ() : Vec.normY();
    }
    else if (dir === 1) {  // +z
      mainDir = Vec.normZ();
      secondDir = sDir < 2 ? Vec.normX() : Vec.normY();
    }
    else if (dir === 2 || dir === 3) { // +y || +y flat
      mainDir = Vec.normY();
      secondDir = sDir < 2 ? Vec.normX() : Vec.normZ();
    }
    else
      throw new Error('invalid dir: ' + dir);

    if (sDir % 2 !== 0)
      secondDir.invert();

    if (dir <= 2)
      cubePart = CubePart.ofNormVecs(mainDir, secondDir, near).move(vec);
    else {
      const points = [
        Vec.nullVec(),
        Vec.nullVec().addToNew(mainDir),
        Vec.nullVec().addToNew(mainDir).addToNew(secondDir),
        Vec.nullVec().addToNew(mainDir).addToNew(secondDir).addToNew(secondDir),
        Vec.nullVec().addToNew(mainDir).addToNew(secondDir.clone().invert()),
      ];

      cubePart = (new CubePart(points)).move(vec);
    }

    return cubePart;
  }

  clone() {
    const points = [];
    for (const point of this.points) {
      points.push(point.clone());
    }

    return new CubePart(points, this.color);
  }

  move(vec) {
    this.pointSet.clear();
    for (const point of this.points) {
      point.add(vec);
      this.pointSet.add(point.hash());
    }
    return this;
  }

  containsVec(point) {
    return this.pointSet.has(point.hash());
  }

  containedIn(min, max) {
    for (const point of this.points) {
      if (!point.containedIn(min, max))
        return false;
    }
    return true;
  }

  envelope() {
    const env = [];
    const tmpSet = new Set();

    for (const point of this.points) {
      const pointEnv = point.envelope();
      for (const pe of pointEnv) {
        if (!this.containsVec(pe) && !tmpSet.has(pe.toString())) {
          tmpSet.add(pe.toString());
          env.push(pe);
        }
      }
    }

    return env;
  }

  toString() {
    return `{${this.points}}`;
  }

  draw(scene, drawSolid, drawStriking) {
    for (const threeCube of this.getThree(drawSolid, drawStriking)) {
      scene.add(threeCube);
    }
  }

  toObject() {
    return { color: this.color, points: this.points.map(p => p.toObject()) };
  }

  static fromObject(obj) {
    return new CubePart(obj.points.map(p => Vec.fromObject(p)), obj.color);
  }
}

export { CubePart };