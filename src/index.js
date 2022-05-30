import * as THREE from 'three';
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { OrbitControls } from './jsm/controls/OrbitControls.js';


let container;
let camera;
let renderer;
let scene;
let mesh;
let controls;

function init() {
    container = document.querySelector("#scene-container");

    // Creating the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");

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
    const texture = textureLoader.load("https://res.cloudinary.com/picturecloud7/image/upload/v1648182154/saddle-rock-columbia-river_vzx2br.avif");
    texture.encoding = THREE.sRGBEncoding;

    const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ map: texture });
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

init();

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;

    // Update camera frustum
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener("resize", onWindowResize, false);

// download

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
