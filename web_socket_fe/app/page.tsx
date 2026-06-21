
'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  message: string;
  fromUserId?: string;
  sender?: string;
  platform?: string;
}

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  console.log('PAGE RENDER');

  useEffect(() => {
  console.log("USE EFFECT RUN");
}, []);

  useEffect(() => {
    const socketInstance = io(
      'https://warner-shares-asylum-silly.trycloudflare.com',
      {
        auth: {
          userId: '2',
        },
      }
    );

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('✅ Connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', reason => {
      console.log('❌ Disconnected:', reason);
    });

    socketInstance.on('connect_error', error => {
      console.log('❌ Connect Error');
      console.log(error);
    });

    socketInstance.onAny((event, ...args) => {
      console.log('📥 EVENT:', event, args);
    });

    socketInstance.on('receive_message', data => {
      console.log('📩 Message Received:', data);

      setMessages(prev => [...prev, data]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = () => {
    console.log('BUTTON CLICKED');

    if (!message.trim()) {
      console.log('EMPTY MESSAGE');
      return;
    }

    const payload = {
      message,
      platform: 'web',
      toUserId: '1',
    };

    console.log('📤 EMITTING:', payload);

    socket?.emit('send_message', payload);

    setMessage('');
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 20,
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: 32,
            marginBottom: 20,
          }}
        >
          Web Socket Chat
        </h1>

        <div
          style={{
            height: 500,
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: 8,
            background: '#fff',
            padding: 16,
            marginBottom: 20,
          }}
        >
          {messages.length === 0 ? (
            <div>No messages yet</div>
          ) : (
            messages.map((item, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #eee',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                <div>
                  <strong>
                    {item.platform || 'unknown'}
                  </strong>
                </div>

                <div>{item.message}</div>

                <div
                  style={{
                    fontSize: 12,
                    color: '#666',
                    marginTop: 4,
                  }}
                >
                  {item.fromUserId ||
                    item.sender}
                </div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
          }}
        >
          <input
            value={message}
            onChange={e =>
              setMessage(e.target.value)
            }
            placeholder="Type message..."
            style={{
              flex: 1,
              padding: 12,
              border: '1px solid #ccc',
              borderRadius: 8,
              fontSize: 16,
            }}
          />

          <button
            type="button"
            onClick={sendMessage}
            style={{
              padding: '12px 24px',
              background: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
