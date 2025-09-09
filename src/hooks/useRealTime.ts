import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface RealTimeData {
  userCount: number;
  lastUpdate: string | null;
}

export const useRealTime = (user: any) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    userCount: 0,
    lastUpdate: null
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('🔗 Connected to real-time server');
      setIsConnected(true);
      
      // Send user login info
      newSocket.emit('user-login', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from real-time server');
      setIsConnected(false);
    });

    newSocket.on('user-count', (count: number) => {
      setRealTimeData(prev => ({
        ...prev,
        userCount: count
      }));
    });

    newSocket.on('profile-updated', (data: any) => {
      console.log('📡 Real-time profile update received:', data);
      setRealTimeData(prev => ({
        ...prev,
        lastUpdate: data.timestamp
      }));
      
      // Trigger custom event for components to listen
      window.dispatchEvent(new CustomEvent('profile-updated', { detail: data }));
    });

    newSocket.on('user-created', (data: any) => {
      console.log('📡 New user created:', data);
      window.dispatchEvent(new CustomEvent('user-created', { detail: data }));
    });

    newSocket.on('analysis-completed', (data: any) => {
      console.log('📡 Analysis completed:', data);
      window.dispatchEvent(new CustomEvent('analysis-completed', { detail: data }));
    });

    return () => {
      newSocket.close();
    };
  }, [user]);

  const emitUpdate = (eventName: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(eventName, data);
    }
  };

  return {
    socket,
    isConnected,
    realTimeData,
    emitUpdate
  };
};