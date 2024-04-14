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

function calcNextStep() {
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

  // sort points?
  // checkPoints.sort(function (a, b) {
  //   return a.compareTo(b);
  // });

  // shuffle
  // shuffle(checkPoints);

  for (const checkPoint of checkPoints) {
    const cps = CubePart.createCubePartsAt(checkPoint).filter(cp => Cube.containedInCubeCubePart(cp));
    for (const cubePart of cps) {
      const clonedCube = cube.clone();
      if (clonedCube.tryAddCubePart(cubePart)) {
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

const findSolution = (doSingleStep) => {

  if (solutions.length === 0 && workList.length !== 0 && (typeof doSingleStep !== "boolean" || doSingleStep)) {
    calcNextStep();
  }

  if (solutions.length > 0) {
    // out(solutions);
    actDrawCube = solutions[0];
  }
};

const drawActNode = (scene) => {
  if (actDrawCube)
    actDrawCube.draw(scene);
}

export {findSolution, drawActNode};