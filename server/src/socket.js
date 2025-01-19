export function setupSocket(io) {
  let players = [];

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // socket.emit("sprite-update", Object.values(players));

    socket.on("sprite-move", (data) => {
      players[socket.id] = data
      socket.broadcast.emit("sprite-update", { id: socket.id, ...data });
    });

    socket.on("newDeviceAdded", (msg) => {
      // console.log(players)
      const playersWithIds = Object.keys(players).map((id) => ({
        id: id,
        player: players[id]  // This is the player data associated with the ID
      }));
      socket.broadcast.emit("newDeviceUpdate", playersWithIds);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);

      delete players[socket.id];

      io.emit("sprite-update", { id: socket.id, x: null, y: null });
    });
  });
}
