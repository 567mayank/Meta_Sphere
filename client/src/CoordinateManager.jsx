import React, { useEffect, useState } from 'react';
import { useSocket } from './SocketContext';

const CoordinateManager = ({ coordinates, onUpdate }) => {
    const socket = useSocket();
    const [others, setOthers] = useState({});

    useEffect(() => {
        if (socket) {
            // Emit player coordinates 
            if (coordinates) {
                socket.emit('sprite-move', coordinates);
            }

            //  updates from other players
            socket.on('sprite-update', (data) => {
                setOthers((prev) => ({ ...prev, [data.id]: data }));
                onUpdate(data); // Notify parent component
            });

        
            return () => {
                socket.off('sprite-update');
            };
        }
    }, [socket, coordinates, onUpdate]);

};

export default CoordinateManager;