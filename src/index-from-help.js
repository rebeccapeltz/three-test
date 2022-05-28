import * as THREE from 'three';

import { OrbitControls } from './jsm/controls/OrbitControls.js';

let camera;
let renderer;
let scene;
let mesh;
let controls;

function init() {

	// Creating the scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color("skyblue");

	createCamera();
	createLights();
	createMeshes();
	createRenderer();
	createControls();

	renderer.setAnimationLoop(() => {
		update();
		render();
	});
}

function createCamera() {
	const fov = 35;
	const aspect = window.innerWidth / window.innerHeight;
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
	const texture = textureLoader.load("./textures/uv_grid_opengl.jpg");
	texture.encoding = THREE.sRGBEncoding;

	const geometry = new THREE.BoxGeometry(2, 2, 2);
	const material = new THREE.MeshStandardMaterial({ map: texture });
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

function createRenderer() {
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.physicallyCorrectLights = true;
	document.body.appendChild(renderer.domElement);
}

function createControls() {
	controls = new OrbitControls(camera, renderer.domElement);
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

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;

	// Update camera frustum
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth , window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);
