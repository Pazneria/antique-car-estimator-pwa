// Voice recognition handling for the Antique Car Estimator app

let recognition;
let isListening = false;
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function debugLog(message) {
    console.log(message);
    const debugElement = document.getElementById('debug-output');
    if (debugElement) {
        debugElement.innerHTML += message + '<br>';
        debugElement.scrollTop = debugElement.scrollHeight;
    }
}

function initializeVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        debugLog('Web Speech API is not supported in this browser');
        return false;
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = !isMobile;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        debugLog('Voice recognition started');
        isListening = true;
        document.getElementById('voice-output').textContent = 'Listening... Speak your number.';
    };

    recognition.onresult = function(event) {
        debugLog('Recognition result received');
        const transcript = event.results[0][0].transcript.trim();
        debugLog('Recognized: ' + transcript);
        processTranscript(transcript);
    };

    recognition.onerror = function(event) {
        debugLog('Voice recognition error: ' + event.error);
        document.getElementById('voice-output').textContent = `Error: ${event.error}. Please try again.`;
        isListening = false;
    };

    recognition.onend = function() {
        debugLog('Voice recognition ended');
        isListening = false;
        if (isMobile) {
            document.getElementById('voice-output').textContent = 'Tap to speak again';
        } else if (window.shouldContinueListening) {
            startListening();
        }
    };

    return true;
}

function startListening() {
    if (!isListening && recognition) {
        try {
            recognition.start();
        } catch (error) {
            debugLog('Failed to start voice recognition: ' + error);
            document.getElementById('voice-output').textContent = 'Failed to start voice recognition. Please try again.';
            return false;
        }
    }
    return true;
}

function stopListening() {
    if (isListening && recognition) {
        recognition.stop();
    }
}

function processTranscript(transcript) {
    debugLog('Processing transcript: ' + transcript);
    const number = parseInt(transcript);
    if (!isNaN(number)) {
        debugLog('Valid number recognized: ' + number);
        window.processRecognizedNumber(number);
    } else {
        debugLog('Could not recognize a number from: ' + transcript);
        document.getElementById('voice-output').textContent = 'Could not recognize a number. Please try again.';
    }
}

function requestMicrophoneAccess() {
    return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            stream.getTracks().forEach(track => track.stop());
            debugLog('Microphone access granted');
            return initializeVoiceRecognition();
        });
}

window.voiceRecognition = {
    requestAccess: requestMicrophoneAccess,
    start: startListening,
    stop: stopListening,
    isMobile: isMobile
};