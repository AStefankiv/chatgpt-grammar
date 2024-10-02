document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userInputField = document.getElementById('user-input');
  const userInput = userInputField.value.trim();
  const chatBox = document.getElementById('chat-box');

  if (!userInput) return;
  
  // Display user's message
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
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ message: userInput }),
    });
    
    const data = await response.json();

    //Remove the loading message
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
      // Display error from server
      const errorMessage = document.createElement('div');
      errorMessage.textContent = 'Error: ' + data.error;
      errorMessage.className = 'error-message';
      chatBox.appendChild(errorMessage);
    }
  } catch (error) {
    console.error('Error:', error);
    // Remove loading message
    chatBox.removeChild(loadingMessage);
    const errorMessage = document.createElement('div');
    errorMessage.textContent = 'An error occurred: ' + error.message;
    errorMessage.className = 'error-message';
    chatBox.appendChild(errorMessage);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
});