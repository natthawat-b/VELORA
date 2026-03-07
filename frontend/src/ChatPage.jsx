import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/ChatPage.css';
import { FiChevronLeft, FiSend } from 'react-icons/fi';
import { FiMessageCircle } from 'react-icons/fi';
import API_URL from './config/api';

function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partnerName, setPartnerName] = useState('');

  // Get current user info
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userType = localStorage.getItem('userType') || 'user';
  const currentUserId = userData._id || userData.id || '';

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/${chatId}`);
      if (response.data.success) {
        const chatData = response.data.payload;
        setChat(chatData);
        setMessages(chatData.messages || []);

        // Determine partner name
        if (userType === 'user') {
          // Current user is customer, partner is shop
          try {
            const shopRes = await axios.get(`${API_URL}/shop/${chatData.shopId}`);
            if (shopRes.data.success) {
              setPartnerName(shopRes.data.payload.shopname || 'ร้านค้า');
            }
          } catch {
            setPartnerName('ร้านค้า');
          }
        } else {
          // Current user is shop, partner is customer
          try {
            const userRes = await axios.get(`${API_URL}/user/${chatData.userId}`);
            if (userRes.data.success) {
              setPartnerName(userRes.data.payload.name || 'ลูกค้า');
            }
          } catch {
            setPartnerName('ลูกค้า');
          }
        }
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3 seconds
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/chat/${chatId}`);
        if (response.data.success) {
          setMessages(response.data.payload.messages || []);
        }
      } catch {
        // silent fail for polling
      }
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await axios.post(`${API_URL}/chat/send`, {
        chatId,
        sender: currentUserId,
        senderType: userType,
        text: newMessage.trim()
      });

      setNewMessage('');
      // Fetch latest messages immediately
      const response = await axios.get(`${API_URL}/chat/${chatId}`);
      if (response.data.success) {
        setMessages(response.data.payload.messages || []);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="chat-page-container">
        <div className="chat-loading">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="chat-page-container">
      {/* Header */}
      <header className="chat-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FiChevronLeft />
        </button>
        <div className="chat-partner-info">
          <div className="chat-partner-avatar">
            {partnerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="chat-partner-name">{partnerName}</div>
            <div className="chat-partner-status">ออนไลน์</div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <div style={{ textAlign: 'center' }}>
              <FiMessageCircle className="chat-empty-icon" />
              <p>เริ่มต้นสนทนากับ{userType === 'user' ? 'ร้านค้า' : 'ลูกค้า'}</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMine = msg.sender === currentUserId;
            return (
              <div key={index} className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
                <div className="message-bubble">
                  {msg.text}
                  <div className="message-time">{formatTime(msg.timestamp)}</div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="พิมพ์ข้อความ..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="btn-send"
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
