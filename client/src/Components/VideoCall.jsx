import { useState, useEffect, useRef } from "react";
import { initAgoraRTM, sendMessageToPeer } from "../UtilitiesFunction/agoraRtm";
import { setupPeerConnection, handleOffer, handleAnswer, handleICECandidate } from "../UtilitiesFunction/webRtc";
import VideoControls from "./VideoControls";

const VideoCall = () => {
  const [localStream, setLocalStream] = useState(null);
  const [rtmClient, setRtmClient] = useState(null);
  const [USER_ID, setUserId] = useState(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    let stream;
    let isMounted = true; // Ensure component is still mounted before updating state

    const getLocalMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (isMounted) {
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    getLocalMedia();

    initAgoraRTM(async (message, senderId) => {
      if (!localStream) return; // Ensure localStream is ready

      switch (message.type) {
        case "offer":
          await handleOffer(message.offer, senderId, localStream, async (targetId, answer) => {
            await sendMessageToPeer(targetId, { type: "answer", answer, senderId: USER_ID });
          });
          break;
        case "answer":
          await handleAnswer(message.answer, senderId);
          break;
        case "ice-candidate":
          await handleICECandidate(message.candidate, senderId);
          break;
        default:
          console.warn("Unknown message type:", message);
      }
    }).then(({ client, USER_ID }) => {
      if (isMounted) {
        setRtmClient(client);
        setUserId(USER_ID);
      }
    });

    return () => {
      isMounted = false;

      if (rtmClient) {
        rtmClient.logout();
      }

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <div id="video-container">
        <video ref={localVideoRef} autoPlay muted className="w-40 h-40 border-2 border-gray-300 rounded bg-black"></video>
      </div>
      <VideoControls localStream={localStream} />
    </div>
  );
};

export default VideoCall;
