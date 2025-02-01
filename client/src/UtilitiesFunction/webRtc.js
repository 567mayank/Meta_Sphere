const peerConnections = new Map();

export const setupPeerConnection = (localStream, targetId, sendICECandidate) => {
  const connection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  // Add local stream tracks
  localStream.getTracks().forEach((track) => connection.addTrack(track, localStream));

  connection.onicecandidate = (event) => {
    if (event.candidate) sendICECandidate(targetId, event.candidate);
  };

  connection.ontrack = (event) => {
    const remoteVideo = document.createElement("video");
    remoteVideo.srcObject = event.streams[0];
    remoteVideo.autoplay = true;
    remoteVideo.className = "w-40 h-40 border-2 border-gray-300 rounded bg-black";
    document.getElementById("video-container").appendChild(remoteVideo);
  };

  peerConnections.set(targetId, connection);
  return connection;
};

export const handleOffer = async (offer, senderId, localStream, sendAnswer) => {
  const connection = setupPeerConnection(localStream, senderId, sendICECandidate);
  await connection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await connection.createAnswer();
  await connection.setLocalDescription(answer);

  sendAnswer(senderId, answer);
};

export const handleAnswer = async (answer, senderId) => {
  const connection = peerConnections.get(senderId);
  if (connection) {
    await connection.setRemoteDescription(new RTCSessionDescription(answer));
  }
};

export const handleICECandidate = async (candidate, senderId) => {
  const connection = peerConnections.get(senderId);
  if (connection) {
    await connection.addIceCandidate(new RTCIceCandidate(candidate));
  }
};
