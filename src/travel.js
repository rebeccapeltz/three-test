import * as THREE from 'three';
import { GLTFExporter } from "./jsm/exporters/GLTFExporter.js";
import { OrbitControls } from './jsm/controls/OrbitControls.js';
const URL1 = "https://res.cloudinary.com/molip/image/upload/y_60,l_text:Arial_70_bold:Valentia:CITY,co_rgb:B90FAE,g_south,h_1024,w_1024,c_limit,f_auto,q_auto:best/hackerthon_2022/travel/city";
const URL2 = "https://res.cloudinary.com/molip/image/upload/y_60,l_text:Arial_70_bold:Valentia:STREET,co_rgb:B90FAE,g_south,h_1024,w_1024,c_limit,f_auto,q_auto:best/hackerthon_2022/travel/street";
const URL3 = "https://res.cloudinary.com/molip/image/upload/y_60,l_text:Arial_70_bold:Valentia:MUSEUM,co_rgb:B90FAE,g_south,h_1024,w_1024,c_limit,f_auto,q_auto:best/hackerthon_2022/travel/museum";
const URL4 = "https://res.cloudinary.com/molip/image/upload/y_60,l_text:Arial_70_bold:Valentia:HARBOR,co_rgb:B90FAE,g_south,h_1024,w_1024,c_limit,f_auto,q_auto:best/hackerthon_2022/travel/harbor";
const URL5 = "https://res.cloudinary.com/molip/image/upload/y_60,l_text:Arial_70_bold:Valentia:MARKET,co_rgb:B90FAE,g_south,h_1024,w_1024,c_limit,f_auto,q_auto:best/hackerthon_2022/travel/market";
const URL6 = "https://res.cloudinary.com/molip/image/upload/y_60,l_text:Arial_70_bold:Valentia:OLD_DOOR,co_rgb:B90FAE,g_south,h_1024,w_1024,c_limit,f_auto,q_auto:best/hackerthon_2022/travel/old_door";

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

    var material = [
        URL1, URL2, URL3, URL4, URL5, URL6
    ].map(pic => {
        let texture = textureLoader.load(pic)
        texture.encoding = THREE.sRGBEncoding;
        // debugger
        return new THREE.MeshLambertMaterial({ map: texture });
        return new THREE.MeshLambertMaterial({map: textureLoader.load(pic).encoding=THREE.sRGBEncoding});
    });
    // const texture = textureLoader.load("https://res.cloudinary.com/picturecloud7/image/upload/h_1024,w_1024,c_limit,f_auto,q_auto:best/saddle-rock-columbia-river_vzx2br");
    // texture.encoding = THREE.sRGBEncoding;

    const geometry = new THREE.BoxBufferGeometry(3, 3, 3);
    // const material = new THREE.MeshStandardMaterial({ map: texture });
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
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.003;
    mesh.rotation.z += 0.003;
}

function render() {
    renderer.render(scene, camera);
}

init();

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    console.log("container width:",container.width)
    console.log("container height:",container.height)


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
