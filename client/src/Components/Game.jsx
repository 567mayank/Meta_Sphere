

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Phaser from "phaser";
import { preloadAssets } from "../UtilitiesFunction/preloadAssets";
import { createObjects } from "../UtilitiesFunction/objects";
import { createPlayer } from "../UtilitiesFunction/character";
import { createBackground } from "../UtilitiesFunction/background";
import { playerMovement } from "../UtilitiesFunction/playerMovement";
import { useSocket } from "../SocketContext";
import {
  deletePlayer,
  movePlayerTo,
} from "../UtilitiesFunction/multiPlayerFunctions";

import VideoCall from "./VideoCall";
import { initAgoraRTM } from "../UtilitiesFunction/agoraRtm";

function Game({ screenWidth, screenHeight, tileWidth, tileHeight, roomId, name }) {
  const [posX, setX] = useState(screenWidth / 2);
  const [posY, setY] = useState(screenHeight);
  const [localStream, setLocalStream] = useState(null);
  const socket = useSocket();
  const navigate = useNavigate();
  const [phaserGame, setPhaserGame] = useState(null);
  const [rtmClient, setRtmClient] = useState(null);
  const [USER_ID, setUserId] = useState(null);



  // Peer connection management
  const peerConnections = new Map();

  const getLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log("Local stream:", stream); // Debugging log
      setLocalStream(stream);

      const videoElement = document.getElementById("local-video");
      if (videoElement) {
        videoElement.srcObject = stream;
        console.log("Local video element set up.");
      } else {
        console.error("Local video element not found.");
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const setupPeerConnection = (targetId) => {
    const connection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach((track) => connection.addTrack(track, localStream));
    }

    // Handle ICE candidates
    connection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("rtc-ice-candidate", {
          targetId,
          candidate: event.candidate,
        });
      }
    };

    // Handle remote streams
    connection.ontrack = (event) => {
      const remoteVideo = document.createElement("video");
      remoteVideo.srcObject = event.streams[0];
      remoteVideo.autoPlay = true;
      remoteVideo.className = "w-40 h-40 border-2 border-gray-300 rounded bg-black";
      document.getElementById("video-container").appendChild(remoteVideo);
    };

    return connection;
  };

  useEffect(() => {
    getLocalMedia();

    socket.on("rtc-offer", async ({ senderId, offer }) => {
      const connection = setupPeerConnection(senderId);
      await connection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);

      socket.emit("rtc-answer", {
        targetId: senderId,
        answer,
      });

      peerConnections.set(senderId, connection);
    });

    socket.on("rtc-answer", async ({ senderId, answer }) => {
      const connection = peerConnections.get(senderId);
      if (connection) {
        await connection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("rtc-ice-candidate", async ({ senderId, candidate }) => {
      const connection = peerConnections.get(senderId);
      if (connection && candidate) {
        await connection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("rtc-offer");
      socket.off("rtc-answer");
      socket.off("rtc-ice-candidate");
    };
  }, []);

  useEffect(() => {
    socket.emit("sprite-move", { x: posX, y: posY, roomId, name });
    socket.on("error", (msg) => {
      alert(msg);
      navigate("/");
      return;
    });
  }, [posX, posY]);

  useEffect(() => {
    let objects, cursors, player;
    let players = new Map();

    class Example extends Phaser.Scene {
      preload() {
        preloadAssets(this);
      }

      create() {
        createBackground(
          this,
          screenWidth,
          screenHeight,
          tileWidth,
          tileHeight,
          "background"
        );

        objects = this.physics.add.staticGroup();
        createObjects(this, screenWidth, screenHeight, tileHeight, objects);

        player = this.createSecondPlayer(name);

        createPlayer(this, player, "char1");
        this.physics.add.collider(player, objects);

        cursors = this.input.keyboard.createCursorKeys();

        // for spawning of new player on board
        socket.on("newDeviceUpdate", ({ socketId, name }) => {
          const newPlayer = this.createSecondPlayer(name);
          players.set(socketId, newPlayer);
        });

        // for updating live players
        socket.on("infoOfLivePlayers", (msg) => {
          msg.map((playerData) => {
            const newPlayer = this.createSecondPlayer(
              playerData.name,
              playerData.x,
              playerData.y,
              "char1"
            );
            movePlayerTo(newPlayer, playerData.x, playerData.y, "turn", this);
            players.set(playerData.id, newPlayer);
          });
        });

        // Notify server of scene creation
        socket.emit("creation-complete", { roomId });

        // For updating other players' positions
        socket.on("sprite-update", (msg) => {
          const otherPlayer = players.get(msg.id);
          if (otherPlayer) {
            let x = otherPlayer.x;
            let y = otherPlayer.y;
            if (msg.x > x)
              movePlayerTo(otherPlayer, msg.x, msg.y, "right", this);
            else if (msg.x < x)
              movePlayerTo(otherPlayer, msg.x, msg.y, "left", this);
            else if (msg.y > y)
              movePlayerTo(otherPlayer, msg.x, msg.y, "down", this);
            else movePlayerTo(otherPlayer, msg.x, msg.y, "up", this);
          }
        });

        // Handle player disconnect
        socket.on("sprite-disconnect", (msg) => {
          const playerToRemove = players.get(msg.id);
          if (playerToRemove) {
            deletePlayer(playerToRemove);
            players.delete(msg.id);
          }
        });
      }

      // Create a new player with a name above their head
      createSecondPlayer(
        playerName = "char1",
        charHeight = screenHeight,
        charWidth = screenWidth / 2,
        charName = "char1"
      ) {
        const secondPlayer = this.physics.add
          .sprite(charWidth, charHeight, charName)
          .setDisplaySize(tileHeight * 1.3, tileHeight * 1.7)
          .setSize(tileHeight * 2, tileHeight * 1.3)
          .setOffset(tileHeight, tileHeight * 4.5)
          .refreshBody();

        const playerNameText = this.add
          .text(charWidth, charHeight - tileHeight, " " + playerName + " ", {
            font: "16px Arial",
            fill: "#000000",
            align: "center",
            backgroundColor: "#ffffff",
          })
          .setOrigin(0.5, 0.5);

        secondPlayer.playerNameText = playerNameText;

        this.physics.add.collider(secondPlayer, objects);
        return secondPlayer;
      }

      update() {
        // Update player movement
        playerMovement(player, cursors, 70);
        setX(player.x);
        setY(player.y);

        player.playerNameText.setPosition(player.x, player.y - tileHeight);

        // Update the positions of all players' name text
        players.forEach((playerSprite, id) => {
          playerSprite.playerNameText.setPosition(
            playerSprite.x,
            playerSprite.y - tileHeight
          );
        });
      }
    }

    // Phaser game configuration
    const config = {
      type: Phaser.AUTO,
      width: 1600,
      height: 900,
      scale: {
        mode: Phaser.Scale.FIT,
      },
      scene: Example,
      parent: "game-container",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
    };

    const phaserGameInstance = new Phaser.Game(config);
    setPhaserGame(phaserGameInstance);

    return () => {
      phaserGameInstance.destroy(true);
    };
  }, []);

  useEffect(() => {
    // Initialize Agora RTM and set state
    initAgoraRTM().then(({ client, USER_ID }) => {
      setRtmClient(client);
      setUserId(USER_ID);
    });

    return () => {
      if (rtmClient) rtmClient.logout();
    };
  }, []);



  return (
    <div>
      <div>
        {posX} {posY}
      </div>
      <div
        id="game-container"
        className="border-4 border-red-400 scale-90 flex bg-zinc-800 max-w-fit m-auto rounded-md"
      />
      <div id="video-container" className="flex gap-4"></div>

      {rtmClient && USER_ID && (
        <VideoCall rtmClient={rtmClient} USER_ID={USER_ID} />
      )}

    </div>
  );
}

export default Game;
