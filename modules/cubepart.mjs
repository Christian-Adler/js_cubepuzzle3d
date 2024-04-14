import {Vec} from './vec.mjs';
import {randColor} from "./util.mjs";
import * as THREE from "./three.module.js";

class CubePart {
  constructor(points, color, initThree) {
    this.points = points;
    this.pointSet = new Set();
    this.threeCubes = [];
    this.color = color || randColor();

    for (const point of points) {
      this.pointSet.add(point.toString());
    }

    if (initThree)
      this.initThree()
  }

  initThree() {
    const dimension = 0.9;
    const geometry = new THREE.BoxGeometry(dimension, dimension, dimension);
// const material = new THREE.MeshBasicMaterial({color: 0x049ef4, wireframe: false, fog: true});
// const material = new THREE.MeshStandardMaterial({color: 0x049ef4, wireframe: false, fog: true});
    const material = new THREE.MeshBasicMaterial({color: this.color, wireframe: true, transparent: true, opacity: 0.5})
// const material = new THREE.MeshNormalMaterial({wireframe: true});

    for (const point of this.points) {

      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = point.x;
      cube.position.y = point.y;
      cube.position.z = point.z;
      this.threeCubes.push(cube);
    }
  }

  static ofNormVecs(mainDir, secondDir) {
    const points = [
      Vec.nullVec(),
      Vec.nullVec().addToNew(mainDir),
      Vec.nullVec().addToNew(mainDir.multToNew(2)),
      Vec.nullVec().addToNew(mainDir.multToNew(3)),
      Vec.nullVec().addToNew(mainDir).addToNew(secondDir),
    ];

    return new CubePart(points);
  }

  static createCubePartsAt(vec) {
    const cubeParts = [];

    function buildParts(v1, v2) {
      cubeParts.push(CubePart.ofNormVecs(v1.clone(), v2.clone()).move(vec));
      cubeParts.push(CubePart.ofNormVecs(v1.clone(), v2.clone().invert()).move(vec));
      cubeParts.push(CubePart.ofNormVecs(v1.clone().invert(), v2.clone()).move(vec));
      cubeParts.push(CubePart.ofNormVecs(v1.clone().invert(), v2.clone().invert()).move(vec));
    }

    buildParts(Vec.normX(), Vec.normY());
    buildParts(Vec.normX(), Vec.normZ());
    buildParts(Vec.normY(), Vec.normX());
    buildParts(Vec.normY(), Vec.normZ());
    buildParts(Vec.normZ(), Vec.normX());
    buildParts(Vec.normZ(), Vec.normY());

    return cubeParts;
  }

  clone() {
    const points = [];
    for (const point of this.points) {
      points.push(point.clone());
    }
    const initThree = this.threeCubes.length > 0;

    return new CubePart(points, this.color, initThree);
  }

  move(vec) {
    this.pointSet.clear();
    for (const point of this.points) {
      point.add(vec);
      this.pointSet.add(point.toString());
    }
    return this;
  }

  containsVec(point) {
    return this.pointSet.has(point.toString());
  }

  intersects(otherCubePart) {
    for (const point of this.points) {
      if (otherCubePart.containsVec(point))
        return true;
    }
    return false;
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

  draw(scene) {
    for (const threeCube of this.threeCubes) {
      scene.add(threeCube);
    }
  }
}

export {CubePart};