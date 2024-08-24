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
    const manualInputElement = document.createElement('input');
    manualInputElement.type = 'number';
    manualInputElement.style.display = 'none';
    manualInputElement.placeholder = 'Enter number';
    currentVariableElement.after(manualInputElement);

    startButton.addEventListener('click', initializeEstimateProcess);

    manualInputElement.addEventListener('change', function() {
        const number = parseInt(this.value);
        if (!isNaN(number)) {
            processRecognizedNumber(number);
            this.value = '';
        }
    });

    function initializeEstimateProcess() {
        console.log('Initializing estimate process');
        startButton.disabled = true;
        voiceOutputElement.textContent = 'Requesting microphone access...';

        window.voiceRecognition.requestAccess()
            .then((success) => {
                if (success) {
                    voiceOutputElement.textContent = 'Microphone access granted. Starting estimate...';
                    setTimeout(startEstimateProcess, 1000);
                } else {
                    throw new Error('Voice recognition initialization failed');
                }
            })
            .catch((err) => {
                console.error('Microphone access denied or voice recognition failed:', err);
                voiceOutputElement.textContent = 'Using manual input due to microphone access denial or voice recognition failure.';
                manualInputElement.style.display = 'block';
                startEstimateProcess();
            });
    }

    function startEstimateProcess() {
        console.log('Starting estimate process');
        currentVariableIndex = 0;
        estimates = {};
        window.shouldContinueListening = true;
        updateCurrentVariableDisplay();
        if (!window.voiceRecognition.isMobile) {
            window.voiceRecognition.start();
        }
    }

    function updateCurrentVariableDisplay() {
        if (currentVariableIndex < variables.length) {
            const variable = variables[currentVariableIndex];
            currentVariableElement.textContent = `${variable.question}: Waiting for input...`;
            manualInputElement.placeholder = `Enter number for ${variable.name}`;
            if (window.voiceRecognition.isMobile) {
                voiceOutputElement.textContent = 'Tap to speak';
                voiceOutputElement.onclick = function() {
                    window.voiceRecognition.start();
                };
            }
        } else {
            finishEstimate();
        }
    }

    function processRecognizedNumber(number) {
        if (currentVariableIndex < variables.length) {
            const variable = variables[currentVariableIndex];
            estimates[variable.name] = number;
            currentVariableElement.textContent = `${variable.question}: ${number}`;
            console.log(`Recorded for ${variable.name}: ${number}`);
            
            currentVariableIndex++;
            if (window.voiceRecognition.isMobile) {
                window.voiceRecognition.stop();
            }
            updateCurrentVariableDisplay();
        }
    }

    window.processRecognizedNumber = processRecognizedNumber;

    function finishEstimate() {
        console.log('Finishing estimate');
        window.shouldContinueListening = false;
        window.voiceRecognition.stop();
        const itemizedEstimate = calculateItemizedEstimate(estimates);
        displayItemizedEstimate(itemizedEstimate);
        startButton.disabled = false;
        currentVariableElement.textContent = 'Estimate complete';
        voiceOutputElement.textContent = '';
        voiceOutputElement.onclick = null;
        manualInputElement.style.display = 'none';
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