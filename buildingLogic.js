// buildingLogic.js
function updateBuilding() {
    createBuilding(); // Fixed typo from create- Building()
    const width = +document.getElementById("widthControl").value;
    const height = +document.getElementById("heightControl").value;
    const length = +document.getElementById("lengthControl").value;
    updateValues(width, height, length);
    updatePrice(width, height, length);
}

function initializeCamera() {
    const height = +document.getElementById("heightControl").value;
    camera.position.set(30, 15, 30); // Default position without zoom control
    controls.target.set(0, height / 2, 0);
}

function updateValues(width, height, length) {
    document.getElementById("widthValue").textContent = width + " ft";
    document.getElementById("heightValue").textContent = height + " ft";
    document.getElementById("lengthValue").textContent = length + " ft";
    const pitch = +document.getElementById("pitchControl").value;
    const pitchFraction = Math.round(pitch * 3 + 2); // Map 0.5 to 2/12, 3.0 to 12/12
    document.getElementById("pitchValue").textContent = pitchFraction + "/12";
}

function updateBuildingColor(event) {
    const color = event.target.getAttribute('data-color');
    buildingMaterial.color.set(color); // Tint the texture with the selected color
}

function updateRoofColor(event) {
    const color = event.target.getAttribute('data-color');
    roofMaterial.color.set(color); // Tint the texture with the selected color
}

// Set initial roof color to dark gray (#4d4d4d) on page load
document.addEventListener("DOMContentLoaded", () => {
    const defaultRoofColor = document.querySelector('#roofColorControl .color-option[selected]').getAttribute('data-color');
    roofMaterial.color.set(defaultRoofColor);
});

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
    // Define the price range
    const minWidth = 10, minHeight = 8, minLength = 10; // Smallest building dimensions
    const maxWidth = 100, maxHeight = 20, maxLength = 100; // Largest building dimensions
    const minCost = 16200; // Default building (30x10x40) cost
    const maxCost = 165000; // Largest building (100x20x100) cost

    // Calculate volume
    const volume = width * height * length;
    const minVolume = minWidth * minHeight * minLength; // 800 cu ft
    const maxVolume = maxWidth * maxHeight * maxLength; // 200,000 cu ft

    // Linear interpolation for price based on volume
    const cost = minCost + ((volume - minVolume) / (maxVolume - minVolume)) * (maxCost - minCost);

    document.getElementById("price").textContent = `Estimated Cost: $${Math.round(cost).toLocaleString()}`;
    return Math.round(cost);
}

// Map hex colors to descriptive names
const colorNames = {
    "#cc3333": "Muted Red",
    "#336699": "Muted Blue",
    "#e6e6e6": "Light Gray",
    "#4d4d4d": "Dark Gray",
    "#999999": "Medium Gray",
    "#669966": "Muted Green",
    "#cccc99": "Muted Yellow",
    "#996633": "Muted Brown"
};

function getColorName(hex) {
    return colorNames[hex.toLowerCase()] || "Corrugated Metal Siding";
}

function exportPDF() {
    const width = document.getElementById("widthControl").value;
    const height = document.getElementById("heightControl").value;
    const length = document.getElementById("lengthControl").value;
    const pitch = document.getElementById("pitchControl").value;
    const pitchFraction = Math.round(pitch * 3 + 2); // Map 0.5 to 2/12, 3.0 to 12/12
    const buildingColorHex = document.querySelector('#buildingColorControl .color-option[selected]')?.getAttribute('data-color');
    const roofColorHex = document.querySelector('#roofColorControl .color-option[selected]')?.getAttribute('data-color');
    const buildingColor = getColorName(buildingColorHex);
    const roofColor = getColorName(roofColorHex);
    const roofStyle = document.getElementById("roofControl").value;
    const cost = updatePrice(width, height, length);

    // Access jsPDF from the UMD module
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Load the logo image for the PDF
    const logoImg = new Image();
    logoImg.src = 'images/CMB.png'; // Use the normal logo for the PDF
    logoImg.onload = function() {
        // Add the logo to the PDF (centered at the top)
        const logoWidth = 50; // Adjust size as needed
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth;
        const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Center horizontally
        doc.addImage(logoImg, 'PNG', logoX, 10, logoWidth, logoHeight);

        // Add a horizontal line below the logo (shifted down to avoid cutting through)
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 77, 153);
        doc.line(20, 70, 190, 70); // Moved from y=40 to y=50

        // Set up the content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0); // Black text for the content

        // Title for the specs section
        doc.setFont("helvetica", "bold");
        doc.text("Building Specifications", 20, 80);

        // Building specs
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        let yPosition = 90;
        const lineHeight = 10;

        doc.text(`Width: ${width} ft`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Height: ${height} ft`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Length: ${length} ft`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Roof Pitch: ${pitchFraction}/12`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Building Color: ${buildingColor}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Roof Color: ${roofColor}`, 20, yPosition);
        yPosition += lineHeight;
        doc.text(`Roof Style: ${roofStyle === 'aframe' ? 'A-Frame' : roofStyle.charAt(0).toUpperCase() + roofStyle.slice(1)}`, 20, yPosition); // Added hyphen to A-Frame
        yPosition += lineHeight + 5; // Extra space before the cost

        // Total price
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(0, 77, 153); // Dark blue for the cost
        doc.text(`Estimated Cost: $${cost.toLocaleString()}`, 20, yPosition);

        // Add a divider line before the contact info
        yPosition += 20;
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 77, 153);
        doc.line(20, yPosition, 190, yPosition);

        // Add contact info
        yPosition += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100); // Gray for the contact info
        doc.text("Website: coltonsmetalbuildings.com", 105, yPosition, { align: "center" });
        yPosition += 8;
        doc.text("Phone: 775-741-2591", 105, yPosition, { align: "center" });
        yPosition += 8;
        doc.text("Email: colton@cmb.com", 105, yPosition, { align: "center" });

        // Save the PDF
        doc.save("building_design.pdf");
    };
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
document.getElementById("pitchControl").addEventListener("input", updateBuilding);
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
initializeCamera();
updateBuilding();