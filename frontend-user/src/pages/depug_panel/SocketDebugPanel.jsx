// SocketDebugPanel.jsx
import { useState, useEffect } from 'react';
import { socketService } from '../../services/Soket_Io/socketService.js';

export const SocketDebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const info = socketService.getRegisteredEvents();
      setDebugInfo({
        ...info,
        isConnected: socketService.getConnectionStatus(),
        socketId: socketService.socket?.id,
        hasSocket: !!socketService.socket
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const testReportNotification = () => {
    console.log('🧪 Testing manual report notification...');
    
    // Manually emit a test notification through the internal event system
    socketService.emitEvent('new-report-notification', {
      id: 'test_' + Date.now(),
      type: 'report',
      subType: 'report-accepted',
      message: 'TEST: This is a test report notification',
      metadata: {},
      timestamp: new Date().toISOString(),
      read: false
    });

    setTestResult('Test notification emitted! Check console and UI.');
  };

  const checkSocketListeners = () => {
    console.log('🔍 Checking socket listeners...');
    
    if (!socketService.socket) {
      setTestResult('❌ Socket not initialized!');
      return;
    }

    // Check if the socket has the listener registered
    const hasListener = socketService.socket._callbacks?.$new-report-notification;
    console.log('Socket _callbacks:', socketService.socket._callbacks);
    console.log('Has new-report-notification listener?', !!hasListener);
    
    setTestResult(hasListener 
      ? '✅ Socket IS listening for new-report-notification' 
      : '❌ Socket NOT listening for new-report-notification'
    );
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: 'white',
      border: '2px solid #333',
      borderRadius: 8,
      padding: 16,
      maxWidth: 400,
      maxHeight: 500,
      overflow: 'auto',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 9999,
      fontSize: 12,
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 12px 0' }}>🔧 Socket Debug Panel</h3>
      
      <div style={{ marginBottom: 12 }}>
        <strong>Status:</strong>{' '}
        <span style={{ color: debugInfo.isConnected ? 'green' : 'red' }}>
          {debugInfo.isConnected ? '✅ Connected' : '❌ Disconnected'}
        </span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Socket ID:</strong> {debugInfo.socketId || 'N/A'}
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Socket Events ({debugInfo.socketEvents?.length || 0}):</strong>
        <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
          {debugInfo.socketEvents?.map(event => (
            <li key={event} style={{
              color: event === '$new-report-notification' ? 'green' : 'black',
              fontWeight: event === '$new-report-notification' ? 'bold' : 'normal'
            }}>
              {event}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Callback Events ({debugInfo.callbackEvents?.length || 0}):</strong>
        <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
          {debugInfo.callbackEvents?.map(event => (
            <li key={event} style={{
              color: event === 'new-report-notification' ? 'green' : 'black',
              fontWeight: event === 'new-report-notification' ? 'bold' : 'normal'
            }}>
              {event}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
        <button 
          onClick={checkSocketListeners}
          style={{
            padding: '8px 12px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Check Listeners
        </button>

        <button 
          onClick={testReportNotification}
          style={{
            padding: '8px 12px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Test Report Notification
        </button>
      </div>

      {testResult && (
        <div style={{
          marginTop: 12,
          padding: 8,
          background: '#f0f0f0',
          borderRadius: 4
        }}>
          {testResult}
        </div>
      )}
    </div>
  );
};