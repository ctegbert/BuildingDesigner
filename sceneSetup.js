// sceneSetup.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(30, 15, 30); // Default position without zoom control

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xd3d3d3);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight, false);
document.getElementById('container').appendChild(renderer.domElement);

// Materials with optimized corrugated metal siding texture
const textureLoader = new THREE.TextureLoader();
const sidingTexture = textureLoader.load('images/siding.jpg', 
    () => console.log("Siding texture loaded successfully"), // Success callback
    undefined, 
    (err) => console.error("Error loading siding texture:", err) // Error callback
);
sidingTexture.wrapS = sidingTexture.wrapT = THREE.RepeatWrapping;
sidingTexture.repeat.set(1, 1); // Initial repeat, adjusted dynamically

const buildingMaterial = new THREE.MeshBasicMaterial({
    map: sidingTexture, // Base texture
    side: THREE.FrontSide,
    color: 0xffffff // Neutral white to let texture show through
});
const roofMaterial = new THREE.MeshBasicMaterial({
    map: sidingTexture, // Use same texture for roof
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
    color: 0xffffff // Neutral white to let texture show through
});

// Ground plane with initial grass texture (increased to 120x120)
const grassTexture = textureLoader.load('images/grass.jpg');
const gravelTexture = textureLoader.load('images/gravel.jpg');
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
gravelTexture.wrapS = gravelTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(12, 12);
gravelTexture.repeat.set(12, 12);

const groundGeometry = new THREE.PlaneGeometry(120, 120);
const groundMaterial = new THREE.MeshBasicMaterial({ map: grassTexture });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
scene.add(ground);

// Lighting (ambient only, as per your reversion)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

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
    const pitch = +document.getElementById("pitchControl").value;
    const roofStyle = document.getElementById("roofControl").value;

    scene.remove(building);
    scene.remove(roof);

    // Adjust siding texture repeat based on building dimensions for vertical ribs
    const ribScaleX = width / 2; // Horizontal repeat based on width (fewer ribs across width)
    const ribScaleY = height / 2; // Vertical repeat based on height (fewer ribs across height)
    const ribScaleZ = length / 2; // Depth repeat based on length
    sidingTexture.repeat.set(ribScaleX, ribScaleY); // Apply to building

    const baseGeometry = new THREE.BoxGeometry(width, height, length);
    building = new THREE.Mesh(baseGeometry, buildingMaterial);
    building.position.y = height / 2;
    scene.add(building);

    // Adjust siding texture for roof to align with building
    if (roofStyle === "flat") {
        const roofGeometry = new THREE.BoxGeometry(width + 0.2, 0.5, length + 0.2);
        roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = height + 0.25;
        sidingTexture.repeat.set(ribScaleX, ribScaleZ); // Align with building's width and length
    } else if (roofStyle === "gabled") {
        const roofHeight = 2.5 * pitch;
        const roofGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -width / 2 - 0.2, height, -length / 2 - 0.2, // 0
            width / 2 + 0.2, height, -length / 2 - 0.2,  // 1
            width / 2 + 0.2, height, length / 2 + 0.2,   // 2
            -width / 2 - 0.2, height, length / 2 + 0.2,  // 3
            0, height + roofHeight, 0                    // 4
        ]);
        const indices = [
            0, 1, 4, 1, 2, 4, 2, 3, 4, 3, 0, 4, // Roof faces
            0, 3, 2, 0, 2, 1                     // Base face
        ];
        roofGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        roofGeometry.setIndex(indices);
        roofGeometry.computeVertexNormals();

        // Add UV coordinates for gabled roof
        const uvs = new Float32Array([
            // UVs for roof faces (0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4)
            0, 0, 1, 0, 0.5, 1,  // Face 0-1-4
            0, 0, 1, 0, 0.5, 1,  // Face 1-2-4
            0, 0, 1, 0, 0.5, 1,  // Face 2-3-4
            0, 0, 1, 0, 0.5, 1,  // Face 3-0-4
            // UVs for base face (0, 3, 2), (0, 2, 1)
            0, 0, 1, 0, 1, 1,    // Face 0-3-2
            0, 0, 1, 1, 0, 1     // Face 0-2-1
        ]);
        roofGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        roof = new THREE.Mesh(roofGeometry, roofMaterial);
        sidingTexture.repeat.set(ribScaleX, ribScaleZ); // Align with building's width and length
    } else if (roofStyle === "aframe") {
        const roofHeight = 2.5 * pitch;
        const roofGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -width / 2 - 0.2, height, -length / 2 - 0.2, // 0
            width / 2 + 0.2, height, -length / 2 - 0.2,  // 1
            width / 2 + 0.2, height, length / 2 + 0.2,   // 2
            -width / 2 - 0.2, height, length / 2 + 0.2,  // 3
            0, height + roofHeight, -length / 2 - 0.2,   // 4
            0, height + roofHeight, length / 2 + 0.2     // 5
        ]);
        const indices = [
            0, 1, 4, 2, 3, 5, 0, 4, 3, 3, 4, 5, // Roof faces
            1, 2, 5, 1, 5, 4, 0, 3, 2, 0, 2, 1  // Base faces
        ];
        roofGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        roofGeometry.setIndex(indices);
        roofGeometry.computeVertexNormals();

        // Add UV coordinates for A-frame roof
        const uvs = new Float32Array([
            // UVs for roof faces (0, 1, 4), (2, 3, 5), (0, 4, 3), (3, 4, 5)
            0, 0, 1, 0, 0.5, 1,  // Face 0-1-4
            0, 0, 1, 0, 0.5, 1,  // Face 2-3-5
            0, 0, 0.5, 1, 1, 0,  // Face 0-4-3
            0, 0, 0.5, 1, 1, 0,  // Face 3-4-5
            // UVs for base faces (1, 2, 5), (1, 5, 4), (0, 3, 2), (0, 2, 1)
            0, 0, 1, 0, 0.5, 1,  // Face 1-2-5
            0, 0, 0.5, 1, 1, 0,  // Face 1-5-4
            0, 0, 1, 0, 1, 1,    // Face 0-3-2
            0, 0, 1, 1, 0, 1     // Face 0-2-1
        ]);
        roofGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        roof = new THREE.Mesh(roofGeometry, roofMaterial);
        sidingTexture.repeat.set(ribScaleX, ribScaleZ); // Align with building's width and length
    }
    sidingTexture.needsUpdate = true; // Ensure texture updates with new repeats
    scene.add(roof);
}

// Initial render
createBuilding();