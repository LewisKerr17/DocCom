import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === "production"
            ? false
            : ["http://localhost:5500", "http://127.0.0.1:5500"],
        methods: ["GET", "POST"],
        credentials: true
    }
})

// Socket io shi
io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    socket.on('message', data => {
        console.log(`${socket.id.substring(0,5)}: ${data}`)
        io.emit('message', `${socket.id.substring(0,5)}: ${data}`)   /* echo msg back to every user in server with first 5 characters of the socket id */
    })
})

httpServer.listen(3500, () => console.log('listening on port 3500'))