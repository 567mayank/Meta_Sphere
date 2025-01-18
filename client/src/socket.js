import { io } from 'socket.io-client';

const socket = io("http://localhost:3000");

socket.on("message" , (data) => {
    console.log("messgage from server : ",data);
});

export const sendMessage = (message) => {
    socket.emit("message" , message);
};

export default socket;