let inputMode = 'TEXT';
let recognition;
let isRecording = false;
let searchHistory = [];

const textModeButton = document.getElementById('text-mode-button');
const voiceModeButton = document.getElementById('voice-mode-button');
const userInputField = document.getElementById('user-input');
const voiceInputButton = document.getElementById('voice-input-button');
const sendButton = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');
const historyList = document.getElementById('history-list');

textModeButton.addEventListener('click', () => {
  inputMode = 'TEXT';
  textModeButton.classList.add('active');
  voiceModeButton.classList.remove('active');
  userInputField.classList.remove('hidden');
  voiceInputButton.classList.add('hidden');
  userInputField.required = true;
});

voiceModeButton.addEventListener('click', () => {
  inputMode = 'VOICE';
  voiceModeButton.classList.add('active');
  textModeButton.classList.remove('active');
  userInputField.classList.add('hidden');
  voiceInputButton.classList.remove('hidden');
  userInputField.required = false;
});

voiceInputButton.addEventListener('click', () => {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

function startRecording() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Your browser does not support speech recognition. Please use a compatible browser like Chrome.');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();
  isRecording = true;

  voiceInputButton.textContent = 'Listening...';
  voiceInputButton.disabled = true;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    userInputField.value = transcript;
    document.getElementById('chat-form').dispatchEvent(new Event('submit'));
  };

  recognition.onend = () => {
    isRecording = false;
    voiceInputButton.textContent = '🎤 Start Speaking';
    voiceInputButton.disabled = false;
  };

  recognition.onerror = (event) => {
    isRecording = false;
    voiceInputButton.textContent = '🎤 Start Speaking';
    voiceInputButton.disabled = false;
    alert('Error occurred in speech recognition: ' + event.error);
  };
}

function stopRecording() {
  if (recognition && isRecording) {
    recognition.stop();
    isRecording = false;
    voiceInputButton.textContent = '🎤 Start Speaking';
    voiceInputButton.disabled = false;
  }
}

document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  let userInput = userInputField.value.trim();

  if (inputMode === 'VOICE' && userInput === '') {
    alert('Please speak into the microphone.');
    return;
  }

  if (!userInput) return;

  addToHistory(userInput);

  const userMessage = document.createElement('div');
  userMessage.textContent = userInput;
  userMessage.className = 'user-message';
  chatBox.appendChild(userMessage);

  userInputField.value = '';

  const loadingMessage = document.createElement('div');
  loadingMessage.textContent = 'Processing...';
  loadingMessage.className = 'loading-message';
  chatBox.appendChild(loadingMessage);

  try {
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await response.json();

    chatBox.removeChild(loadingMessage);

    if (response.ok) {
      const botMessage = document.createElement('div');
      botMessage.className = 'bot-message';

      const reply = data.reply;
      let correctedText = '';
      let explanation = '';

      const correctedMatch = reply.match(/Corrected Sentence:\s*(.+)\s*Explanation:/s);
      const explanationMatch = reply.match(/Explanation:\s*(.+)/s);

      if (correctedMatch && explanationMatch) {
        correctedText = correctedMatch[1].trim();
        explanation = explanationMatch[1].trim();
      } else {
        correctedText = reply.trim();
        explanation = 'No explanation provided.';
      }

      const correctedTextElement = document.createElement('div');
      correctedTextElement.textContent = correctedText;
      correctedTextElement.className = 'corrected-text';

      const explanationElement = document.createElement('div');
      explanationElement.textContent = 'Explanation: ' + explanation;
      explanationElement.className = 'explanation';

      botMessage.appendChild(correctedTextElement);
      botMessage.appendChild(explanationElement);

      chatBox.appendChild(botMessage);
    } else {
      const errorMessage = document.createElement('div');
      errorMessage.textContent = 'Error: ' + data.error;
      errorMessage.className = 'error-message';
      chatBox.appendChild(errorMessage);
    }
  } catch (error) {
    console.error('Error:', error);
    chatBox.removeChild(loadingMessage);
    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'An error occurred: ' + error.message;
    errorMessage.className = 'error-message';
    chatBox.appendChild(errorMessage);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});

function addToHistory(input) {
  searchHistory.push(input);

  const historyItem = document.createElement('li');
  historyItem.textContent = input;
  historyList.appendChild(historyItem);

  if  (searchHistory.kength > 10) {
    searchHistory.shift();
    historyList.removeChild(historyList.firstChild);
  }
}