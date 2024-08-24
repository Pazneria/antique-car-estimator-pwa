// Check for browser support
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    const voiceOutputElement = document.getElementById('voice-output');

    // Set recognition properties
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    window.startVoiceRecognition = function() {
        recognition.start();
        voiceOutputElement.textContent = 'Listening...';
    };

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        window.processVoiceInput(result);
    };

    recognition.onerror = (event) => {
        voiceOutputElement.textContent = `Error occurred in recognition: ${event.error}`;
        window.processVoiceInput('0'); // Assume 0 if there's an error
    };

    recognition.onend = () => {
        // The recognition will end after each question, but we don't need to do anything here
    };
} else {
    console.log('Web Speech API is not supported in this browser.');
    document.getElementById('start-estimate').style.display = 'none';
    document.getElementById('voice-output').textContent = 'Voice recognition is not supported in this browser. Please use manual input.';
}