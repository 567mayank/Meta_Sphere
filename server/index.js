import express from 'express';
import {createServer} from "http"
import { Server } from 'socket.io'
const app = express();
const server = createServer(app);

const io = new Server(server ,  {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"]
    }
});

app.get('/' , (req,res) => {
    res.send("hello world");
})

io.on('connection' , (socket) => {
    console.log('A user connected ', socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
})

app.listen(3000 , () => {
    console.log('Server is running at http://localhost:3000');
})