import {areSetsEqual} from "./util.mjs";

class Cube {
  static min = 0;
  static max = 4;

  constructor({cubeParts = []}) {
    this.cubeParts = cubeParts;
    this.pointSet = new Set();
    for (const cubePart of cubeParts) {
      cubePart.pointSet.forEach((point) => {
        this.pointSet.add(point.toString());
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

  isFreeVec(vec) {
    return !this.pointSet.has(vec.toString());
  }

  tryAddCubePart(cubePart) {
    if (!Cube.containedInCubeCubePart(cubePart))
      return false;

    for (const point of cubePart.points) {
      if (this.pointSet.has(point.toString()))
        return false;
    }

    this.cubeParts.push(cubePart);
    for (const pointSetElement of cubePart.pointSet) {
      this.pointSet.add(pointSetElement);
    }

    return true
  }

  envelope() {
    let env = [];
    for (const cubePart of this.cubeParts) {
      env = env.concat(cubePart.envelope());
    }

    // remove duplicates
    const tmp = [...env];
    env = [];
    const tmpSet = new Set();
    for (const vec of tmp) {
      let hash = vec.toString();
      if (!tmpSet.has(hash)) {
        tmpSet.add(hash);
        env.push(vec);
      }
    }

    env = env.filter(v => v.containedIn(Cube.min, Cube.max) && this.isFreeVec(v));
    return env;
  }

  static containedInCubeCubePart(cubePart) {
    return cubePart.containedIn(Cube.min, Cube.max);
  }


  isFilled() {
    return this.cubeParts.length === 25;
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

  draw(scene) {
    for (const cubePart of this.cubeParts) {
      cubePart.draw(scene);
    }
  }
}

export {Cube};