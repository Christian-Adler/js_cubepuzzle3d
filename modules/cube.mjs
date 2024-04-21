import {areSetsEqual} from './util.mjs';
import {CubePart} from './cubepart.mjs';

class Cube {
  static min = 0;
  static max = 4;
  static filledPartsNum = Math.pow((Cube.max + 1 - Cube.min), 3) / CubePart.CUBE_PART_SIZE;

  constructor({cubeParts = []}) {
    this.cubeParts = cubeParts;
    this.pointSet = new Set();
    for (const cubePart of cubeParts) {
      cubePart.pointSet.forEach((point) => {
        this.pointSet.add(point);
      });
    }
  }

  clone() {
    const cubeParts = [];
    for (const cubePart of this.cubeParts) {
      cubeParts.push(cubePart.clone());
    }
    return new Cube({cubeParts});
  }

  getPrevCube() {
    const cubeParts = [];
    // copy all except latest
    for (let i = 0; i < this.cubeParts.length - 1; i++) {
      const cubePart = this.cubeParts[i];
      cubeParts.push(cubePart.clone());
    }

    return new Cube({cubeParts});
  }

  isFreeVec(vec) {
    return !this.pointSet.has(vec.hash());
  }

  tryAddCubePart(cubePart) {
    if (!Cube.containedInCubeCubePart(cubePart))
      return false;

    for (const point of cubePart.points) {
      if (this.pointSet.has(point.hash()))
        return false;
    }

    this.cubeParts.push(cubePart);
    for (const pointSetElement of cubePart.pointSet) {
      this.pointSet.add(pointSetElement);
    }

    return true;
  }

  envelope() {
    const tmpSet = new Set();
    let env = [];
    for (const cubePart of this.cubeParts) {
      const tmp = cubePart.envelope();
      // remove duplicates
      for (const vec of tmp) {
        const hash = vec.toString();
        if (!tmpSet.has(hash)) {
          tmpSet.add(hash);
          env.push(vec);
        }
      }
    }

    env = env.filter(v => v.containedIn(Cube.min, Cube.max) && this.isFreeVec(v));
    return env;
  }

  static containedInCubeCubePart(cubePart) {
    return cubePart.containedIn(Cube.min, Cube.max);
  }

  isFilled() {
    return this.cubeParts.length === Cube.filledPartsNum;
  }

  isEmpty() {
    return this.cubeParts.length === 0;
  }

  equals(other) {
    return areSetsEqual(this.pointSet, other.pointSet);
  }

  toString() {
    return `{${this.cubeParts}}`;
  }

  hash() {
    const arr = [...this.pointSet];
    arr.sort();
    return '' + arr;
  }

  numCubeParts() {
    return this.cubeParts.length;
  }

  draw(scene, {drawSolidUpTo, opacity = 0.8, dimension = 0.9, color = null, highlightPartNo = -1}) {
    let c = 0;
    for (const cubePart of this.cubeParts) {
      c++;
      if (highlightPartNo >= c) {
        if (highlightPartNo === c)
          cubePart.draw(scene, {solid: true, opacity: 0.9, dimension: 1, color: 0xffffff});
        else
          cubePart.draw(scene, {solid: false, opacity: 0.9, dimension: 0.9, color});
      } else
        cubePart.draw(scene, {solid: c <= drawSolidUpTo, opacity, dimension, color});
    }
  }

  toObject() {
    return {cubeParts: this.cubeParts.map(p => p.toObject())};
  }

  static fromObject(obj) {
    return new Cube({cubeParts: obj.cubeParts.map(p => CubePart.fromObject(p))});
  }
}

export {Cube};