"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Phone, Settings, Activity, RefreshCw, MessageSquare, PhoneCall, PhoneIncoming, PhoneOutgoing, Send, X, Check } from 'lucide-react';

interface Message {
  id?: string | number;
  _id?: string;
  from: string;
  to: string;
  body: string;
  timestamp?: string | Date;
  createdAt?: string | Date;
  direction: string;
  messageSid?: string;
}

interface CallLog {
  id?: string | number;
  _id?: string;
  timestamp?: string | Date;
  createdAt?: string | Date;
  from: string;
  to: string;
  callSid?: string;
  status: string;
  direction: string;
  connectedAt?: string;
}

interface IncomingCall {
  id?: string | number;
  _id?: string;
  callSid: string;
  from: string;
  to: string;
  timestamp?: string | Date;
  createdAt?: string | Date;
  status: string;
}

interface Config {
  twilioNumbers: string[];
  webhookUrl?: string;
  port?: number | string;
  webhookBaseUrl?: string;
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [incomingCalls, setIncomingCalls] = useState<IncomingCall[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dialNumber, setDialNumber] = useState('');
  const [dialFrom, setDialFrom] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messageTo, setMessageTo] = useState('');
  const [messageFrom, setMessageFrom] = useState('');

  useEffect(() => {
    fetchConfig();
    fetchData();
    const interval = setInterval(() => {
      fetchMessages();
      fetchIncomingCalls();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await axios.get('/api/config');
      const numbers = (response.data.twilioNumbers || []).filter(Boolean);
      const cfg = { ...response.data, twilioNumbers: numbers } as Config;
      setConfig(cfg);
      if (numbers.length > 0) {
        setDialFrom(numbers[0]);
        setMessageFrom(numbers[0]);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchMessages(), fetchCallLogs(), fetchIncomingCalls()]);
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/twilio/messages');
      const mapped = response.data.map((m: any) => ({
        id: m._id || m.id,
        from: m.from,
        to: m.to,
        body: m.body,
        timestamp: m.timestamp || m.createdAt,
        direction: m.direction,
        messageSid: m.messageSid
      }));
      setMessages(mapped);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchCallLogs = async () => {
    try {
      const response = await axios.get('/api/twilio/logs');
      const mapped = response.data.map((c: any) => ({
        id: c._id || c.id,
        timestamp: c.timestamp || c.createdAt,
        from: c.from,
        to: c.to,
        callSid: c.callSid,
        status: c.status,
        direction: c.direction
      }));
      setCallLogs(mapped);
    } catch (error) {
      console.error('Error fetching call logs:', error);
    }
  };

  const fetchIncomingCalls = async () => {
    try {
      const response = await axios.get('/api/twilio/incoming-calls');
      const mapped = response.data.map((c: any) => ({
        id: c._id || c.id,
        callSid: c.callSid,
        from: c.from,
        to: c.to,
        timestamp: c.timestamp || c.createdAt,
        status: c.status
      }));
      setIncomingCalls(mapped);
    } catch (error) {
      console.error('Error fetching incoming calls:', error);
    }
  };

  const makeCall = async () => {
    if (!dialNumber || !dialFrom) {
      alert('Please enter a number to call and select a from number');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post('/api/twilio/make-call', { to: dialNumber, from: dialFrom });
      alert(`Call initiated! Call SID: ${response.data.callSid}`);
      setDialNumber('');
      fetchCallLogs();
    } catch (error: any) {
      console.error('Error making call:', error);
      alert(`Error making call: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageTo || !messageFrom || !messageBody) {
      alert('Please fill in all message fields');
      return;
    }
    try {
      setLoading(true);
      await axios.post('/api/twilio/send-sms', { to: messageTo, from: messageFrom, body: messageBody });
      alert('Message sent successfully!');
      setMessageBody('');
      setMessageTo('');
      fetchMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert(`Error sending message: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const answerCall = async (callSid: string) => {
    try {
      setLoading(true);
      await axios.post('/api/twilio/answer-call', { callSid });
      alert(`Call answered successfully! Call SID: ${callSid}`);
      await Promise.all([fetchIncomingCalls(), fetchCallLogs()]);
    } catch (error: any) {
      console.error('Error answering call:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      alert(`Error answering call: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const rejectCall = async (callSid: string) => {
    try {
      setLoading(true);
      await axios.post('/api/twilio/reject-call', { callSid });
      alert(`Call rejected successfully! Call SID: ${callSid}`);
      await Promise.all([fetchIncomingCalls(), fetchCallLogs()]);
    } catch (error: any) {
      console.error('Error rejecting call:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      alert(`Error rejecting call: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (number: string) => {
    if (number?.startsWith('+1') && number.length === 12) {
      return `+1 (${number.slice(2, 5)}) ${number.slice(5, 8)}-${number.slice(8)}`;
    }
    return number;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'connected':
      case 'answered':
        return 'status-success';
      case 'failed':
      case 'busy':
      case 'no-answer':
      case 'rejected':
        return 'status-failed';
      case 'initiated':
      case 'ringing':
        return 'status-pending';
      default:
        return 'status-unknown';
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Phone className="logo-icon" />
            <h1>Twilio Communications</h1>
          </div>
          <button onClick={fetchData} className="refresh-btn" disabled={loading}>
            <RefreshCw className="icon" />
            Refresh
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button className={activeTab === 'dashboard' ? 'tab active' : 'tab'} onClick={() => setActiveTab('dashboard')}>
          <Activity className="icon" />
          Dashboard
        </button>
        <button className={activeTab === 'messages' ? 'tab active' : 'tab'} onClick={() => setActiveTab('messages')}>
          <MessageSquare className="icon" />
          Messages
        </button>
        <button className={activeTab === 'dialer' ? 'tab active' : 'tab'} onClick={() => setActiveTab('dialer')}>
          <PhoneOutgoing className="icon" />
          Dialer
        </button>
        <button className={activeTab === 'calls' ? 'tab active' : 'tab'} onClick={() => setActiveTab('calls')}>
          <PhoneIncoming className="icon" />
          Calls
          {incomingCalls.length > 0 && <span className="notification-badge">{incomingCalls.length}</span>}
        </button>
        <button className={activeTab === 'settings' ? 'tab active' : 'tab'} onClick={() => setActiveTab('settings')}>
          <Settings className="icon" />
          Settings
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Messages</h3>
                <div className="stat-number">{messages.length}</div>
              </div>
              <div className="stat-card">
                <h3>Total Calls</h3>
                <div className="stat-number">{callLogs.length}</div>
              </div>
              <div className="stat-card">
                <h3>Active Calls</h3>
                <div className="stat-number">{incomingCalls.length}</div>
              </div>
            </div>

            <div className="recent-activity">
              <div className="section">
                <h2>Recent Messages</h2>
                <div className="activity-list">
                  {messages.slice(0, 5).map((msg) => (
                    <div key={String(msg.id)} className={`activity-item ${msg.direction}`}>
                      <MessageSquare className="activity-icon" />
                      <div className="activity-content">
                        <div className="activity-header">
                          <span>
                            {msg.direction === 'inbound' ? 'From' : 'To'}: {formatPhoneNumber(msg.direction === 'inbound' ? msg.from : msg.to)}
                          </span>
                          <span className="timestamp">{new Date(String(msg.timestamp)).toLocaleString()}</span>
                        </div>
                        <div className="activity-body">{msg.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <h2>Recent Calls</h2>
                <div className="activity-list">
                  {callLogs.slice(0, 5).map((call) => (
                    <div key={String(call.id)} className={`activity-item ${call.direction}`}>
                      <div className="call-header">
                        <PhoneCall className="call-icon" />
                        <span className="call-direction">{call.direction === 'inbound' ? 'Incoming' : 'Outgoing'}</span>
                        <span className="call-numbers">
                          {`${formatPhoneNumber(call.from)} → ${formatPhoneNumber(call.to)}`}
                        </span>
                        <span className="timestamp">{new Date(String(call.timestamp)).toLocaleString()}</span>
                      </div>
                      <div className="call-status">
                        <span className={`status ${getStatusColor(call.status)}`}>{call.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-tab">
            <div className="section message-composer">
              <div className="message-inputs">
                <div className="input-group">
                  <label>From Number</label>
                  <select className="select-input" value={messageFrom} onChange={(e) => setMessageFrom(e.target.value)} disabled={!config?.twilioNumbers?.length}>
                    {config?.twilioNumbers?.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>To Number</label>
                  <input className="text-input" placeholder="Recipient number" value={messageTo} onChange={(e) => setMessageTo(e.target.value)} />
                </div>
              </div>
              <div className="message-text">
                <textarea className="message-textarea" placeholder="Type your message..." value={messageBody} onChange={(e) => setMessageBody(e.target.value)} />
                <button className="send-btn" onClick={sendMessage} disabled={loading}>
                  <Send className="icon" /> Send
                </button>
              </div>
            </div>

            <div className="section">
              <div className="section-header">
                <h2>Message History</h2>
                <button className="clear-btn" onClick={async () => { await axios.delete('/api/twilio/messages'); fetchMessages(); }}>
                  Clear Messages
                </button>
              </div>
              <div className="messages-list">
                {messages.map((msg) => (
                  <div key={String(msg.id)} className={`message-item ${msg.direction}`}>
                    <div className="message-content" style={{ width: '100%' }}>
                      <div className="message-header">
                        <span>
                          {msg.direction === 'inbound' ? 'From' : 'To'}: {formatPhoneNumber(msg.direction === 'inbound' ? msg.from : msg.to)}
                        </span>
                        <span className="timestamp">{new Date(String(msg.timestamp)).toLocaleString()}</span>
                      </div>
                      <div className="message-body">{msg.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dialer' && (
          <div className="section dialer">
            <div className="dialer-inputs">
              <div className="input-group">
                <label>From Number</label>
                <select className="select-input" value={dialFrom} onChange={(e) => setDialFrom(e.target.value)} disabled={!config?.twilioNumbers?.length}>
                  {config?.twilioNumbers?.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>To Number</label>
                <input className="text-input" placeholder="Enter phone number" value={dialNumber} onChange={(e) => setDialNumber(e.target.value)} />
              </div>
            </div>
            <button className="call-btn" onClick={makeCall} disabled={loading}>
              <PhoneCall className="icon" /> Make Call
            </button>
          </div>
        )}

        {activeTab === 'calls' && (
          <div className="calls-tab">
            {incomingCalls.length > 0 && (
              <div className="section incoming-calls-section">
                <h2>Incoming Calls</h2>
                {incomingCalls.map((call) => (
                  <div key={String(call.id)} className="incoming-call-item">
                    <div className="incoming-call-info">
                      <PhoneIncoming className="call-icon ringing" />
                      <div className="call-details">
                        <div className="caller-number">{formatPhoneNumber(call.from)}</div>
                        <div className="receiving-number">Calling {formatPhoneNumber(call.to)}</div>
                        <div className="call-time">{new Date(String(call.timestamp)).toLocaleTimeString()}</div>
                      </div>
                    </div>
                    <div className="call-actions">
                      <button onClick={() => answerCall(call.callSid)} className="answer-btn">
                        <Check className="icon" /> Answer
                      </button>
                      <button onClick={() => rejectCall(call.callSid)} className="reject-btn">
                        <X className="icon" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {incomingCalls.length === 0 && (
              <div className="section">
                <div className="empty-state">
                  <PhoneIncoming className="empty-icon" />
                  <h3>No Incoming Calls</h3>
                  <p>When someone calls your Twilio numbers, they will appear here.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings">
            <div className="section">
              <h2>Your Twilio Numbers</h2>
              {!config?.twilioNumbers?.length && (
                <p style={{ marginBottom: '1rem' }}>
                  No numbers configured. Set TWILIO_NUMBER_1 and/or TWILIO_NUMBER_2 in next/.env.local (or Vercel env).
                </p>
              )}
              <div className="numbers-list">
                {config?.twilioNumbers?.map((number, index) => (
                  <div key={number} className="number-item">
                    <Phone className="number-icon" />
                    <div className="number-info">
                      <div className="number-display">{formatPhoneNumber(number)}</div>
                      <div className="number-label">Twilio Number {index + 1}</div>
                    </div>
                    <div className="number-capabilities">
                      <span className="capability">Voice</span>
                      <span className="capability">SMS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h2>Webhook Configuration</h2>
              <p>Configure these webhook URLs in your Twilio Console:</p>
              <div className="webhook-config">
                <div className="webhook-item">
                  <label>Voice Webhook (Incoming Calls):</label>
                  <code>{config?.webhookBaseUrl || 'Loading...'}/api/twilio/incoming-call</code>
                </div>
                <div className="webhook-item">
                  <label>SMS Webhook (Incoming Messages):</label>
                  <code>{config?.webhookBaseUrl || 'Loading...'}/api/twilio/sms</code>
                </div>
              </div>
              <div className="webhook-instructions">
                <h4>Setup Instructions:</h4>
                <ol>
                  <li>Go to your Twilio Console</li>
                  <li>Navigate to Phone Numbers → Manage → Active numbers</li>
                  <li>Click on each phone number</li>
                  <li>Set the Voice webhook URL for call handling</li>
                  <li>Set the Messaging webhook URL for SMS handling</li>
                  <li>Set method to "POST" for both</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
