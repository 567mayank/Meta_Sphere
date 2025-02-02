// import AgoraRTM from "agora-rtm-sdk";


// const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
// console.log("APP_ID:", APP_ID);
// const TOKEN = null;
// const USER_ID = Math.floor(Math.random() * 10000).toString();
// const CHANNEL_NAME = "game-room";

// let client = null;
// let channel = null;

// export const initAgoraRTM = async (onMessage) => {
//   try {
//     // Debug logs
//     console.log("Starting initialization with APP_ID:", APP_ID);
//     console.log("AgoraRTM:", typeof AgoraRTM, AgoraRTM);

//     // Try the Web SDK v1.x initialization pattern
//     client = AgoraRTM.createInstance(APP_ID);
//     if (!client) {
//       throw new Error('Failed to create RTM instance');
//     }

//     console.log("Client created successfully:", client);

//     await client.login({ token: TOKEN, uid: USER_ID });
//     console.log("Login successful");

//     channel = client.createChannel(CHANNEL_NAME);
//     console.log("Channel created:", channel);

//     await channel.join();
//     console.log("Channel joined");

//     client.on("MessageFromPeer", async (message, peerId) => {
//       const parsedMessage = JSON.parse(message.text);
//       onMessage(parsedMessage, peerId);
//     });

//     console.log("Agora RTM Initialized:", USER_ID);
//     return { client, channel, USER_ID };
//   } catch (error) {
//     console.error("Agora RTM Initialization Error:", {
//       error,
//       errorName: error.name,
//       errorMessage: error.message,
//       errorStack: error.stack
//     });
//     throw error;  // Re-throw the error for proper error handling
//   }
// };

// export const sendMessageToPeer = async (targetId, message) => {
//   if (client) {
//     await client.sendMessageToPeer({
//       text: JSON.stringify(message),
//       to: targetId,
//     });
//   }
// };































import AgoraRTM from "agora-rtm-sdk";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'; // Your backend URL
const USER_ID = Math.floor(Math.random() * 10000).toString();
const CHANNEL_NAME = "game-room";

let client = null;
let channel = null;

// Function to fetch token from your backend
const fetchToken = async (uid) => {
  try {
    // Full URL to your token generation endpoint
    const tokenEndpoint = `${BACKEND_URL}/token/generate`;
    
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),
      // Include credentials if you're using session-based auth
      // credentials: 'include', 
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch token');
    }
    
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
};

export const initAgoraRTM = async (onMessage) => {
  try {
    console.log("Starting initialization with APP_ID:", APP_ID);
    
    client = AgoraRTM.createInstance(APP_ID);
    
    // Get token from backend
    const token = await fetchToken(USER_ID);
    
    if (!token) {
      throw new Error('Failed to get token');
    }
    
    // Login with token
    await client.login({ 
      uid: USER_ID,
      token: token
    });

    channel = client.createChannel(CHANNEL_NAME);
    await channel.join();

    client.on("MessageFromPeer", async (message, peerId) => {
      const parsedMessage = JSON.parse(message.text);
      onMessage(parsedMessage, peerId);
    });

    console.log("Agora RTM Initialized:", USER_ID);
    return { client, channel, USER_ID };
  } catch (error) {
    console.error("Agora RTM Initialization Error:", {
      error,
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack
    });
    throw error;
  }
};

export const sendMessageToPeer = async (targetId, message) => {
  if (client) {
    await client.sendMessageToPeer({ text: JSON.stringify(message), to: targetId });
  }
};



