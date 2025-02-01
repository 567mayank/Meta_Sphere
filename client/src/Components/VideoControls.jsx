import { useState } from "react";

const VideoControls = ({ localStream }) => {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const toggleMic = () => {
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks[0].enabled = !micOn;
      setMicOn(!micOn);
    }
  };

  const toggleCamera = () => {
    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length > 0) {
      videoTracks[0].enabled = !cameraOn;
      setCameraOn(!cameraOn);
    }
  };

  return (
    <div className="fixed bottom-0 flex justify-center w-full bg-gray-800 p-2">
      <button onClick={toggleMic} className="mx-2 p-2 bg-gray-600 text-white rounded">
        {micOn ? "Mute Mic" : "Unmute Mic"}
      </button>
      <button onClick={toggleCamera} className="mx-2 p-2 bg-gray-600 text-white rounded">
        {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </button>
    </div>
  );
};

export default VideoControls;
