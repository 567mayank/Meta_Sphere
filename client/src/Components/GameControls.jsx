import React, { useState } from 'react'
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { FiCamera, FiCameraOff } from "react-icons/fi";
import { ImCross } from "react-icons/im";

function GameControls() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);

  return (
    <div className="relative bottom-10 w-1/5 h-20 m-auto rounded-3xl bg-gradient-to-r from-purple-500 to-pink-400 flex justify-around items-center shadow-lg">
      {/* Microphone Controls */}
      <div
        onClick={() => setIsMicOn(!isMicOn)}
        className="flex flex-col items-center cursor-pointer hover:scale-110 transition-all duration-300"
      >
        {isMicOn ? (
          <IoMdMic className="text-3xl text-white" />
        ) : (
          <IoMdMicOff className="text-3xl text-white" />
        )}
        <span className="text-sm text-white mt-1">{isMicOn ? "Mic On" : "Mic Off"}</span>
      </div>

      {/* Camera Controls */}
      <div
        onClick={() => setIsCameraOn(!isCameraOn)}
        className="flex flex-col items-center cursor-pointer hover:scale-110 transition-all duration-300"
      >
        {isCameraOn ? (
          <FiCamera className="text-3xl text-white" />
        ) : (
          <FiCameraOff className="text-3xl text-white" />
        )}
        <span className="text-sm text-white mt-1">{isCameraOn ? "Camera On" : "Camera Off"}</span>
      </div>

      {/* On/Off Controls */}
      <div
        // onClick={() => setIsCameraOn(!isCameraOn)}
        className="flex flex-col items-center cursor-pointer hover:scale-110 transition-all duration-300"
      >
        <ImCross className="text-3xl text-white" />
        <span className="text-sm text-white mt-1">Leave Room</span>
      </div>
    </div>
  );
}

export default GameControls;
