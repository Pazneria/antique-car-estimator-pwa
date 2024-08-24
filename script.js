// Main JavaScript file for the Antique Car Estimator app

const variables = [
    { name: 'engine', question: 'Number of engines needing work' },
    { name: 'transmission', question: 'Number of transmissions needing work' },
    { name: 'paint', question: 'Number of paint jobs needed' },
    { name: 'interior', question: 'Number of interiors needing refurbishing' },
    { name: 'tires', question: 'Number of tires needing replacement' }
];

let currentVariableIndex = 0;
let estimates = {};
window.shouldContinueListening = false;

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-estimate');
    const currentVariableElement = document.getElementById('current-variable');
    const voiceOutputElement = document.getElementById('voice-output');
    const resultOutputElement = document.getElementById('result-output');

    startButton.addEventListener('click', initializeEstimateProcess);

    function initializeEstimateProcess() {
        console.log('Initializing estimate process');
        startButton.disabled = true;
        voiceOutputElement.textContent = 'Requesting microphone access...';

        window.voiceRecognition.requestAccess()
            .then(() => {
                voiceOutputElement.textContent = 'Microphone access granted. Starting estimate...';
                setTimeout(startEstimateProcess, 1000);
            })
            .catch((err) => {
                console.error('Microphone access denied:', err);
                voiceOutputElement.textContent = 'Microphone access denied. Please grant access and try again.';
                startButton.disabled = false;
            });
    }

    function startEstimateProcess() {
        console.log('Starting estimate process');
        currentVariableIndex = 0;
        estimates = {};
        window.shouldContinueListening = true;
        updateCurrentVariableDisplay();
        window.voiceRecognition.start();
    }

    function updateCurrentVariableDisplay() {
        if (currentVariableIndex < variables.length) {
            const variable = variables[currentVariableIndex];
            currentVariableElement.textContent = `${variable.question}: Waiting for input...`;
        } else {
            finishEstimate();
        }
    }

    window.processRecognizedNumber = function(number) {
        if (currentVariableIndex < variables.length) {
            const variable = variables[currentVariableIndex];
            estimates[variable.name] = number;
            currentVariableElement.textContent = `${variable.question}: ${number}`;
            console.log(`Recorded for ${variable.name}: ${number}`);
            
            currentVariableIndex++;
            updateCurrentVariableDisplay();
        }
    };

    function finishEstimate() {
        console.log('Finishing estimate');
        window.shouldContinueListening = false;
        window.voiceRecognition.stop();
        const itemizedEstimate = calculateItemizedEstimate(estimates);
        displayItemizedEstimate(itemizedEstimate);
        startButton.disabled = false;
        currentVariableElement.textContent = 'Estimate complete';
        voiceOutputElement.textContent = '';
    }

    function calculateItemizedEstimate(parts) {
        const basePrices = {
            engine: 5000,
            transmission: 3000,
            paint: 2000,
            interior: 1500,
            tires: 800
        };
        
        let itemizedList = [];
        let total = 0;

        for (let part in parts) {
            if (basePrices.hasOwnProperty(part) && parts[part] > 0) {
                const quantity = parts[part];
                const price = basePrices[part];
                const subtotal = quantity * price;
                itemizedList.push({ part, quantity, price, subtotal });
                total += subtotal;
            }
        }

        return { itemizedList, total };
    }

    function displayItemizedEstimate({ itemizedList, total }) {
        let resultHTML = '<h3>Itemized Estimate:</h3><ul>';
        
        itemizedList.forEach(item => {
            resultHTML += `<li>${item.part}: ${item.quantity} x $${item.price} = $${item.subtotal}</li>`;
        });
        
        resultHTML += '</ul>';
        resultHTML += `<strong>Total Estimate: $${total}</strong>`;
        
        resultOutputElement.innerHTML = resultHTML;
    }
});

// Service Worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(error => console.log('Service Worker registration failed:', error));
}