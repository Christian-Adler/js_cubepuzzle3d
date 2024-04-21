import * as THREE from './modules/three.module.js';
import {CubePart} from './modules/cubepart.mjs';
import {Cube} from './modules/cube.mjs';
import {Vec} from './modules/vec.mjs';
import {drawActNode, findSolution} from './modules/findsolution.mjs';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const scene = new THREE.Scene();
scene.background = new THREE.Color().setHSL(0.6, 0, 0.1);
scene.fog = new THREE.Fog(scene.background, 1, 5000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


// SingleStep??
let doSingleStep = null;
if (urlParams.has('singleStep')) {
  doSingleStep = true;
  window.addEventListener('click', () => {
    doSingleStep = true;
  }, false);
}

// highlight cube part
let highLightPart = 0;
window.addEventListener('keydown', (evt) => {
  if (evt.key === 'ArrowUp') {
    highLightPart++;
    if (highLightPart > 26) highLightPart = 26;
  } else if (evt.key === 'ArrowDown') {
    highLightPart--;
    if (highLightPart < 0) highLightPart = 0;
  }
}, false);

const cameraRadius = 10;
camera.position.z = cameraRadius;
camera.position.y = cameraRadius / 2;
let angle = 0;
const angleDelta = -0.01;

scene.translateX(-2);
scene.translateZ(-2);

if (false)
  localStorage.removeItem('actState');
if (true) {
  function drawScene(foundSolution) {
    scene.clear();

    const drawConfig = {
      drawSolidUpTo: 0,
      opacity: 0.8,
      dimension: 0.9,
      color: null,
      highlightPartNo: -1
    };
    if (foundSolution) {
      drawConfig.drawSolidUpTo = 25;
      drawConfig.dimension = 0.3;
      drawConfig.highlightPartNo = highLightPart;
    }

    drawActNode(scene, drawConfig);

    // Move Camera
    angle += angleDelta;
    if (angle > Math.PI * 2)
      angle = 0;
    // camera.position.z += 0.001;
    camera.position.z = cameraRadius * Math.cos(angle);
    camera.position.x = cameraRadius * Math.sin(angle);
    // camera.position.y = cameraRadius * Math.cos(angle);
    camera.lookAt(0, 2, 0);

    renderer.render(scene, camera);
  }

  function animate() {
    let foundSolution = false;
    if (typeof doSingleStep === 'boolean') {
      findSolution(doSingleStep);
      foundSolution = doSingleStep = false;
    } else {
      for (let i = 0; i < 1000; i++) {
        foundSolution = findSolution(null);
        if (foundSolution)
          break;
      }
    }

    drawScene(foundSolution);

    requestAnimationFrame(animate);
  }

  animate();
}

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