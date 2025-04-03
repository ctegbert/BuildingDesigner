// snapshot.js
function downloadSnapshot() {
    const dataURL = renderer.domElement.toDataURL();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'building-snapshot.png';
    link.click();
}
