import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext";

function Home() {
  const [roomId, setRoomId] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();
  const handleJoin = () => {
    if (roomId.trim()) {
      socket.emit("join-room", { roomId });

      socket.once("error", (msg) => {
        alert(msg);
        setRoomId("");
        return;
      });

      socket.once("room-joined", (msg) => {
        navigate(`/game/${roomId}`);
      });
    } else {
      alert("Enter Valid Room id");
    }
  };

  const handleNewRoom = () => {
    if (roomId.trim()) {
      socket.emit("create-room", { roomId });

      socket.once("error", (msg) => {
        alert(msg);
        setRoomId("");
        return;
      });

      socket.once("room-created", (msg) => {
        navigate(`/game/${roomId}`);
      });
    } else {
      alert("Enter Valid Room id");
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
            type="Text"
            placeholder="Enter Room Code"
            className="p-2 rounded-lg text-black"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleJoin}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Join
          </button>
          <button
            onClick={handleNewRoom}
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