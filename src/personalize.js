import * as THREE from 'three';
import { GLTFExporter } from './jsm/exporters/GLTFExporter.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';

const pics = [];
let filename;
let container;
let camera;
let renderer;
let scene;
let mesh;
let controls;

document.getElementById('submit-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  filename = document.getElementById('filename').value;
  pics.push(document.getElementById('url1').value);
  pics.push(document.getElementById('url2').value);
  pics.push(document.getElementById('url3').value);
  pics.push(document.getElementById('url4').value);
  pics.push(document.getElementById('url5').value);
  pics.push(document.getElementById('url6').value);
  if (pics.includes(undefined) || !filename) {
    alert('All 6 sides of the cube must have an image. Must enter a filename.');
    return;
  }
  init()
});

function init() {
  container = document.querySelector('#scene-container');

  // Creating the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color('skyblue');

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
  // debugger

  var material = pics.map((pic) => {
    let texture = textureLoader.load(pic);
    texture.encoding = THREE.sRGBEncoding;
    // debugger
    return new THREE.MeshLambertMaterial({ map: texture });
    return new THREE.MeshLambertMaterial({
      map: (textureLoader.load(pic).encoding = THREE.sRGBEncoding),
    });
  });

  const geometry = new THREE.BoxBufferGeometry(3, 3, 3);
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  container.appendChild(renderer.domElement);
}

function createControls() {
  controls = new OrbitControls(camera, container);
}

function update() {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  mesh.rotation.z += 0.01;
}

function render() {
  renderer.render(scene, camera);
}


function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  console.log('container width:', container.width);
  console.log('container height:', container.height);

  // Update camera frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener('resize', onWindowResize, false);

// download
function download() {
    // debugger;
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    function (result) {
      saveArrayBuffer(result, `${filename}.glb`);
    },
    { binary: true }
  );
}
function saveArrayBuffer(buffer, filename) {
  save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
}
const link = document.createElement('a');
document.body.appendChild(link);

function save(blob, fileName) {
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
document.getElementById('download-glb').addEventListener('click', download);
