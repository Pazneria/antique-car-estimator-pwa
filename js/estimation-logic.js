// Estimation logic for the Antique Car Estimator app

const basePrices = {
    engine: 5000,
    transmission: 3000,
    paint: 2000,
    interior: 1500,
    tires: 800
};

function calculateEstimate(parts) {
    console.log('Calculating estimate for:', parts);
    let total = 0;
    for (let part in parts) {
        if (basePrices.hasOwnProperty(part)) {
            total += basePrices[part] * parts[part];
        }
    }
    console.log('Total estimate:', total);
    return total;
}

window.calculateEstimate = calculateEstimate;