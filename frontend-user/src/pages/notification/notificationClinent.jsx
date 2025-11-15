import React, { useState, useEffect, useRef } from 'react';
import { Bell, Send, Check, X, Trash2, Users, Wifi, WifiOff } from 'lucide-react';
import { io } from 'socket.io-client';
import { signatureLevelEnum } from '../../enum.js';
import { BaseUrl } from '../../axiosInstance/axiosInstance.js';

const NotificationClientDemo = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  
  // Form states
  const [recipientId, setRecipientId] = useState('');
  const [invitationType, setInvitationType] = useState('friend');
  const [message, setMessage] = useState('');
  
  // Connection logs
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  // Initialize Socket Connection
  useEffect(() => {
    // Replace with your actual server URL and auth token
    const SERVER_URL = BaseUrl;
    const AUTH_TOKEN = `${signatureLevelEnum.user} ${localStorage.getItem('accessToken')}`;

    const newSocket = io(SERVER_URL, {
      auth: {
        authorization:{token: AUTH_TOKEN}
      },
      transports: ['websocket', 'polling']
    });

    // Connection events
    newSocket.on('connect', () => {
      setIsConnected(true);
      addLog('🟢 Connected to server', 'success');
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      addLog(`🔴 Disconnected: ${reason}`, 'error');
    });

    newSocket.on('connect_error', (error) => {
      addLog(`❌ Connection error: ${error.message}`, 'error');
    });

    // Connected event (custom from your server)
    newSocket.on('connected', (data) => {
      setCurrentUser(data.user);
      addLog(`✅ ${data.message}`, 'success');
      addLog(`👤 Logged in as: ${data.user.firstName || data.user._id}`, 'info');
      
      // Request pending invitations on connect
      newSocket.emit('get-pending-invitations');
    });

    // Notification events
    setupNotificationListeners(newSocket);

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Setup all notification event listeners
  const setupNotificationListeners = (socket) => {
    // New invitation received
    socket.on('new-invitation', (invitation) => {
      addLog(`📨 New invitation from user ${invitation.fromUserId}`, 'info');
      setNotifications(prev => [...prev, {
        ...invitation,
        timestamp: new Date().toISOString()
      }]);
      setPendingInvitations(prev => [...prev, invitation]);
      
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification('New Invitation', {
          body: invitation.message,
          icon: '/notification-icon.png'
        });
      }
    });

    // Invitation sent confirmation
    socket.on('invitation-sent', (result) => {
      addLog(`✉️ Invitation sent to user ${result.toUserId}`, 'success');
      setSentInvitations(prev => [...prev, result.invitation]);
    });

    // Invitation accepted (you're the sender)
    socket.on('invitation-accepted', (data) => {
      addLog(`✅ User ${data.acceptedBy} accepted your invitation`, 'success');
      setNotifications(prev => [...prev, {
        type: 'acceptance',
        message: `Your invitation was accepted`,
        timestamp: new Date().toISOString(),
        ...data
      }]);
      
      // Remove from sent invitations
      setSentInvitations(prev => 
        prev.filter(inv => inv.id !== data.invitationId)
      );
    });

    // Invitation refused (you're the sender)
    socket.on('invitation-refused', (data) => {
      addLog(`❌ User ${data.refusedBy} refused your invitation`, 'error');
      setNotifications(prev => [...prev, {
        type: 'refusal',
        message: `Your invitation was refused${data.reason ? `: ${data.reason}` : ''}`,
        timestamp: new Date().toISOString(),
        ...data
      }]);
      
      // Remove from sent invitations
      setSentInvitations(prev => 
        prev.filter(inv => inv.id !== data.invitationId)
      );
    });

    // Invitation canceled (you're the recipient)
    socket.on('invitation-canceled', (data) => {
      addLog(`🚫 Invitation ${data.invitationId} was canceled`, 'info');
      setPendingInvitations(prev => 
        prev.filter(inv => inv.id !== data.invitationId)
      );
    });

    // Pending invitations list
    socket.on('pending-invitations', (data) => {
      addLog(`📋 Received ${data.invitations.length} pending invitations`, 'info');
      setPendingInvitations(data.invitations);
    });

    // Error handling
    socket.on('invitation-error', (error) => {
      addLog(`⚠️ Error: ${error.error}`, 'error');
      alert(`Error: ${error.error}`);
    });
  };

  // Send invitation
  const sendInvitation = () => {
    if (!socket || !recipientId) {
      alert('Please enter a recipient user ID');
      return;
    }

    const invitationData = {
      toUserId: recipientId,
      invitationType: invitationType,
      message: message || `You have a new ${invitationType} invitation`,
      metadata: {
        sentFrom: 'web-client',
        timestamp: new Date().toISOString()
      }
    };

    addLog(`📤 Sending ${invitationType} invitation to ${recipientId}`, 'info');
    socket.emit('send-invitation', invitationData);

    // Clear form
    setRecipientId('');
    setMessage('');
  };

  // Accept invitation
  const acceptInvitation = (invitationId) => {
    if (!socket) return;

    addLog(`✅ Accepting invitation ${invitationId}`, 'info');
    socket.emit('accept-invitation', { invitationId });

    // Remove from pending
    setPendingInvitations(prev => 
      prev.filter(inv => inv.id !== invitationId)
    );
  };

  // Refuse invitation
  const refuseInvitation = (invitationId) => {
    if (!socket) return;

    const reason = prompt('Reason for refusing (optional):');
    
    addLog(`❌ Refusing invitation ${invitationId}`, 'info');
    socket.emit('refuse-invitation', { 
      invitationId,
      reason: reason || undefined
    });

    // Remove from pending
    setPendingInvitations(prev => 
      prev.filter(inv => inv.id !== invitationId)
    );
  };

  // Cancel sent invitation
  const cancelInvitation = (invitationId) => {
    if (!socket) return;

    addLog(`🚫 Canceling invitation ${invitationId}`, 'info');
    socket.emit('cancel-invitation', { invitationId });

    // Remove from sent
    setSentInvitations(prev => 
      prev.filter(inv => inv.id !== invitationId)
    );
  };

  // Request browser notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Bell className="text-indigo-600" />
              Socket.IO Notification System
            </h1>
            <div className="flex items-center gap-3">
              {isConnected ? (
                <span className="flex items-center gap-2 text-green-600 font-semibold">
                  <Wifi size={20} />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-600 font-semibold">
                  <WifiOff size={20} />
                  Disconnected
                </span>
              )}
              {currentUser && (
                <span className="text-gray-600">
                  User: <strong>{currentUser.firstName || currentUser._id}</strong>
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={requestNotificationPermission}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Enable browser notifications
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Send Invitation Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Send size={20} className="text-indigo-600" />
              Send Invitation
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient User ID
                </label>
                <input
                  type="text"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  placeholder="Enter user ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invitation Type
                </label>
                <select
                  value={invitationType}
                  onChange={(e) => setInvitationType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="friend">Friend Request</option>
                  <option value="game">Game Invitation</option>
                  <option value="team">Team Invitation</option>
                  <option value="event">Event Invitation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a custom message"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={sendInvitation}
                disabled={!isConnected}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Send Invitation
              </button>
            </div>
          </div>

          {/* Connection Logs */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Connection Logs
            </h2>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg h-80 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'success' ? 'text-green-400' :
                    'text-gray-300'
                  }`}
                >
                  <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* Pending Invitations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={20} className="text-indigo-600" />
            Pending Invitations ({pendingInvitations.length})
          </h2>
          
          {pendingInvitations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending invitations</p>
          ) : (
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {invitation.type}
                        </span>
                        <span className="text-gray-500 text-sm">
                          from {invitation.fromUserId}
                        </span>
                      </div>
                      <p className="text-gray-700">{invitation.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(invitation.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => acceptInvitation(invitation.id)}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                        title="Accept"
                      >
                        <Check size={20} />
                      </button>
                      <button
                        onClick={() => refuseInvitation(invitation.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        title="Refuse"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sent Invitations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Sent Invitations ({sentInvitations.length})
          </h2>
          
          {sentInvitations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sent invitations</p>
          ) : (
            <div className="space-y-3">
              {sentInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {invitation.type}
                        </span>
                        <span className="text-gray-500 text-sm">
                          to {invitation.toUserId}
                        </span>
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                          Pending
                        </span>
                      </div>
                      <p className="text-gray-700">{invitation.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(invitation.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => cancelInvitation(invitation.id)}
                      className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors ml-4"
                      title="Cancel"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Notifications ({notifications.length})
          </h2>
          
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No notifications yet</p>
          ) : (
            <div className="space-y-3">
              {notifications.slice().reverse().map((notification, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <p className="text-gray-700">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.timestamp || notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationClientDemo;