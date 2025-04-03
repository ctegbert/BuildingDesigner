// buildingLogic.js
function updateBuilding() {
    createBuilding();
    const width = +document.getElementById("widthControl").value;
    const height = +document.getElementById("heightControl").value;
    const length = +document.getElementById("lengthControl").value;
    updatePrice(width, height, length);
    updateZoom();
}

function updateZoom() {
    const zoom = +document.getElementById("zoomControl").value;
    const height = +document.getElementById("heightControl").value;
    camera.position.set(zoom, zoom / 2, zoom);
    controls.target.set(0, height / 2, 0);
}

function updateBuildingColor(event) {
    const color = event.target.getAttribute('data-color');
    buildingMaterial.color.set(color);
}

function updateRoofColor(event) {
    const color = event.target.getAttribute('data-color');
    roofMaterial.color.set(color);
}

function updateGroundTexture() {
    const texture = document.getElementById("groundTextureControl").value;
    if (texture === "grass") {
        groundMaterial.map = grassTexture;
        groundMaterial.color = null;
    } else if (texture === "gravel") {
        groundMaterial.map = gravelTexture;
        groundMaterial.color = null;
    } else {
        groundMaterial.map = null;
        groundMaterial.color = new THREE.Color(0xffffff);
    }
    groundMaterial.needsUpdate = true;
}

function updatePrice(width, height, length) {
    const volume = width * height * length;
    const cost = volume * 50;
    document.getElementById("price").textContent = `Estimated Cost: $${cost.toLocaleString()}`;
    return cost;
}

function exportPDF() {
    const width = document.getElementById("widthControl").value;
    const height = document.getElementById("heightControl").value;
    const length = document.getElementById("lengthControl").value;
    const buildingColor = document.querySelector('#buildingColorControl .color-option[selected]')?.style.backgroundColor || 'Blue';
    const roofColor = document.querySelector('#roofColorControl .color-option[selected]')?.style.backgroundColor || 'Gray';
    const roofStyle = document.getElementById("roofControl").value;
    const groundTexture = document.getElementById("groundTextureControl").value;
    const cost = updatePrice(width, height, length);

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Building Design Summary", 10, 10);
    doc.setFontSize(12);
    doc.text(`Width: ${width}`, 10, 20);
    doc.text(`Height: ${height}`, 10, 30);
    doc.text(`Length: ${length}`, 10, 40);
    doc.text(`Building Color: ${buildingColor}`, 10, 50);
    doc.text(`Roof Color: ${roofColor}`, 10, 60);
    doc.text(`Roof Style: ${roofStyle}`, 10, 70);
    doc.text(`Ground Texture: ${groundTexture}`, 10, 80);
    doc.text(`Estimated Cost: $${cost.toLocaleString()}`, 10, 90);
    doc.save("building_design.pdf");
}

function takeSnapshot() {
    renderer.render(scene, camera);
    const imgData = renderer.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "building_snapshot.png";
    link.click();
}

// Event listeners
document.getElementById("widthControl").addEventListener("input", updateBuilding);
document.getElementById("heightControl").addEventListener("input", updateBuilding);
document.getElementById("lengthControl").addEventListener("input", updateBuilding);
document.getElementById("zoomControl").addEventListener("input", updateZoom);
document.getElementById("buildingColorControl").addEventListener("click", function(event) {
    if (event.target.classList.contains('color-option')) {
        document.querySelectorAll('#buildingColorControl .color-option').forEach(el => el.removeAttribute('selected'));
        event.target.setAttribute('selected', '');
        updateBuildingColor(event);
    }
});
document.getElementById("roofColorControl").addEventListener("click", function(event) {
    if (event.target.classList.contains('color-option')) {
        document.querySelectorAll('#roofColorControl .color-option').forEach(el => el.removeAttribute('selected'));
        event.target.setAttribute('selected', '');
        updateRoofColor(event);
    }
});
document.getElementById("roofControl").addEventListener("change", updateBuilding);
document.getElementById("groundTextureControl").addEventListener("change", updateGroundTexture);
document.getElementById("exportPDF").addEventListener("click", exportPDF);
document.getElementById("snapshot").addEventListener("click", takeSnapshot);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initial updates
updateBuilding();
document.querySelector('#buildingColorControl .color-option[data-color="#0000ff"]').setAttribute('selected', '');
document.querySelector('#roofColorControl .color-option[data-color="#808080"]').setAttribute('selected', '');