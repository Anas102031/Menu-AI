const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function addMessage(text, isUser = false) {
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    div.innerHTML = `
        <div class="avatar">${isUser ? '👤' : '🤖'}</div>
        <div class="content">${formatText(text)}</div>
    `;
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function addTyping() {
    const div = document.createElement('div');
    div.className = 'message bot-message';
    div.id = 'typing';
    div.innerHTML = `
        <div class="avatar">🤖</div>
        <div class="content">
            <div class="typing">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    userInput.value = '';
    sendBtn.disabled = true;
    addTyping();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        removeTyping();

        if (data.success) {
            addMessage(data.response);
        } else {
            addMessage('Sorry, something went wrong. Please try again.');
        }
    } catch (error) {
        removeTyping();
        addMessage('Error connecting to server. Is it running?');
    }

    sendBtn.disabled = false;
    userInput.focus();
}

function sendQuick(message) {
    userInput.value = message;
    sendMessage();
}

function handleKey(event) {
    if (event.key === 'Enter') sendMessage();
}

fetch('/api/health')
    .then(res => res.json())
    .then(data => console.log('✅ Server:', data.message))
    .catch(() => console.log('❌ Server not reachable'));