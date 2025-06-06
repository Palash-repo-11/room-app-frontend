// // src/pages/MeetingRoom.jsx
// import React, { useEffect, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { useMeeting } from '../provider/MeetingProvider';
// const { io } = await import('socket.io-client');
// const MeetingRoom = () => {
//   const { id: meetingId } = useParams();
//   const { userInfo } = useMeeting();
//   const socketRef = useRef(null);
//   const [isValid, setIsValid] = useState(false);
//   const [participants, setParticipants] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');

//   useEffect(() => {
//     const validateAndJoinMeeting = async () => {
//       try {
//         const res = await axios.post('http://localhost:7500/meeting/verify', {
//           meetingId,
//         });

//         if (res.data.success && userInfo) {
//           setIsValid(true);

//           socketRef.current = io('http://localhost:7500');

//           socketRef.current.emit('join-room', {
//             roomId: meetingId,
//             userId: userInfo.id,
//             userName: userInfo.name,
//           });

//           setParticipants((prev) => [
//             ...prev.filter(p => p.userId !== userInfo.id),
//             { userId: userInfo.id, userName: userInfo.name, isOwner: res.data.isOwner }
//           ]);

//           socketRef.current.on('user-connected', ({ userId, userName }) => {
//             setParticipants((prev) => [
//               ...prev.filter(p => p.userId !== userId),
//               { userId, userName, isOwner: false }
//             ]);
//           });

//           socketRef.current.on('user-disconnected', ({ userId }) => {
//             setParticipants((prev) => prev.filter(p => p.userId !== userId));
//           });

//           socketRef.current.on('receive-message', ({ userId, message, timestamp }) => {
//             setMessages((prev) => [...prev, { userId, message, timestamp }]);
//           });
//         }
//       } catch (err) {
//         console.error('Meeting validation failed:', err);
//       }
//     };

//     validateAndJoinMeeting();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         console.log('Socket disconnected');
//       }
//     };
//   }, [meetingId, userInfo]);

//   const handleSendMessage = () => {
//     if (messageInput.trim() && socketRef.current) {
//       socketRef.current.emit('send-message', {
//         roomId: meetingId,
//         userId: userInfo.id,
//         message: messageInput.trim()
//       });
//       setMessages((prev) => [
//         ...prev,
//         { userId: userInfo.id, message: messageInput.trim(), timestamp: new Date().toISOString() }
//       ]);
//       setMessageInput('');
//     }
//   };
//   if (!isValid) return <div>Validating meeting...</div>;

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Top main content */}
//       <div className="flex flex-1">
//         {/* Video Streaming Area */}
//         <div className="flex-1 bg-black flex items-center justify-center text-white text-xl">
//           Video Stream Placeholder
//         </div>

//         {/* Participants Sidebar */}
//         <div className="w-64 bg-white border-l shadow px-4 py-2 overflow-y-auto">
//           <h2 className="text-lg font-semibold mb-2">Participants</h2>
//           {participants.map(({ userId, userName, isOwner }) => (
//             <div key={userId} className="mb-1 flex justify-between items-center text-sm">
//               <span>{userName}</span>
//               {isOwner && <span className="text-xs text-blue-600 font-bold">Owner</span>}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Section */}
//       <div className="border-t bg-white px-4 py-2 h-56 overflow-hidden">
//         <h2 className="text-md font-semibold mb-2">Chat</h2>
//         <div className="overflow-y-auto h-32 border p-2 rounded bg-gray-50 text-sm">
//           {messages.map((msg, i) => (
//             <div key={i} className="mb-1">
//               <strong>{msg.userId === userInfo.id ? 'You' : msg.userId}:</strong> {msg.message}
//             </div>
//           ))}
//         </div>
//         <div className="flex mt-2">
//           <input
//             type="text"
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//             className="flex-1 border px-3 py-1 rounded mr-2"
//             placeholder="Type your message..."
//           />
//           <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-1 rounded">
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MeetingRoom;



import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useMeeting } from '../provider/MeetingProvider';
import { io } from 'socket.io-client';

const MeetingRoom = () => {
  const { id: meetingId } = useParams();
  const { userInfo } = useMeeting();
  const socketRef = useRef(null);

  const [isValid, setIsValid] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [ownerId, setOwnerId] = useState(null);

  const isOwner = userInfo?.id === ownerId;

  useEffect(() => {
    const init = async () => {
      try {
        console.log('🔍 Validating meeting...');
        const res = await axios.post('http://localhost:7500/meeting/verify', { meetingId });

        if (res.data.success && userInfo) {
          console.log('✅ Meeting verified:', res.data);
          setIsValid(true);
          setOwnerId(res.data.meeting.ownerId);

          socketRef.current = io('http://localhost:7500');
          console.log('🔌 Socket initialized');

          socketRef.current.emit('join-room', {
            roomId: meetingId,
            userId: userInfo.id,
            userName: userInfo.name,
            isOwner: isOwner,
          });
          console.log('📨 join-room sent');

          setParticipants([{ userId: userInfo.id, userName: userInfo.name, isSelf: true }]);

          socketRef.current.on('user-connected', ({ userId, userName }) => {
            console.log('🟢 user-connected:', userId, userName);
            setParticipants(prev => {
              const exists = prev.some(p => p.userId === userId);
              return exists ? prev : [...prev, { userId, userName }];
            });
          });

          socketRef.current.on('user-disconnected', ({ userId }) => {
            console.log('🔴 user-disconnected:', userId);
            setParticipants(prev => prev.filter(p => p.userId !== userId));
          });

          socketRef.current.on('receive-message', ({ userId, userName, message, timestamp, state }) => {
            console.log('💬 receive-message:', { userId, userName, message, timestamp, state });
            setMessages(prev => [...prev, { userId, userName, message, timestamp, state }]);
          });

          socketRef.current.on('owner-started-share', () => {
            console.log('📺 owner-started-share');
            setIsSharing(true);
          });

          socketRef.current.on('owner-stopped-share', () => {
            console.log('🛑 owner-stopped-share');
            setIsSharing(false);
          });

          socketRef.current.on('joined-room', (room) => {
            console.log('🙌 joined-room:', room);
            setParticipants(room.users);
            setMessages(room.messages || []);
          });
        }
      } catch (err) {
        console.error('❌ Validation failed:', err);
      }
    };

    init();

    return () => {
      console.log('🔌 Disconnecting socket...');
      socketRef.current?.disconnect();
    };
  }, [meetingId, userInfo]);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      console.log('📤 send-message:', chatInput);
      socketRef.current.emit('send-message', chatInput);

      setMessages(prev => [
        ...prev,
        {
          userId: userInfo.id,
          userName: userInfo.name,
          message: chatInput,
          timestamp: new Date().toISOString(),
          state: 'message',
        },
      ]);
      setChatInput('');
    }
  };

  const handleStartShare = () => {
    console.log('📡 start-share');
    socketRef.current.emit('start-share');
    setIsSharing(true);
  };

  const handleStopShare = () => {
    console.log('🛑 stop-share');
    socketRef.current.emit('stop-share', userInfo.id, userInfo.name);
    setIsSharing(false);
  };

  if (!isValid) return <div className="p-6">🔐 Validating meeting...</div>;

  return (
    <div className="p-4 grid grid-cols-4 gap-4 h-screen">
      {/* Stream Area */}
      <div className="col-span-3 bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-2">Meeting Room: {meetingId}</h2>
        <p className="text-sm mb-4 text-gray-500">
          {isSharing ? 'Owner is sharing their screen.' : 'No one is sharing screen.'}
        </p>
        {isOwner && (
          <button
            onClick={isSharing ? handleStopShare : handleStartShare}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isSharing ? 'Stop Sharing' : 'Start Sharing'}
          </button>
        )}
      </div>

      {/* Participant List */}
      <div className="bg-white border rounded-lg p-4 overflow-y-auto">
        <h3 className="text-lg font-bold mb-2">Participants</h3>
        <ul>
          {participants.map(p => (
            <li key={p.userId} className="mb-2 flex justify-between items-center">
              <span>{p.userName}</span>
              {p.userId === ownerId && (
                <span className="text-xs text-white bg-green-600 px-2 py-1 rounded">Owner</span>
              )}
              {p.isSelf && (
                <span className="text-xs text-blue-600 ml-2">(You)</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Box */}
      <div className="col-span-4 mt-4 bg-white p-4 border rounded-lg">
        <div className="h-48 overflow-y-auto border-b mb-2">
          {messages.map((msg, idx) => (
            <div key={idx} className="py-1">
              <strong>{msg.userName}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            className="flex-grow border px-2 py-1 rounded-l"
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-1 rounded-r">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;

