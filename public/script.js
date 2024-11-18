
document.getElementById('sendButton').addEventListener('click', sendMessage);


document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});


document.getElementById('resetButton').addEventListener('click', resetChat);


async function sendMessage() {
    const userMessage = document.getElementById('userInput').value;
    if (!userMessage.trim()) return;

    document.getElementById('userInput').value = '';

   
    appendMessage(userMessage, 'user', 'responseContainer1');
    appendMessage(userMessage, 'user', 'responseContainer2');
    appendMessage(userMessage, 'user', 'responseContainer3');

    const loadingMessage1 = createLoadingMessage();
    const loadingMessage2 = createLoadingMessage();
    const loadingMessage3 = createLoadingMessage();

    const responseContainer1 = document.getElementById('responseContainer1');
    const responseContainer2 = document.getElementById('responseContainer2');
    const responseContainer3 = document.getElementById('responseContainer3');

    responseContainer1.appendChild(loadingMessage1);
    responseContainer2.appendChild(loadingMessage2);
    responseContainer3.appendChild(loadingMessage3);

    responseContainer1.scrollTop = responseContainer1.scrollHeight;
    responseContainer2.scrollTop = responseContainer2.scrollHeight;
    responseContainer3.scrollTop = responseContainer3.scrollHeight;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();

        responseContainer1.removeChild(loadingMessage1);
        responseContainer2.removeChild(loadingMessage2);
        responseContainer3.removeChild(loadingMessage3);

        const cleanedReply1 = cleanResponse(data.reply1);
        const cleanedReply2 = cleanResponse(data.reply2);
        const cleanedReply3 = cleanResponse(data.reply3);

       
        animateMessage(cleanedReply1, 'bot', 'responseContainer1');
        animateMessage(cleanedReply2, 'bot', 'responseContainer2');
        animateMessage(cleanedReply3, 'bot', 'responseContainer3');
    } catch (error) {
        console.error('Error:', error);
    }
}


function appendMessage(message, sender, containerId) {
    const responseContainer = document.getElementById(containerId);

    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-response');
    messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Bot'}:</strong> ${message}`;

    messageWrapper.appendChild(messageDiv);
    responseContainer.appendChild(messageWrapper);

    responseContainer.scrollTop = responseContainer.scrollHeight;
}


function createLoadingMessage() {
    const loadingMessage = document.createElement('div');
    loadingMessage.classList.add('message', 'bot-response');
    loadingMessage.innerHTML = `<strong>Bot:</strong> <span  class="loading-dots">
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </span>`;
    return loadingMessage;
}

function resetChat() {
    document.getElementById('responseContainer1').innerHTML = '';
    document.getElementById('responseContainer2').innerHTML = '';
    document.getElementById('responseContainer3').innerHTML = '';
}


function cleanResponse(text) {
    return text.replace(/\n+/g, '\n').trim();
}


function animateMessage(message, sender, containerId) {
    const responseContainer = document.getElementById(containerId);

    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-response');
    messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Bot'}:</strong> ${message}`;

    messageWrapper.appendChild(messageDiv);
    responseContainer.appendChild(messageWrapper);

    responseContainer.scrollTop = responseContainer.scrollHeight;

    messageDiv.style.animation = 'fadeIn 0.6s ease-in-out';
}
