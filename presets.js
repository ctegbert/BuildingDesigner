// presets.js
const presets = [
    { width: 10, height: 5, length: 15, color: '#0077ff' },
    { width: 12, height: 6, length: 18, color: '#ff5733' },
    // Add more presets as needed
];

function loadPreset(index) {
    const preset = presets[index];
    document.getElementById("widthControl").value = preset.width;
    document.getElementById("heightControl").value = preset.height;
    document.getElementById("lengthControl").value = preset.length;
    document.getElementById("colorControl").value = preset.color;
    updateBuilding();
    updatePrice();
}
