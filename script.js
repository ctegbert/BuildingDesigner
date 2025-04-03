// Create the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(30, 15, 40);

// Set up the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
document.body.appendChild(renderer.domElement);

// Create a box (building)
let geometry = new THREE.BoxGeometry(10, 5, 15);
let material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
let building = new THREE.Mesh(geometry, material);
scene.add(building);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Add OrbitControls for mouse interaction
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Function to update building size
function updateBuilding() {
    let width = document.getElementById("widthControl").value;
    let height = document.getElementById("heightControl").value;
    let length = document.getElementById("lengthControl").value;

    scene.remove(building);
    geometry = new THREE.BoxGeometry(width, height, length);
    building = new THREE.Mesh(geometry, material);
    scene.add(building);
}

// Function to update zoom level
function updateZoom() {
    let zoom = document.getElementById("zoomControl").value;
    camera.position.set(zoom, zoom / 2, zoom * 1.2);
}

// Function to update building color
function updateColor() {
    let color = document.getElementById("colorControl").value;
    material.color.set(color);
}

// Add event listeners for UI controls
document.getElementById("widthControl").addEventListener("input", updateBuilding);
document.getElementById("heightControl").addEventListener("input", updateBuilding);
document.getElementById("lengthControl").addEventListener("input", updateBuilding);
document.getElementById("zoomControl").addEventListener("input", updateZoom);
document.getElementById("colorControl").addEventListener("input", updateColor);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
