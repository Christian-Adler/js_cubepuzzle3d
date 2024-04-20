import { Cube } from './cube.mjs';
import { Vec } from './vec.mjs';
import { CubePart } from './cubepart.mjs';
import { msToHMS, out, txtOut } from './util.mjs';
import { LinkedList } from './linkedlist.mjs';
import { WorkListItem } from './workListItem.mjs';

// const alreadyVisited = new Hashes();
const solutions = [];
let startCube = new Cube({});
// alreadyVisited.add(startCube.numCubeParts(), startCube.hash());

let start = new Date().getTime();
let count = 0;
let foundHolesCount = 0;
let workList = new LinkedList();

const storeActState = () => {
  const obj = {
    duration: new Date().getTime() - start,
    count,
    foundHolesCount,
    workList: workList.toObject()
  };

  localStorage.setItem('actState', JSON.stringify(obj));
};

const stored = localStorage.getItem('actState');
if (stored) {
  const storedObj = JSON.parse(stored);
  start -= storedObj.duration;
  count = storedObj.count;
  foundHolesCount = storedObj.foundHolesCount;
  workList = LinkedList.fromObject(storedObj.workList);
  txtOut('From Strore...');
}
else {
  workList.addOnHead(new WorkListItem(startCube, Vec.nullVec(), 0));
  txtOut('From Start...');
}

let actDrawCube = null;

function calcNextStep() {
  count++;
  const workListItem = workList.pop();
  const cube = workListItem.cube;
  if (count % 100000 === 0) {
    // out(`count: ${count}, worklist: ${workList.length()}, hashes: ${alreadyVisited.size()}`);

    txtOut(`count: ${count}, worklist: ${workList.length()}, foundHolesCount: ${foundHolesCount}, duration: ${msToHMS(new Date().getTime() - start)}`);
    storeActState();
  }
  // out(`count: ${count}, worklist: ${workList.length()}`);
  actDrawCube = cube;

  // add same pos with next cube step to worklist
  if (workListItem.cubePartStep < 27) { //28-1
    workList.addOnHead(new WorkListItem(cube.clone(), workListItem.cubePartVec, workListItem.cubePartStep + 1));
  }

  if (cube.tryAddCubePart(CubePart.createCubePartAt(workListItem.cubePartVec, workListItem.cubePartStep))) {
    if (cube.isFilled()) {
      txtOut('Found solution');
      solutions.push(cube);
      workList.clear();
      out('return');
    }
    else {
      const checkPoints = cube.envelope();

      // sort points?
      checkPoints.sort(function (a, b) {
        return a.compareTo(b);
      });

      // find holes
      for (const envVec of checkPoints) {
        const pointEnvelope = envVec.envelope().filter(v => v.containedIn(Cube.min, Cube.max) && cube.isFreeVec(v));
        if (pointEnvelope.length === 0) {
          // out("found hole!");
          foundHolesCount++;
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
              foundHolesCount++;
              return;
            }
          }
          // only free neighbour as well only one free neighbor -> hole with 2
          if (pointEnvelope[0].envelope().length === 1) {
            out('found hole with only two neighbours!');
            return;
          }
        }
      }

      const nextVec = checkPoints[0];
      workList.addOnHead(new WorkListItem(cube, nextVec, 0));
    }
  }
  else
    calcNextStep();
}

const findSolution = (doSingleStep) => {

  if (solutions.length === 0 && workList.length() !== 0 && (typeof doSingleStep !== 'boolean' || doSingleStep)) {
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
};

export { findSolution, drawActNode };