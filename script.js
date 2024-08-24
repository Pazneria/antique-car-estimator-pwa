// Check if the browser supports service workers
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Basic function to start voice recognition (we'll implement this fully later)
document.getElementById('start-voice').addEventListener('click', () => {
    console.log('Voice recognition started');
    // We'll add actual voice recognition code here later
    document.getElementById('voice-output').textContent = 'Voice recognition activated...';
});

// Function to display a simple estimate (we'll make this more complex later)
function displayEstimate(estimate) {
    document.getElementById('result-output').textContent = `Estimated cost: $${estimate}`;
}

// Example usage:
// displayEstimate(1500);