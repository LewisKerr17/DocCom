const socket = io()
/* Send messages */
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

function scrollToBottom() {
    const textDisplay = document.querySelector('.text-display');
    if (textDisplay) {
        textDisplay.scrollTop = textDisplay.scrollHeight;
    }
}


socket.on('message', (data) => {
    const li = document.createElement('li')
    li.innerHTML = data
    document.querySelector('ul').appendChild(li)
    scrollToBottom();
})


const params = new URLSearchParams(window.location.search);
const username = params.get('username');
if (username) {
    socket.emit('set-username', username);
}
socket.on('users', usersList => {
    const list = document.getElementById('users-list');
    if (list) {
        usersList.forEach((user) => {
            const userItem = document.createElement('li');
            userItem.textContent = user;
            list.appendChild(userItem);
        }); 
    }
});
if (document.querySelector('.chat-bar')) {
    document.querySelector('form')
        .addEventListener('submit', sendMessage);
}
// npm run dev