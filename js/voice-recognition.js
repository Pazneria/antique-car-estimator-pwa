// Voice recognition handling for the Antique Car Estimator app

let recognition;
let audioContext;
let isListening = false;

function initializeVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.error('Web Speech API is not supported in this browser');
        document.getElementById('start-estimate').style.display = 'none';
        document.getElementById('voice-output').textContent = 'Voice recognition is not supported in this browser. Please use manual input.';
        return false;
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        console.log('Voice recognition started');
        isListening = true;
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
        isListening = false;
    };

    recognition.onend = function() {
        console.log('Voice recognition ended');
        isListening = false;
    };

    return true;
}

function startListening() {
    if (!isListening && recognition) {
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
    if (isListening && recognition) {
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
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function(stream) {
                stream.getTracks().forEach(track => track.stop());
                console.log('Microphone access granted');
                
                // Create and resume AudioContext
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }

                // Slight delay before initializing recognition
                setTimeout(() => {
                    if (initializeVoiceRecognition()) {
                        resolve(true);
                    } else {
                        reject('Failed to initialize voice recognition');
                    }
                }, 1000);
            })
            .catch(function(err) {
                console.error('Error accessing microphone:', err);
                reject(err);
            });
    });
}

window.voiceRecognition = {
    requestAccess: requestMicrophoneAccess,
    start: startListening,
    stop: stopListening
};