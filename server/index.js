import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()

const io = new Server(httpServer, {
    cors: {
        origin:
            process.env.NODE_ENV === "production"
                ? "*"
                : ["http://localhost:5500", "http://127.0.0.1:5500"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
// Socket io shi
io.on('connection', socket => {

    socket.on('set-username', username => {
        socket.username = username;
        console.log(`Username for ${socket.id}: ${username}`);
        socket.broadcast.emit('message', `${username} connected`);
        socket.emit('message', `You (${username}) connected`);
    });

    socket.on('message', data => {
        const name = socket.username || socket.id.substring(0,5);
        console.log(`${name}: ${data}`);
        io.emit('message', `${name}: ${data}`);
    });

    socket.on("disconnect", () => {
        const name = socket.username || socket.id.substring(0, 5);
        console.log(`${name} disconnected`);
        io.emit("message", `${name} disconnected`);
    });
});

const PORT = process.env.PORT || 3500;

httpServer.listen(PORT, "0.0.0.0", () =>
    console.log(`Server listening on port ${PORT}`)
);