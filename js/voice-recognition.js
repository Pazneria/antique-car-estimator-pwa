// Check for browser support
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    const startButton = document.getElementById('start-voice');
    const outputDiv = document.getElementById('voice-output');

    // Set recognition properties
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    startButton.addEventListener('click', () => {
        recognition.start();
        startButton.textContent = 'Listening...';
        outputDiv.textContent = 'Listening...';
    });

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        outputDiv.textContent = `You said: ${result}`;
        processVoiceInput(result);
    };

    recognition.onerror = (event) => {
        outputDiv.textContent = `Error occurred in recognition: ${event.error}`;
    };

    recognition.onend = () => {
        startButton.textContent = 'Start Voice Input';
    };
} else {
    console.log('Web Speech API is not supported in this browser.');
    document.getElementById('start-voice').style.display = 'none';
    document.getElementById('voice-output').textContent = 'Voice recognition is not supported in this browser. Please use manual input.';
}

function processVoiceInput(input) {
    // This function will process the voice input and update the estimate
    // For now, we'll just log the input
    console.log('Processing voice input:', input);
    // TODO: Implement actual processing logic
    // This might involve parsing the input for numbers and specific keywords
    // and then updating the estimate accordingly
}