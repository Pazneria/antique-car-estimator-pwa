// This file contains the logic for calculating estimates

const basePrices = {
    engine: 5000,
    transmission: 3000,
    paint: 2000,
    interior: 1500,
    tires: 800
};

function calculateEstimate(parts) {
    let total = 0;
    for (let part in parts) {
        if (basePrices.hasOwnProperty(part)) {
            total += basePrices[part] * parts[part];
        }
    }
    return total;
}

// Export function to be used in other files
window.calculateEstimate = calculateEstimate;