document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const userInput = document.getElementById('user-input').value;
  const chatBox = document.getElementById('chat-box');
  
  // Display user's message
  const userMessage = document.createElement('div');
  userMessage.textContent = userInput;
  userMessage.className = 'user-message';
  chatBox.appendChild(userMessage);
  
  // Clear input field
  document.getElementById('user-input').value = '';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userInput }),
    });
    
    const data = await response.json();
    
    // Display response from server
    const botMessage = document.createElement('div');
    botMessage.textContent = data.reply;
    botMessage.className = 'bot-message';
    chatBox.appendChild(botMessage);
  } catch (error) {
    console.error('Error:', error);
  }
  
  // Scroll chat box to the bottom
  chatBox.scrollTop = chatBox.scrollHeight;
});
