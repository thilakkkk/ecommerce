import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // Load messages from localStorage when component mounts
  useEffect(() => {
    if (selectedChat) {
      const chatId = `chat_${Math.min(selectedChat.id, selectedChat.userId)}_${Math.max(selectedChat.id, selectedChat.userId)}`;
      const savedMessages = localStorage.getItem(chatId);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([]);
      }
    }
  }, [selectedChat]);

  return (
    <ChatContext.Provider value={{ messages, setMessages, selectedChat, setSelectedChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 