// pdf-generator.js
function generatePDF() {
    const doc = new jsPDF();
    const width = document.getElementById("widthControl").value;
    const height = document.getElementById("heightControl").value;
    const length = document.getElementById("lengthControl").value;
    const price = document.getElementById("priceDisplay").innerText;

    doc.text(`Building Design`, 10, 10);
    doc.text(`Width: ${width}`, 10, 20);
    doc.text(`Height: ${height}`, 10, 30);
    doc.text(`Length: ${length}`, 10, 40);
    doc.text(price, 10, 50);
    doc.save('building-design.pdf');
}
