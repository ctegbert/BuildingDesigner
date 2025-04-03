// pricing.js
function calculatePrice(width, height, length) {
    const materialCostPerUnit = 20; // Example cost per unit area
    const area = width * height * length;
    return area * materialCostPerUnit;
}

function updatePrice() {
    let width = document.getElementById("widthControl").value;
    let height = document.getElementById("heightControl").value;
    let length = document.getElementById("lengthControl").value;

    let price = calculatePrice(width, height, length);
    document.getElementById("priceDisplay").innerText = "Price: $" + price.toFixed(2);
}

// Call the updatePrice function when dimensions change
document.getElementById("widthControl").addEventListener("input", updatePrice);
document.getElementById("heightControl").addEventListener("input", updatePrice);
document.getElementById("lengthControl").addEventListener("input", updatePrice);
