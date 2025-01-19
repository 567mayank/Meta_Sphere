// export function setupSocket(io) {
//   let players = [];

//   io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);
//     players[socket.id] = { x: 0, y: 0 };


//     socket.on("sprite-move", (data) => {
//       players[socket.id] = data;
//       socket.broadcast.emit("sprite-update", { id: socket.id, ...data });
//     });

//     socket.on("newDeviceAdded", (msg) => {
//       socket.broadcast.emit("newDeviceUpdate", socket.id);
//     });

//     socket.on("creation-complete", () => {
//       const playersWithIds = Object.keys(players)
//         .map((id) => ({
//           id: id,
//           x: players[id].x,
//           y: players[id].y,
//         }))
//         .filter((playerObj) => playerObj.id !== socket.id);

//       io.to(socket.id).emit("infoOfLivePlayers", playersWithIds);
//     });

//     socket.on("disconnect", () => {
//       console.log("A user disconnected:", socket.id);

//       delete players[socket.id];

//       socket.broadcast.emit("sprite-disconnect", { id: socket.id });
//     });
//   });
// }

// socket.js
export function setupSocket(io) {
  let players = {}; // Key: roomId, Value: { socketId: { x, y } }

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Event: Create a new room
    socket.on("create-room", ({ roomId }) => {
      socket.join(roomId); // Join the newly created room
      if (!players[roomId]) {
        players[roomId] = {};
      }
      players[roomId][socket.id] = { x: 0, y: 0 }; // Initialize player's position
      console.log(`Room created: ${roomId} by ${socket.id}`);
    });


    socket.on("newDeviceAdded", (msg) => {
            socket.broadcast.emit("newDeviceUpdate", socket.id);
          });


    // Event: Join an existing room
    socket.on("join-room", ({ roomId }) => {
      if (players[roomId]) {
        socket.join(roomId); // Join the room
        players[roomId][socket.id] = { x: 0, y: 0 }; // Initialize player's position
        console.log(`User ${socket.id} joined room: ${roomId}`);


       // console.log("inside join room : " + players[roomId])
        // Send info of current players in the room to the newly joined user
        const playersInRoom = Object.keys(players[roomId]).map((id) => ({
          id,
          ...players[roomId][id],
        }));

        console.log(playersInRoom)
        io.to(socket.id).emit("infoOfLivePlayers", playersInRoom);

        // Notify other players in the room
        socket.to(roomId).emit("newPlayerJoined", { id: socket.id });
      } else {
        console.log(`Room ${roomId} does not exist.`);
        io.to(socket.id).emit("room-not-found", { roomId });
      }
    });

    // Event: Sprite movement
    socket.on("sprite-move", ({ roomId, data }) => {
      if (players[roomId] && players[roomId][socket.id]) {
        players[roomId][socket.id] = data; // Update position
        socket.to(roomId).emit("sprite-update", { id: socket.id, ...data }); // Broadcast within room
      }
    });


    // Event: Creation complete
    socket.on("creation-complete", () => {
      const playersWithIds = Object.keys(players)
        .map((roomId) => {
          return Object.keys(players[roomId]).map((id) => ({
            id: id,
            x: players[roomId][id].x,
            y: players[roomId][id].y,
            roomId,
          }));
        })
        .flat()
        .filter((playerObj) => playerObj.id !== socket.id);

      io.to(socket.id).emit("infoOfLivePlayers", playersWithIds);
    });

    // Event: Disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);

      // Remove the player from all rooms
      for (const roomId in players) {
        if (players[roomId][socket.id]) {
          delete players[roomId][socket.id]; // Remove the player

          // Notify other players in the room
          socket.to(roomId).emit("sprite-disconnect", { id: socket.id });

          // Clean up empty rooms
          if (Object.keys(players[roomId]).length === 0) {
            delete players[roomId];
            console.log(`Room ${roomId} deleted as it is empty.`);
          }
        }
      }
    });
  });
}