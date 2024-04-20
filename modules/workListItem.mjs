import { Cube } from './cube.mjs';
import { Vec } from './vec.mjs';

class WorkListItem {
  constructor(cube, cubePartVec, cubePartStep) {
    this.cube = cube;
    this.cubePartVec = cubePartVec;
    this.cubePartStep = cubePartStep;
  }

  toObject() {
    return {
      cube: this.cube.toObject(),
      cubePartVec: this.cubePartVec.toObject(),
      cubePartStep: this.cubePartStep
    };
  }

  static fromObject(obj) {
    return new WorkListItem(Cube.fromObject(obj.cube), Vec.fromObject(obj.cubePartVec), obj.cubePartStep);
  }
}

export { WorkListItem };