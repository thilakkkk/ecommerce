import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const ChatProductMessage = ({ product, theme, sender }) => {
  const { user } = useAuth();

  // Get wishlist from localStorage
  const getChatWishlist = (chatId) => {
    return JSON.parse(localStorage.getItem(`chatWishlist_${chatId}`) || '[]');
  };

  // Check if product is in wishlist
  const isInChatWishlist = () => {
    const chatWishlist = getChatWishlist(chatId);
    return chatWishlist.some(item => item.id === product.id);
  };

  // Handle wishlist actions
  const handleAddToChatWishlist = () => {
    const chatWishlist = getChatWishlist(chatId);
    if (!chatWishlist.some(item => item.id === product.id)) {
      chatWishlist.push(product);
      localStorage.setItem(`chatWishlist_${chatId}`, JSON.stringify(chatWishlist));
    }
  };

  const handleRemoveFromChatWishlist = () => {
    const chatWishlist = getChatWishlist(chatId);
    const updatedWishlist = chatWishlist.filter(item => item.id !== product.id);
    localStorage.setItem(`chatWishlist_${chatId}`, JSON.stringify(updatedWishlist));
  };

  // Generate chat ID (consistent for both users)
  const chatId = `chat_${Math.min(user.id, sender.id)}_${Math.max(user.id, sender.id)}`;

  return (
    <Card className={`mb-3 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
      <div className="d-flex">
        <div style={{ width: '120px', height: '120px' }}>
          <Card.Img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <Card.Body>
          <Card.Title className="h6 mb-1">{product.name}</Card.Title>
          <Card.Text className="text-primary mb-2">
            ₹{product.price}
          </Card.Text>
          <Card.Text className={`small mb-2 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
            {product.description}
          </Card.Text>
          <div className="d-flex gap-2">
            {isInChatWishlist() ? (
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={handleRemoveFromChatWishlist}
              >
                <i className="bi bi-heart-fill me-1"></i>
                Remove from Chat Wishlist
              </Button>
            ) : (
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={handleAddToChatWishlist}
              >
                <i className="bi bi-heart me-1"></i>
                Add to Chat Wishlist
              </Button>
            )}
          </div>
        </Card.Body>
      </div>
    </Card>
  );
};

export default ChatProductMessage; 