export function setupSocket(io) {
  let map = new Map();

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // for creating new room
    socket.on("create-room", ({roomId}) => {
      if (map.has(roomId)) {
        io.to(socket.id).emit("error", "Room Id Already Exist");
        return;
      }
      socket.join(roomId);
      map.set(roomId, []);
      map.get(roomId)[socket.id] = { x: 800, y: 852 };
      io.to(socket.id).emit(
        "room-created",
        `Room ${roomId} created successfully.`
      );

      socket.to(roomId).emit('newDeviceUpdate', socket.id)
    });

    // for joining old room
    socket.on("join-room", ({ roomId }) => {
      if (map.has(roomId) === false) {
        io.to(socket.id).emit("error", "Room Id Doesn't Exist");
        return;
      }
      socket.join(roomId);
      map.get(roomId)[socket.id] = { x: 800, y: 852 };
      io.to(socket.id).emit(
        "room-joined",
        `Room ${roomId} joined successfully.`
      );

      socket.to(roomId).emit('newDeviceUpdate', socket.id)
    });

    // for tracking movement
    socket.on("sprite-move", (data) => {
      if (map.has(data.roomId) === false) {
        io.to(socket.id).emit("error", "Room Id Doesn't Exist");
        return
      }
      map.get(data.roomId)[socket.id] = data;
      socket.to(data.roomId).emit("sprite-update", { id: socket.id, ...data });
    });

    // for getting info about live players
    socket.on("creation-complete", ({roomId}) => {
      if (map.has(roomId) === false) {
        io.to(socket.id).emit("error", "Room Id Doesn't Exist");
        return
      }
      const playersRoomId = map.get(roomId)
      const playersWithIds = Object.keys(playersRoomId)
        .map((id) => ({
          id: id,
          x: map.get(roomId)[id].x,
          y: map.get(roomId)[id].y,
        }))
        .filter((playerObj) => playerObj.id !== socket.id);

      io.to(socket.id).emit("infoOfLivePlayers", playersWithIds);
    });

    // for disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);

      let roomId = null;
      for (let [room, users] of map) {
        if (users[socket.id]) {
          roomId = room;
          break;
        }
      }
      if (roomId) {
        delete map.get(roomId)[socket.id];
        if (Object.keys(map.get(roomId)).length === 0) {
          map.delete(roomId);
          console.log(`Room ${roomId} is now empty and has been deleted.`);
        }
      }
      socket.broadcast.emit("sprite-disconnect", { id: socket.id });
    });
  });
}
