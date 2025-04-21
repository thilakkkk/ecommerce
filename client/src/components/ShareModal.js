import React, { useState } from 'react';
import { Modal, Form, Button, ListGroup, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const ShareModal = ({ show, onHide, theme, product }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get user's friends from localStorage
  const friends = JSON.parse(localStorage.getItem(`friends_${user?.id}`) || '[]');

  // Filter friends based on search
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShare = (friend) => {
    // Get existing chat messages or initialize empty array
    const chatKey = `chat_${Math.min(user.id, friend.id)}_${Math.max(user.id, friend.id)}`;
    const chatMessages = JSON.parse(localStorage.getItem(chatKey) || '[]');

    // Add new product share message
    const newMessage = {
      id: Date.now(),
      type: 'product',
      content: product,
      sender: user.id,
      receiver: friend.id,
      timestamp: new Date().toISOString()
    };

    // Add message to chat
    chatMessages.push(newMessage);
    localStorage.setItem(chatKey, JSON.stringify(chatMessages));

    // Show success feedback (you can add a toast notification here)
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className={theme === 'dark' ? 'dark-modal' : ''}
    >
      <Modal.Header className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}>
        <Modal.Title>Share Product</Modal.Title>
        <Button 
          variant="link" 
          className="text-decoration-none" 
          onClick={onHide}
        >
          <i className="bi bi-x-lg"></i>
        </Button>
      </Modal.Header>
      <Modal.Body className={theme === 'dark' ? 'bg-dark text-light' : ''}>
        {/* Search Bar */}
        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
          />
        </Form>

        {/* Friend Suggestions or No Friends Message */}
        {friends.length > 0 ? (
          <div>
            <h6 className="mb-3">Share with:</h6>
            <ListGroup variant={theme === 'dark' ? 'dark' : ''}>
              {filteredFriends.map(friend => (
                <ListGroup.Item
                  key={friend.id}
                  action
                  className={`d-flex justify-content-between align-items-center ${
                    theme === 'dark' ? 'bg-dark text-light border-secondary' : ''
                  }`}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src="https://via.placeholder.com/40"
                      alt={friend.name}
                      className="rounded-circle me-2"
                      width="40"
                      height="40"
                    />
                    <div>
                      <div className="fw-bold">{friend.name}</div>
                      <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                        @{friend.username}
                      </small>
                    </div>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleShare(friend)}
                  >
                    Share
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ) : (
          <Card className={`text-center ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
            <Card.Body>
              <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
              <h6 className="mb-2">No Friends Yet</h6>
              <p className={`mb-3 small ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                Add friends to share products with them
              </p>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => window.location.href = '/profile'}
              >
                Find Friends
              </Button>
            </Card.Body>
          </Card>
        )}

        {/* Copy Link Option */}
        <div className={`mt-3 p-3 rounded ${theme === 'dark' ? 'bg-secondary' : 'bg-light'}`}>
          <div className="d-flex justify-content-between align-items-center">
            <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
              Or copy product link
            </small>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin + '/product/' + product.id);
              }}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShareModal; 