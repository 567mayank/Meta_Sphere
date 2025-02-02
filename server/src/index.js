import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'; // Make sure to import cors
import { setupSocket } from './socket.js';
import tokenRouter from './routes/token.routes.js';

const app = express();
const server = createServer(app);

// Add CORS middleware for Express
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add JSON parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Mount the token router
app.use('/token', tokenRouter);

setupSocket(io);

server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});