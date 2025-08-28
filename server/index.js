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
let usersList = []

// Socket io shi
io.on('connection', socket => {

    socket.on('set-username', username => {
        usersList.push(username)
        io.emit('users', usersList);
        socket.username = username;
        console.log(`Username for ${socket.id}: ${username}`);
        socket.broadcast.emit('message', `${username} connected`);
        socket.emit('message', `You (${username}) connected`);
        let last = null;
        console.log(usersList)
    }); // take a look to my right theres an opp on sight
// mr clark is on my right  
// btw copilot is generating me to say hi mr clark
// hi mr clark
// hi mr clark
// hi mr clark
    socket.on('message', data => {
        const name = socket.username || socket.id.substring(0,5);
        console.log(`${name}: ${data}`);
        const users = [];
        for (const [id, s] of io.of("/").sockets) {
            users.push(s.username || id.substring(0, 5));
        }
        
        if (last === name) {
            io.emit('message', `${data}`);
        } else {
            io.emit('message', `<strong>${name}:</strong> ${data}`);
            last = name;
        }
    });

    socket.on("disconnect", () => {
        const name = socket.username || socket.id.substring(0, 5);
        const index = usersList.indexOf(name);
        if (index > -1) { // only splice array when item is found
            usersList.splice(index, 1); // 2nd parameter means remove one item only - well done
        }
        io.emit("message", `${name} disconnected`);
        let last = null;
    });
});

const PORT = process.env.PORT || 3500;

httpServer.listen(PORT, "0.0.0.0", () =>
    console.log(`Server listening on port ${PORT}`)
);