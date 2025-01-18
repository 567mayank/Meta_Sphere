import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './socket.js'; 

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('Hello World');
});


setupSocket(io);

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
