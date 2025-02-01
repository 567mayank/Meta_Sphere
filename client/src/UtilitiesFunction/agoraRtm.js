import AgoraRTM from "agora-rtm-sdk";

const APP_ID = import.meta.env.REACT_APP_AGORA_APP_ID;

const TOKEN = null;
const USER_ID = Math.floor(Math.random() * 10000).toString();
const CHANNEL_NAME = "game-room";

let client = null;
let channel = null;

export const initAgoraRTM = async (onMessage) => {
  try {
    client = AgoraRTM.createInstance(APP_ID);
    await client.login({ token: TOKEN, uid: USER_ID });
    channel = client.createChannel(CHANNEL_NAME);
    await channel.join();

    client.on("MessageFromPeer", async (message, peerId) => {
      const parsedMessage = JSON.parse(message.text);
      onMessage(parsedMessage, peerId);
    });

    console.log("Agora RTM Initialized:", USER_ID);
    return { client, channel, USER_ID };
  } catch (error) {
    console.error("Agora RTM Initialization Error:", error);
  }
};

export const sendMessageToPeer = async (targetId, message) => {
  if (client) {
    await client.sendMessageToPeer({
      text: JSON.stringify(message),
      to: targetId,
    });
  }
};
