// sceneSetup.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(30, 20, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xd3d3d3);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight, false);
document.getElementById('container').appendChild(renderer.domElement);

// Materials with polygon offset to fix z-fighting
const buildingMaterial = new THREE.MeshBasicMaterial({ color: 0x0077ff, side: THREE.FrontSide });
const roofMaterial = new THREE.MeshBasicMaterial({
    color: 0x808080,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
});

// Ground plane with initial grass texture
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load('images/grass.jpg');
const gravelTexture = textureLoader.load('images/gravel.jpg');
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
gravelTexture.wrapS = gravelTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(10, 10);
gravelTexture.repeat.set(10, 10);

const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ map: grassTexture });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
scene.add(ground);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;
controls.target.set(0, 5, 0);

// Initial building
let building, roof;
function createBuilding() {
    const width = +document.getElementById("widthControl").value;
    const height = +document.getElementById("heightControl").value;
    const length = +document.getElementById("lengthControl").value;
    const pitch = +document.getElementById("pitchControl").value; // New pitch value (e.g., 0.5 to 2.0)
    const roofStyle = document.getElementById("roofControl").value;

    scene.remove(building);
    scene.remove(roof);

    const baseGeometry = new THREE.BoxGeometry(width, height, length);
    building = new THREE.Mesh(baseGeometry, buildingMaterial);
    building.position.y = height / 2;
    scene.add(building);

    if (roofStyle === "flat") {
        const roofGeometry = new THREE.BoxGeometry(width + 0.2, 0.5, length + 0.2);
        roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = height + 0.25;
    } else if (roofStyle === "gabled") {
        // Hip roof with adjustable pitch
        const roofHeight = 2.5 * pitch; // Scale roof height based on pitch
        const roofGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -width / 2 - 0.2, height, -length / 2 - 0.2,  // 0: Bottom left front
            width / 2 + 0.2, height, -length / 2 - 0.2,   // 1: Bottom right front
            width / 2 + 0.2, height, length / 2 + 0.2,    // 2: Bottom right back
            -width / 2 - 0.2, height, length / 2 + 0.2,   // 3: Bottom left back
            0, height + roofHeight, 0,                     // 4: Central peak
        ]);
        const indices = [
            0, 1, 4,  // Front face
            1, 2, 4,  // Right face
            2, 3, 4,  // Back face
            3, 0, 4,  // Left face
            0, 3, 2,
            0, 2, 1,
        ];
        roofGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        roofGeometry.setIndex(indices);
        roofGeometry.computeVertexNormals();
        roof = new THREE.Mesh(roofGeometry, roofMaterial);
    } else if (roofStyle === "aframe") {
        // A-frame roof with adjustable pitch
        const roofHeight = 2.5 * pitch; // Scale roof height based on pitch
        const roofGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -width / 2 - 0.2, height, -length / 2 - 0.2,  // 0: Bottom left front
            width / 2 + 0.2, height, -length / 2 - 0.2,   // 1: Bottom right front
            width / 2 + 0.2, height, length / 2 + 0.2,    // 2: Bottom right back
            -width / 2 - 0.2, height, length / 2 + 0.2,   // 3: Bottom left back
            0, height + roofHeight, -length / 2 - 0.2,    // 4: Ridge front
            0, height + roofHeight, length / 2 + 0.2,     // 5: Ridge back
        ]);
        const indices = [
            0, 1, 4,
            2, 3, 5,
            0, 4, 3,
            3, 4, 5,
            1, 2, 5,
            1, 5, 4,
            0, 3, 2,
            0, 2, 1,
        ];
        roofGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        roofGeometry.setIndex(indices);
        roofGeometry.computeVertexNormals();
        roof = new THREE.Mesh(roofGeometry, roofMaterial);
    }
    scene.add(roof);
}

// Initial render
createBuilding();