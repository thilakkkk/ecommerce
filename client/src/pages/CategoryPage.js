import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Modal, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const CategoryPage = ({ theme }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { messages, setMessages, selectedChat, setSelectedChat } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [friendSearchTerm, setFriendSearchTerm] = useState('');
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [productToShare, setProductToShare] = useState(null);

  // Load friends list with profile pictures
  useEffect(() => {
    if (user) {
      try {
        const savedFriends = JSON.parse(localStorage.getItem(`friends_${user.id}`) || '[]');
        const allUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        
        // Merge friend data with user data to get profile pictures
        const friendsWithProfile = savedFriends.map(friend => {
          const userData = allUsers.find(u => u.id === friend.id) || {};
          return {
            id: friend.id,
            name: userData.name || friend.name || 'Unknown User',
            username: userData.username || friend.username || 'unknown',
            profileImage: userData.profileImage || 'https://via.placeholder.com/40'
          };
        });
        console.log('Friends with profiles:', friendsWithProfile); // Debug log
        setFriends(friendsWithProfile);
      } catch (error) {
        console.error('Error loading friends:', error);
      }
    }
  }, [user]);

  // Filter friends based on search term
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(friendSearchTerm.toLowerCase()) ||
    friend.username.toLowerCase().includes(friendSearchTerm.toLowerCase())
  );

  const handleShareClick = (product) => {
    setProductToShare(product);
    setShowFriendsModal(true);
  };

  const handleShareToFriend = (friend) => {
    if (!user) {
      alert('Please login to share products');
      return;
    }

    try {
      // Create a shareable message
      const shareMessage = {
        id: Date.now(),
        sender: user.id,
        content: productToShare,
        type: 'product',
        timestamp: new Date().toISOString(),
      };

      // Add to messages
      const chatId = `chat_${Math.min(user.id, friend.id)}_${Math.max(user.id, friend.id)}`;
      const existingMessages = JSON.parse(localStorage.getItem(chatId) || '[]');
      const updatedMessages = [...existingMessages, shareMessage];
      localStorage.setItem(chatId, JSON.stringify(updatedMessages));

      alert(`Product shared with ${friend.name} successfully!`);
      setShowFriendsModal(false);
      setProductToShare(null);
    } catch (error) {
      console.error('Error sharing product:', error);
      alert('Failed to share product. Please try again.');
    }
  };

  // Filter products by category
  const categoryProducts = products.filter(product => product.category === category);

  // Apply search filter
  const filteredProducts = categoryProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply price range filter
  const priceFilteredProducts = filteredProducts.filter(product => {
    if (priceRange.min && priceRange.max) {
      return product.price >= Number(priceRange.min) && product.price <= Number(priceRange.max);
    }
    if (priceRange.min) {
      return product.price >= Number(priceRange.min);
    }
    if (priceRange.max) {
      return product.price <= Number(priceRange.max);
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...priceFilteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const getCategoryTitle = () => {
    switch (category) {
      case 'dresses':
        return 'Dresses';
      case 'electronics':
        return 'Electronics';
      case 'shoes':
        return 'Shoes';
      default:
        return 'Products';
    }
  };

  return (
    <Container fluid className="py-4">
      <h2 className={`mb-4 ${theme === 'dark' ? 'text-light' : ''}`}>{getCategoryTitle()}</h2>
      
      {/* Filters and Search */}
      <Row className="mb-4">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
          >
            <option value="default">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </Form.Select>
        </Col>
        <Col md={5}>
          <InputGroup>
            <Form.Control
              placeholder="Min price"
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
            />
            <Form.Control
              placeholder="Max price"
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
            />
            <Button 
              variant="outline-secondary"
              onClick={() => setPriceRange({ min: '', max: '' })}
            >
              Clear
            </Button>
          </InputGroup>
        </Col>
      </Row>

      {/* Products Grid */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {sortedProducts.map(product => (
          <Col key={product.id}>
            <Card 
              className={`h-100 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div style={{ 
                position: 'relative',
                paddingTop: '100%', // 1:1 Aspect Ratio
                overflow: 'hidden'
              }}>
                <Card.Img
                  variant="top"
                  src={product.image}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <Button
                  variant={isInWishlist(product.id) ? "danger" : "outline-danger"}
                  size="sm"
                  className="position-absolute top-0 end-0 m-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    isInWishlist(product.id)
                      ? removeFromWishlist(product.id)
                      : addToWishlist(product);
                  }}
                >
                  <i className={`bi bi-heart${isInWishlist(product.id) ? '-fill' : ''}`}></i>
                </Button>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="h6 text-truncate">{product.name}</Card.Title>
                <Card.Text className="text-primary mb-2">
                  ₹{Math.round(product.price * 20)}
                </Card.Text>
                <Card.Text className="small mb-3 flex-grow-1 text-truncate-2">
                  {product.description}
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="flex-grow-1"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareClick(product);
                    }}
                    className="d-flex align-items-center"
                  >
                    <i className="bi bi-share me-2"></i>
                    Share
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {sortedProducts.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
          <h5 className={theme === 'dark' ? 'text-light' : ''}>No Products Found</h5>
          <p className={`mb-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Friends List Modal */}
      <Modal
        show={showFriendsModal}
        onHide={() => {
          setShowFriendsModal(false);
          setProductToShare(null);
          setFriendSearchTerm('');
        }}
        centered
        className={theme === 'dark' ? 'dark-modal' : ''}
      >
        <Modal.Header closeButton className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}>
          <Modal.Title>Share Product</Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === 'dark' ? 'bg-dark text-light' : ''}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search friends..."
              value={friendSearchTerm}
              onChange={(e) => setFriendSearchTerm(e.target.value)}
              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
            />
          </Form.Group>

          <div className="share-with mt-3">
            <p className="mb-2">Share with:</p>
            {filteredFriends.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-people fs-1 text-muted mb-3 d-block"></i>
                <h5 className={theme === 'dark' ? 'text-light' : ''}>
                  {friendSearchTerm ? 'No matching friends found' : 'No friends yet'}
                </h5>
                <p className={`mb-0 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                  {friendSearchTerm ? 'Try a different search term' : 'Add friends to share products'}
                </p>
              </div>
            ) : (
              <ListGroup variant={theme === 'dark' ? 'dark' : ''}>
                {filteredFriends.map(friend => (
                  <ListGroup.Item
                    key={friend.id}
                    className={`d-flex align-items-center ${
                      theme === 'dark' ? 'bg-dark text-light border-secondary' : ''
                    }`}
                  >
                    <div className="position-relative me-3">
                      <img
                        src={friend.profileImage}
                        alt={friend.name}
                        className="rounded-circle"
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          objectFit: 'cover',
                          border: theme === 'dark' ? '2px solid #666' : '2px solid #ddd'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/40';
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{friend.name}</h6>
                      <small className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                        @{friend.username}
                      </small>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShareToFriend(friend)}
                      className="d-flex align-items-center"
                    >
                      <i className="bi bi-share me-2"></i>
                      Share
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CategoryPage; 