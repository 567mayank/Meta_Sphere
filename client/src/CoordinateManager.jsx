import React, { useEffect, useState } from 'react';
import { useSocket } from './SocketContext';

const CoordinateManager = ({ onUpdate }) => {
    const socket = useSocket();
    const [coordinates, setCoordinates] = useState({});
    const [others, setOthers] = useState({}); // Track other players' positions

    // Send updated coordinates to the server
    const sendCoordinates = (newCoordinates) => {
        if (socket) {
            socket.emit('sprite-move', newCoordinates);
        }
    };

    // Listen for updates from other players
    useEffect(() => {
        if (socket) {
            socket.on('sprite-update', (data) => {
                setOthers((prev) => ({ ...prev, [data.id]: data }));
                onUpdate(data);
            });
        }

        return () => {
            if (socket) socket.off('sprite-update');
        };
    }, [socket, onUpdate]);

    return null; 
};

export default CoordinateManager;
