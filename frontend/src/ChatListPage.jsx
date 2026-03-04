import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/ChatListPage.css';
import { FiChevronLeft, FiMessageCircle } from 'react-icons/fi';
import API_URL from './config/api';

function ChatListPage() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partnerNames, setPartnerNames] = useState({});
  const [seenCounts, setSeenCounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('velora_chat_seen') || '{}'); } catch { return {}; }
  });

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userType = localStorage.getItem('userType') || 'user';
  const currentUserId = userData._id || userData.id || '';

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/list/${currentUserId}`);
      if (response.data.success) {
        const chatList = response.data.payload;
        setChats(chatList);

        // Mark all messages as "seen" by saving total count
        const totalMessages = chatList.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0);
        localStorage.setItem('velora_chat_seen_count', totalMessages.toString());

        // Fetch partner names
        const names = {};
        for (const chat of chatList) {
          const partnerId = userType === 'shop' ? chat.userId : chat.shopId;
          try {
            if (userType === 'shop') {
              // Partner is a user - use name from chat or default
              names[chat._id] = 'ลูกค้า';
            } else {
              // Partner is a shop
              const shopRes = await axios.get(`${API_URL}/shop/${partnerId}`);
              if (shopRes.data.success) {
                names[chat._id] = shopRes.data.payload.shopname || 'ร้านค้า';
              }
            }
          } catch {
            names[chat._id] = userType === 'shop' ? 'ลูกค้า' : 'ร้านค้า';
          }
        }
        setPartnerNames(names);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="chat-list-container">
        <header className="chat-list-header">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <FiChevronLeft />
          </button>
          <h1>แชท</h1>
        </header>
        <div className="chat-list-empty">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="chat-list-container">
      <header className="chat-list-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FiChevronLeft />
        </button>
        <h1>แชท</h1>
      </header>

      <div className="chat-list-body">
        {chats.length === 0 ? (
          <div className="chat-list-empty">
            <FiMessageCircle className="chat-list-empty-icon" />
            <p>ยังไม่มีการสนทนา</p>
          </div>
        ) : (
          chats.map((chat) => {
            const name = partnerNames[chat._id] || (userType === 'shop' ? 'ลูกค้า' : 'ร้านค้า');
            const msgCount = chat.messages?.length || 0;
            const seenCount = seenCounts[chat._id] || 0;
            const newCount = msgCount - seenCount;

            const handleChatClick = () => {
              const updated = { ...seenCounts, [chat._id]: msgCount };
              setSeenCounts(updated);
              localStorage.setItem('velora_chat_seen', JSON.stringify(updated));
              navigate(`/chat/${chat._id}`);
            };

            return (
              <div
                key={chat._id}
                className="chat-list-item"
                onClick={handleChatClick}
              >
                <div className="chat-list-avatar">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="chat-list-info">
                  <p className="chat-list-name">{name}</p>
                  <p className="chat-list-last-msg">
                    {chat.lastMessage || 'ยังไม่มีข้อความ'}
                  </p>
                </div>
                <div className="chat-list-meta">
                  <span className="chat-list-time">{formatTime(chat.lastMessageAt)}</span>
                  {newCount > 0 && (
                    <span className="chat-list-badge">{newCount}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ChatListPage;
