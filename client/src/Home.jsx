// import React from 'react'
// import {Link} from 'react-router-dom'
// import { useSocket } from './SocketContext'

// function Home() {
//   const socket = useSocket()
//   return (
//     <div className='bg-black w-screen h-screen text-white flex flex-col justify-center items-center space-y-6 p-6'>
      
//       <div className="text-4xl font-bold text-center">
//         Hello,
//         <div className="mt-2 text-6xl font-extrabold text-indigo-400">
//           Welcome to MetaSphere
//         </div>
//       </div>

//       <div className="text-xl text-center text-gray-300">
//         Get Along with people while having some fun
//       </div>

//       <div className="flex flex-col items-center space-y-4 mt-6">
//         <div className="flex items-center space-x-3">
//           <label htmlFor="room-code" className="font-medium">Room Code</label>
//           <input
//             id="room-code"
//             type="Text"
//             placeholder='Enter Room No'
//             className="p-2 rounded-lg text-black"
//           />
//         </div>

//         <div className="flex space-x-4">
//           <Link to='/game' className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" >
//             Join
//           </Link>
//           <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400">
//             Create New Room
//           </button>
//         </div>
//       </div>

//     </div>
//   )
// }

// export default Home
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from './SocketContext';
import { v4 as uuidv4 } from 'uuid'; // To generate unique room IDs

function Home() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');

  // Function to create a new room
  const handleCreateRoom = () => {
    const newRoomId = uuidv4(); // Generate a unique room ID
    socket.emit('create-room', { roomId: newRoomId }); // Notify server to create the room
    navigate(`/game/${newRoomId}`); // Redirect to the new room
  };

  // Function to join an existing room
  const handleJoinRoom = () => {
    if (roomCode.trim()) {
      socket.emit('join-room', { roomId: roomCode }); // Notify server to join the room
      navigate(`/game/${roomCode}`); // Redirect to the room
    } else {
      alert('Please enter a valid room code!');
    }
  };

  return (
    <div className="bg-black w-screen h-screen text-white flex flex-col justify-center items-center space-y-6 p-6">
      <div className="text-4xl font-bold text-center">
        Hello,
        <div className="mt-2 text-6xl font-extrabold text-indigo-400">
          Welcome to MetaSphere
        </div>
      </div>

      <div className="text-xl text-center text-gray-300">
        Get Along with people while having some fun
      </div>

      <div className="flex flex-col items-center space-y-4 mt-6">
        <div className="flex items-center space-x-3">
          <label htmlFor="room-code" className="font-medium">
            Room Code
          </label>
          <input
            id="room-code"
            type="text"
            placeholder="Enter Room No"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="p-2 rounded-lg text-black"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleJoinRoom}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Join
          </button>
          <button
            onClick={handleCreateRoom}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;