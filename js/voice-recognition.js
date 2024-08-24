// Continuous Voice recognition handling for the Antique Car Estimator app

let recognition;
let isListening = false;

function initializeVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        console.error('Web Speech API is not supported in this browser');
        document.getElementById('start-estimate').style.display = 'none';
        document.getElementById('voice-output').textContent = 'Voice recognition is not supported in this browser. Please use a compatible browser.';
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        console.log('Voice recognition started');
        isListening = true;
        document.getElementById('voice-output').textContent = 'Listening... Speak all numbers in order.';
    };

    recognition.onresult = function(event) {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                const transcript = event.results[i][0].transcript.trim();
                console.log('Recognized:', transcript);
                processTranscript(transcript);
            }
        }
    };

    recognition.onerror = function(event) {
        console.error('Voice recognition error:', event.error);
        document.getElementById('voice-output').textContent = `Error: ${event.error}. Please try again.`;
    };

    recognition.onend = function() {
        console.log('Voice recognition ended');
        isListening = false;
        if (window.shouldContinueListening) {
            recognition.start();
        }
    };
}

function startListening() {
    if (!isListening && recognition) {
        try {
            recognition.start();
        } catch (error) {
            console.error('Failed to start voice recognition:', error);
            document.getElementById('voice-output').textContent = 'Failed to start voice recognition. Please refresh the page and try again.';
        }
    }
}

function stopListening() {
    if (isListening && recognition) {
        window.shouldContinueListening = false;
        recognition.stop();
    }
}

function processTranscript(transcript) {
    const numbers = transcript.match(/\d+/g);
    if (numbers) {
        numbers.forEach(number => {
            window.processRecognizedNumber(parseInt(number));
        });
    }
}

function requestMicrophoneAccess() {
    return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            stream.getTracks().forEach(track => track.stop());
            console.log('Microphone access granted');
            initializeVoiceRecognition();
            return Promise.resolve();
        })
        .catch(function(err) {
            console.error('Error accessing microphone:', err);
            return Promise.reject(err);
        });
}

window.voiceRecognition = {
    requestAccess: requestMicrophoneAccess,
    start: startListening,
    stop: stopListening
};