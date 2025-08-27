const socket = io('ws://localhost:3500')

function sendMessage(e) {
    e.preventDefault() /* Stop page from refreshing */
    const input = document.getElementById('message-input');
    if (input.value) {
        socket.emit('message', input.value)
        input.value = "" /* Once message is sent, message bar clears */
    }
    input.focus()
}

/* Listen for messages */

socket.on('message', (data) => {
    const li = document.createElement('li')
    li.textContent = data /* Message from server */
    document.querySelector('ul').appendChild(li)
    scrollToBottom();
})


function scrollToBottom() {
    const textDisplay = document.querySelector('.text-display');
    if (textDisplay) {
        textDisplay.scrollTop = textDisplay.scrollHeight;
    }
}


const params = new URLSearchParams(window.location.search);
const username = params.get('username');
if (username) {
    socket.emit('set-username', username);
}

if (document.querySelector('.chat-bar')) {
    document.querySelector('form')
        .addEventListener('submit', sendMessage);
}
// npm run dev