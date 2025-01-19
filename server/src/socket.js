export function setupSocket(io) {
  let players = [];

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    players[socket.id] = { x: 0, y: 0 };

    socket.on("sprite-move", (data) => {
      players[socket.id] = data;
      socket.broadcast.emit("sprite-update", { id: socket.id, ...data });
    });

    socket.on("newDeviceAdded", (msg) => {
     
      socket.broadcast.emit("newDeviceUpdate", socket.id);
    });

    socket.on("creation-complete", () => {
      const playersWithIds = Object.keys(players)
      .map((id) => ({
        id: id,
        player: players[id],
      }))
      .filter((playerObj) => playerObj.id !== socket.id);
    

    
      io.to(socket.id).emit("infoOfLivePlayers", playersWithIds);
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);

      delete players[socket.id];

      socket.broadcast.emit("sprite-disconnect", { id: socket.id });
    });
  });
}
