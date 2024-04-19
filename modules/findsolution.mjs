import {Cube} from "./cube.mjs";
import {Vec} from "./vec.mjs";
import {CubePart} from "./cubepart.mjs";
import {out} from "./util.mjs";
import {Linkedlist} from "./linkedlist.mjs";
import {Hashes} from "./Hashes.mjs";

const alreadyVisited = new Hashes();
const solutions = [];
let startCube = new Cube({});
alreadyVisited.add(startCube.numCubeParts(), startCube.hash());

let count = 0;
let workList = new Linkedlist();
workList.addOnHead(startCube);
let actDrawCube = null;

function calcNextStep() {
  count++;
  const cube = workList.pop();
  if (count % 1000 === 0) {
    out(`count: ${count}, worklist: ${workList.length()}, hashes: ${alreadyVisited.size()}`);
  }
  actDrawCube = cube;

  let checkPoints;
  if (cube.isEmpty())
    checkPoints = [Vec.nullVec()];
  else
    checkPoints = [...cube.envelope()];

  // sort points?
  checkPoints.sort(function (a, b) {
    return a.compareTo(b);
  });
  checkPoints.reverse();

  // shuffle
  // shuffle(checkPoints);


  // find holes
  for (const envVec of checkPoints) {
    const pointEnvelope = envVec.envelope().filter(v => v.containedIn(Cube.min, Cube.max) && cube.isFreeVec(v));
    if (pointEnvelope.length === 0) {
      // out("found hole!");
      return;
    }
    if (pointEnvelope.length === 1) {
      // Edgecase Ecke
      if (envVec.isOnEdge(Cube.min, Cube.max)) {
        // out("found edge in envelope!");
        const normVec = pointEnvelope[0].subToNew(envVec);
        // out(normVec.toString());
        if (!cube.isFreeVec(envVec.addToNew(normVec.multToNew(2))) || !cube.isFreeVec(envVec.addToNew(normVec.multToNew(3)))) {
          // out("found edge with to less space!");
          return;
        }
      }
      // only free neighbour as well only one free neighbor -> hole with 2
      if (pointEnvelope[0].envelope().length === 1) {
        out("found hole with only two neighbours!");
        return;
      }
    }
  }

  const prevCube = cube.getPrevCube();

  let isFirst = true;
  let foundNoNext = true;
  for (const checkPoint of checkPoints) {
    const cps = CubePart.createCubePartsAt(checkPoint).filter(cp => Cube.containedInCubeCubePart(cp));
    for (const cubePart of cps) {
      // test if prev cube + cubePart is already in list
      const prevCubeClone = prevCube.clone()
      prevCubeClone.tryAddCubePart(cubePart);
      if (alreadyVisited.has(prevCubeClone.numCubeParts(), prevCubeClone.hash())) {
        // out("Found hash of prev cube + act cubePart!");
        continue;
      }

      const clonedCube = cube.clone();
      if (clonedCube.tryAddCubePart(cubePart)) {
        if (clonedCube.isFilled()) {
          out("Found solution");
          solutions.push(clonedCube);
          workList.clear();
          alreadyVisited.clear();
          out("return");
          return;
        } else {
          let hash = clonedCube.hash();
          if (alreadyVisited.add(clonedCube.numCubeParts(), hash)) {
            // if (isFirst) {
            //   isFirst = false;
            //   workList.unshift(clonedCube);
            // } // too much memory
            // else
            workList.addOnHead(clonedCube);
            // workList.addOnTail(clonedCube);
            foundNoNext = false;
          }
          // else
          //   out("Hash already in list");
        }
      }
    }
  }
  if (foundNoNext)
    out("found no next");
}

const findSolution = (doSingleStep) => {

  if (solutions.length === 0 && workList.length() !== 0 && (typeof doSingleStep !== "boolean" || doSingleStep)) {
    calcNextStep();
  }

  if (solutions.length > 0) {
    // out(solutions);
    actDrawCube = solutions[0];
    out(actDrawCube);
    return true;
  }
  return false;
};

const drawActNode = (scene) => {
  if (actDrawCube)
    actDrawCube.draw(scene);
}

export {findSolution, drawActNode};