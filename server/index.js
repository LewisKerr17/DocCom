import { createServer } from "http"
import { Server } from "socket.io"
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const httpServer = createServer(app);

let last = null;


const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
//frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "..", "app")));


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
        const users = [];
        for (const [id, s] of io.of("/").sockets) {
            users.push(s.username || id.substring(0, 5));
        }
        io.emit('users', users);
        
        if (last === name) {
            io.emit('message', `${data}`);
        } else {
            io.emit('message', `<strong>${name}:</strong> ${data}`);
            last = name;
        }
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