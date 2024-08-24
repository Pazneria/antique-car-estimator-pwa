// Voice recognition handling for the Antique Car Estimator app

let recognition;
let isInitialized = false;

function initializeVoiceRecognition() {
    return new Promise((resolve, reject) => {
        if (isInitialized) {
            resolve();
            return;
        }

        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            reject('Web Speech API is not supported in this browser');
            return;
        }

        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log('Voice recognition started');
            document.getElementById('voice-output').textContent = 'Listening... Speak a number.';
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.trim();
            console.log('Recognized:', transcript);
            processTranscript(transcript);
        };

        recognition.onerror = function(event) {
            console.error('Voice recognition error:', event.error);
            document.getElementById('voice-output').textContent = `Error: ${event.error}. Please try again or use manual input.`;
        };

        recognition.onend = function() {
            console.log('Voice recognition ended');
        };

        isInitialized = true;
        resolve();
    });
}

function startListening() {
    if (recognition) {
        try {
            recognition.start();
        } catch (error) {
            console.error('Failed to start voice recognition:', error);
            document.getElementById('voice-output').textContent = 'Failed to start voice recognition. Please try again or use manual input.';
            return false;
        }
    }
    return true;
}

function stopListening() {
    if (recognition) {
        recognition.stop();
    }
}

function processTranscript(transcript) {
    const number = parseInt(transcript);
    if (!isNaN(number)) {
        window.processRecognizedNumber(number);
    } else {
        document.getElementById('voice-output').textContent = 'Could not recognize a number. Please try again.';
    }
}

function requestMicrophoneAccess() {
    return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            stream.getTracks().forEach(track => track.stop());
            console.log('Microphone access granted');
            return initializeVoiceRecognition();
        });
}

window.voiceRecognition = {
    requestAccess: requestMicrophoneAccess,
    start: startListening,
    stop: stopListening
};