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
    out(`count: ${count}, worklist: ${workList.length}, hashes: ${alreadyVisited.size}`);
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


  // find holes
  for (const envVec of checkPoints) {
    const pointEnvelope = envVec.envelope().filter(v => v.containedIn(Cube.min, Cube.max) && cube.isFreeVec(v));
    if (pointEnvelope.length === 0) {
      // out("found hole!");
      return;
    }
    // Edgecase Ecke
    if (pointEnvelope.length === 1 && envVec.isOnEdge(Cube.min, Cube.max)) {
      // out("found edge in envelope!");
      const normVec = pointEnvelope[0].subToNew(envVec);
      // out(normVec.toString());
      if (!cube.isFreeVec(envVec.addToNew(normVec.multToNew(2))) || !cube.isFreeVec(envVec.addToNew(normVec.multToNew(3)))) {
        // out("found edge with to less space!");
        return;
      }
    }
  }


  let firstAdd = true;

  for (const checkPoint of checkPoints) {
    const cps = CubePart.createCubePartsAt(checkPoint).filter(cp => Cube.containedInCubeCubePart(cp));
    for (const cubePart of cps) {
      const clonedCube = cube.clone();
      if (clonedCube.tryAddCubePart(cubePart)) {
        if (clonedCube.isFilled()) {
          out("Found solution");
          solutions.push(clonedCube);
          workList = [];
          alreadyVisited.clear();
          out("return");
          return;
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