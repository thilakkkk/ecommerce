import React from 'react';
import { ListGroup, Image } from 'react-bootstrap';

const ChatList = ({ theme, chats, selectedChat, onSelectChat }) => {
  return (
    <ListGroup variant="flush">
      {chats.map((chat) => (
        <ListGroup.Item
          key={chat.id}
          action
          active={selectedChat?.id === chat.id}
          className={`d-flex align-items-center p-3 ${
            theme === 'dark' ? 'bg-dark text-light border-secondary' : ''
          }`}
          onClick={() => onSelectChat(chat)}
        >
          <Image
            src={`https://ui-avatars.com/api/?name=${chat.name}&background=random`}
            roundedCircle
            width={48}
            height={48}
            className="me-3"
          />
          <div className="flex-grow-1 min-width-0">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 text-truncate">{chat.name}</h6>
              <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                {chat.lastMessage?.timestamp}
              </small>
            </div>
            <p className={`mb-0 text-truncate ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
              {chat.lastMessage?.text || 'No messages yet'}
            </p>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ChatList; 