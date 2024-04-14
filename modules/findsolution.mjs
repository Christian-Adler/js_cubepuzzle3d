import {Cube} from "./cube.mjs";
import {Vec} from "./vec.mjs";
import {CubePart} from "./cubepart.mjs";
import {out} from "./util.mjs";

const alreadyVisited = new Set();
const solutions = [];
let startCube = new Cube({});
alreadyVisited.add(startCube.hash());

let count = 0;
let workList = [startCube];
let actDrawCube = null;

const findSolution = (scene, doSingleStep) => {

  if (solutions.length === 0 && workList.length !== 0 && (typeof doSingleStep !== "boolean" || doSingleStep)) {
    count++;
    const cube = workList.pop();
    if (count % 1000 === 0) {
      out(count);
      out(workList.length);
    }
    actDrawCube = cube;

    let checkPoints;
    if (cube.isEmpty())
      checkPoints = [Vec.nullVec()];
    else
      checkPoints = [...cube.envelope()];

    for (const checkPoint of checkPoints) {
      const cps = CubePart.createCubePartsAt(checkPoint).filter(cp => Cube.containedInCubeCubePart(cp));
      for (const cubePart of cps) {
        const clonedCube = cube.clone();
        if (clonedCube.tryAddCubePart(cubePart)) {
          cubePart.initThree();

          if (clonedCube.isFilled()) {
            out("Found solution");
            solutions.push(clonedCube);
            workList = [];
          } else {
            let hash = clonedCube.hash();
            if (!alreadyVisited.has(hash)) {
              alreadyVisited.add(hash);
              // workList.unshift(clonedCube); // too much memory
              workList.push(clonedCube);
            } else
              out("Hash already in list");
          }
        }
      }
    }
  }

  if (solutions.length > 0) {
    // out(solutions);
    actDrawCube = solutions[0];
  }

  if (actDrawCube)
    actDrawCube.draw(scene);
};
export {findSolution};