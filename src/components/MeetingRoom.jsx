// src/pages/MeetingRoom.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useMeeting } from '../provider/MeetingProvider';

const MeetingRoom = () => {
  const { id: meetingId } = useParams();
  const { userInfo } = useMeeting();
  const socketRef = useRef(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validateAndJoinMeeting = async () => {
      try {
        const res = await axios.post('http://localhost:7500/meeting/verify', {
          meetingId,
        });

        if (res.data.success && userInfo) {
          setIsValid(true);

          // ✅ Socket is created only now
          const { io } = await import('socket.io-client');
          socketRef.current = io('http://localhost:7500');

          socketRef.current.emit('join-room', {
            roomId: meetingId,
            userId: userInfo.id,
            userName: userInfo.name,
          });

          socketRef.current.on('user-connected', ({ userId, userName }) => {
            console.log(`${userName} connected (${userId})`);
          });

          socketRef.current.on('user-disconnected', ({ userId }) => {
            console.log(`User disconnected: ${userId}`);
          });
        }
      } catch (err) {
        console.error('Failed to validate meeting', err);
      }
    };

    validateAndJoinMeeting();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, [meetingId, userInfo]);

  if (!isValid) return <div>Validating meeting...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Meeting Room: {meetingId}</h1>
      <p className="mt-4">Connected as {userInfo?.name}</p>
    </div>
  );
};

export default MeetingRoom;
