const socket = io('ws://localhost:3500')

function sendMessage(e) {
    e.preventDefault() /* Stop page from refreshing */
    const input = document.querySelector('input')
    if (input.value) {
        socket.emit('message', input.value)
        input.value = "" /* Once message is sent, message bar clears */
    }
    input.focus()
}

document.querySelector('form')
    .addEventListener('submit', sendMessage)


/* Listen for messages */

socket.on('message', (data) => {
    const li = document.createElement('li')
    li.textContent = data /* Message from server */
    document.querySelector('ul').appendChild(li)
})

// npm run dev