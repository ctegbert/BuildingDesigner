// roofStyles.js
function updateRoofStyle() {
    const roofStyle = document.getElementById("roofStyleControl").value;
    // Modify building geometry based on selected roof style
    if (roofStyle === "gabled") {
        geometry = new THREE.BoxGeometry(width, height, length);
        // Apply gabled roof logic here
    } else {
        geometry = new THREE.BoxGeometry(width, height, length);
        // Apply flat roof logic here
    }
    updateBuilding();
}
