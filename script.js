// This is the main JavaScript file for our Antique Car Estimator app

const variables = [
    { name: 'engine', question: 'How many engines need work?' },
    { name: 'transmission', question: 'How many transmissions need work?' },
    { name: 'paint', question: 'How many paint jobs are needed?' },
    { name: 'interior', question: 'How many interiors need refurbishing?' },
    { name: 'tires', question: 'How many tires need replacing?' }
];

let currentVariableIndex = 0;
let estimates = {};

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-estimate');
    const currentVariableElement = document.getElementById('current-variable');
    const voiceOutputElement = document.getElementById('voice-output');
    const resultOutputElement = document.getElementById('result-output');

    startButton.addEventListener('click', startEstimateProcess);

    function startEstimateProcess() {
        currentVariableIndex = 0;
        estimates = {};
        startButton.disabled = true;
        askNextQuestion();
    }

    function askNextQuestion() {
        if (currentVariableIndex < variables.length) {
            const variable = variables[currentVariableIndex];
            currentVariableElement.textContent = variable.question;
            startVoiceRecognition();
        } else {
            finishEstimate();
        }
    }

    function startVoiceRecognition() {
        // This function will be implemented in voice-recognition.js
        // It should call processVoiceInput when it gets a result
    }

    window.processVoiceInput = function(input) {
        const variable = variables[currentVariableIndex];
        const quantity = parseInt(input) || 0;
        estimates[variable.name] = quantity;

        voiceOutputElement.textContent = `${variable.name}: ${quantity}`;

        currentVariableIndex++;
        setTimeout(askNextQuestion, 1000); // Wait 1 second before next question
    };

    function finishEstimate() {
        const total = calculateEstimate(estimates);
        resultOutputElement.textContent = `Total Estimate: $${total}`;
        startButton.disabled = false;
        currentVariableElement.textContent = 'Estimate complete';
    }
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registered successfully:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
}