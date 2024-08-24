// Voice recognition handling for the Antique Car Estimator app

let recognition;
let isListening = false;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function initializeVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error('Web Speech API is not supported in this browser');
        return false;
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = !isMobile;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        console.log('Voice recognition started');
        isListening = true;
        document.getElementById('voice-output').textContent = 'Listening... Speak your number.';
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.trim();
        console.log('Recognized:', transcript);
        processTranscript(transcript);
    };

    recognition.onerror = function(event) {
        console.error('Voice recognition error:', event.error);
        document.getElementById('voice-output').textContent = `Error: ${event.error}. Please try again.`;
        isListening = false;
    };

    recognition.onend = function() {
        console.log('Voice recognition ended');
        isListening = false;
        if (window.shouldContinueListening && !isMobile) {
            startListening();
        } else if (isMobile) {
            document.getElementById('voice-output').textContent = 'Tap to speak again';
        }
    };

    return true;
}

function startListening() {
    if (!isListening && recognition) {
        try {
            recognition.start();
        } catch (error) {
            console.error('Failed to start voice recognition:', error);
            document.getElementById('voice-output').textContent = 'Failed to start voice recognition. Please try again.';
            return false;
        }
    }
    return true;
}

function stopListening() {
    if (isListening && recognition) {
        window.shouldContinueListening = false;
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
    stop: stopListening,
    isMobile: isMobile
};