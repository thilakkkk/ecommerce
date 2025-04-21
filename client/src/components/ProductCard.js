import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, InputGroup, ListGroup, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ShareModal from './ShareModal';

const ProductCard = ({ product, theme, onAddToWishlist, isInWishlist }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showShareModal, setShowShareModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Dummy friends data - In real app, this would come from your backend
  const [friends, setFriends] = useState([
    { id: 1, username: 'john_doe', avatar: 'https://via.placeholder.com/40' },
    { id: 2, username: 'jane_smith', avatar: 'https://via.placeholder.com/40' },
    { id: 3, username: 'mike_wilson', avatar: 'https://via.placeholder.com/40' },
    { id: 4, username: 'sarah_parker', avatar: 'https://via.placeholder.com/40' },
    { id: 5, username: 'alex_brown', avatar: 'https://via.placeholder.com/40' }
  ]);

  const handleShare = (e) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const handleSendToFriends = () => {
    console.log('Sending product to friends:', selectedFriends);
    setSelectedFriends([]);
    setSearchTerm('');
    setShowShareModal(false);
  };

  const filteredFriends = friends.filter(friend =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardStyle = {
    height: '100%',
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    borderColor: theme === 'dark' ? '#333' : '#e0e0e0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const imageContainerStyle = {
    height: '200px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '10px',
  };

  const buttonStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#90caf9',
    borderColor: theme === 'dark' ? '#333' : '#64b5f6',
    color: theme === 'dark' ? '#fff' : '#2c3e50',
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    onAddToWishlist(product);
  };

  return (
    <>
      <Card 
        style={cardStyle} 
        className={`h-100 ${theme === 'dark' ? 'text-light' : ''} product-card`}
        onClick={handleCardClick}
      >
        {/* Share Button */}
        <Button
          variant="link"
          className="position-absolute end-0 mt-2 me-2 text-primary bg-white rounded-circle p-2"
          style={{ width: '40px', height: '40px', zIndex: 1 }}
          onClick={handleShare}
        >
          <i className="bi bi-share-fill"></i>
        </Button>

        <div style={imageContainerStyle}>
          <Card.Img 
            variant="top" 
            src={product.image} 
            alt={product.name} 
            style={imageStyle}
          />
        </div>
        <Card.Body>
          <Card.Title className="h5 mb-2">{product.name}</Card.Title>
          <Card.Text className="text-primary fw-bold mb-2">₹{product.price}</Card.Text>
          <Card.Text className={`mb-3 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
            {product.description}
          </Card.Text>
          <div className="d-flex gap-2">
            <Button 
              variant="primary" 
              className="flex-grow-1"
              style={buttonStyle}
              onClick={(e) => {
                e.stopPropagation();
                const result = addToCart(product);
                setToastMessage(result.message);
                setShowToast(true);
              }}
            >
              Add to Cart
            </Button>
            <Button 
              variant={isInWishlist ? "danger" : theme === 'dark' ? 'outline-light' : 'outline-dark'}
              className="d-flex align-items-center justify-content-center"
              onClick={handleWishlistClick}
            >
              <i className={`bi ${isInWishlist ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Share Modal */}
      <ShareModal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        theme={theme}
        product={product}
      />

      {/* Toast notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
        className={theme === 'dark' ? 'bg-dark text-light' : ''}
      >
        <Toast.Header className={theme === 'dark' ? 'bg-dark text-light' : ''}>
          <strong className="me-auto">Cart</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
};

export default ProductCard; 