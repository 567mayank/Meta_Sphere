import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();
  const handleJoin = () => {
    if (!name.trim()) {
      alert("Enter a Name");
      return;
    }
    if (roomId.trim()) {
      socket.emit("join-room", { roomId, name });

      socket.once("error", (msg) => {
        alert(msg);
        setRoomId("");
        return;
      });

      socket.once("room-joined", (msg) => {
        navigate(`/game/${roomId}/${name}`);
      });
    } else {
      alert("Enter Valid Room id");
    }
  };

  const handleNewRoom = () => {
    if (!name.trim()) {
      alert("Enter a Name");
      return;
    }
    if (roomId.trim()) {
      socket.emit("create-room", { roomId, name });

      socket.once("error", (msg) => {
        alert(msg);
        setRoomId("");
        return;
      });

      socket.once("room-created", (msg) => {
        navigate(`/game/${roomId}/${name}`);
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

      <div className="flex flex-col w-1/4 gap-6 mt-6">
        {/* First row: Name and Room Code */}
        <div className="flex justify-between items-center space-x-4">
          <label htmlFor="room-name" className="font-medium">
            Name
          </label>
          <input
            id="room-name"
            type="text"
            placeholder="Pick a Name"
            className="p-2 rounded-lg text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center space-x-4">
          <label htmlFor="room-code" className="font-medium">
            Room Code
          </label>
          <input
            id="room-code"
            type="text"
            placeholder="Enter Room Code"
            className="p-2 rounded-lg text-black"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>

        {/* Second row: Join and Create New Room buttons */}
        <div className="flex justify-between gap-x-5">
          <button
            onClick={handleJoin}
            className=" w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Join Room
          </button>
          <button
            onClick={handleNewRoom}
            className=" w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
