// import {
//   Scene,
//   Color,
//   PerspectiveCamera,
//   BoxBufferGeometry,
//   MeshStandardMaterial,
//   Mesh,
//   WebGLRenderer,
//   DirectionalLight,
//   HemisphereLight,
//   AmbientLight,
//   TextureLoader,
//   sRGBEncoding
// } from "three";
// import {
//   EffectComposer,
//   BloomEffect,
//   SMAAEffect,
//   RenderPass,
//   EffectPass
// } from 'postprocessing'

import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";


import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { getGPUTier } from "detect-gpu";

const gpu = getGPUTier();
console.log(gpu);

let container;
let camera;
let renderer;
let scene;
let mesh;
let controls;



// function initPostProcessing () {
//   composer = new EffectComposer(renderer)
//   const bloomEffect = new BloomEffect()
//   const smaaEffect = new SMAAEffect(preloader.get('searchImage'), preloader.get('areaImage'))
//   const effectPass = new EffectPass(camera, smaaEffect, bloomEffect)
//   const renderPass = new RenderPass(scene, camera)
//   composer.addPass(renderPass)
//   composer.addPass(effectPass)
//   effectPass.renderToScreen = true
// }

function init() {
  container = document.querySelector("#scene-container");

  // Creating the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("purple");

  createCamera();
  createLights();
  createMeshes();
  createControls();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-2, 2, 10);
}

function createLights() {
  const mainLight = new THREE.DirectionalLight(0xffffff, 5);
  mainLight.position.set(10, 10, 10);

  const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 5);
  scene.add(mainLight, hemisphereLight);
}

function createMeshes() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("./src/uv_test_bw_1024.png");
  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function createRenderer() {
  // renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    antialias: false,
    stencil: false,
    depth: false
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.gammaFactor = 2.2;
  // renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function createControls() {
  controls = new OrbitControls(camera, container);
}

function update() {
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;
  // mesh.rotation.z += 0.01;
}

function render() {
  renderer.render(scene, camera);
}


init();
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new EffectPass(camera, new BloomEffect()));

// requestAnimationFrame(function render() {

requestAnimationFrame(render);
composer.render();

// });

// resize

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // Update camera frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener("resize", onWindowResize, false);

// download functionality
function download() {
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    function (result) {
      saveArrayBuffer(result, "cube.glb");
    },
    { binary: true }
  );
}
function saveArrayBuffer(buffer, filename) {
  save(new Blob([buffer], { type: "application/octet-stream" }), filename);
}
const link = document.createElement("a");
document.body.appendChild(link);

function save(blob, fileName) {
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
document.getElementById("download-glb").addEventListener("click", download);
