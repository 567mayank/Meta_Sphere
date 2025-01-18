export function setupSocket(io) {
    let players = {}; 

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

     
        socket.emit('sprite-update', Object.values(players));

        
        socket.on('sprite-move', (data) => {
            
            players[socket.id] = data;

            
            io.emit('sprite-update', { id: socket.id, ...data });

            console.log(`Player ${socket.id} moved to x: ${data.x}, y: ${data.y}`);
        });

       
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
          
            delete players[socket.id];

            
            io.emit('sprite-update', { id: socket.id, x: null, y: null });
        });
    });
}
