import * as THREE from './modules/three.module.js';
import {CubePart} from "./modules/cubepart.mjs";
import {Cube} from "./modules/cube.mjs";
import {Vec} from "./modules/vec.mjs";
import {drawActNode, findSolution} from "./modules/findsolution.mjs";

const scene = new THREE.Scene();
scene.background = new THREE.Color().setHSL(0.6, 0, 0.1);
scene.fog = new THREE.Fog(scene.background, 1, 5000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// SingleStep??
let doSingleStep = null;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has('singleStep')) {
  doSingleStep = true;
  window.addEventListener('click', () => {
    doSingleStep = true;
  }, false);
}

// const geometry = new THREE.BoxGeometry(4, 1, 1);
// // const material = new THREE.MeshBasicMaterial({color: 0x049ef4, wireframe: false, fog: true});
// // const material = new THREE.MeshStandardMaterial({color: 0x049ef4, wireframe: false, fog: true});
// const material = new THREE.MeshBasicMaterial({color: randColor(), wireframe: true, transparent: true, opacity: 0.5})
// // const material = new THREE.MeshNormalMaterial({wireframe: true});
// const cube = new THREE.Mesh(geometry, material);
// cube.position.z += 1;
// scene.add(cube);
// scene.add(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material));

const cameraRadius = 10;
camera.position.z = cameraRadius;
camera.position.y = cameraRadius / 2;
let angle = 0;
const angleDelta = 0.01;

scene.translateX(-2);
scene.translateZ(-2);

if (true) {
  function drawScene() {
    scene.clear();
    drawActNode(scene);

    // Move Camera
    angle += angleDelta;
    if (angle > Math.PI * 2)
      angle = 0;
    // camera.position.z += 0.001;
    camera.position.z = cameraRadius * Math.sin(angle);
    camera.position.x = cameraRadius * Math.cos(angle);
    // camera.position.y = cameraRadius * Math.cos(angle);
    camera.lookAt(0, 2, 0);

    renderer.render(scene, camera);
  }

  function animate() {
    // requestAnimationFrame(animate);

    if (typeof doSingleStep === "boolean") {
      findSolution(doSingleStep);
      doSingleStep = false;
    } else {
      for (let i = 0; i < 1000; i++) {
        findSolution(null);
      }
    }
    drawScene();

    requestAnimationFrame(animate);
  }

  animate();
}

// // test sort nach y z x
// const points = [Vec.of(0, 0, 0), Vec.of(0, 0, 1), Vec.of(1, 0, 0), Vec.of(0, 1, 0), Vec.of(1, 1, 1)];
// points.sort(function (a, b) {
//   return a.compareTo(b);
// });
// out(points);

if (false) {
  let counter = -1;

  function drawScene2() {
    scene.clear();

    let cube = new Cube({});
    // cube.tryAddCubePart(CubePart.createCubePartAt(Vec.nullVec(), counter));
    cube.tryAddCubePart(CubePart.createCubePartAt(Vec.of(1, 1, 1), counter));

    cube.draw(scene);

    renderer.render(scene, camera);
  }

  function animate2() {
    // requestAnimationFrame(animate);

    if (doSingleStep) {
      counter++;
      if (counter >= 28) counter = 0;
    }
    doSingleStep = false;
    drawScene2();

    requestAnimationFrame(animate2);
  }

  animate2();
}