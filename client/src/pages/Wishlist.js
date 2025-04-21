import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Wishlist = ({ theme }) => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const [error, setError] = useState('');

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <Container className="py-4">
        <div className={`text-center py-5 ${theme === 'dark' ? 'text-light' : ''}`}>
          <i className="bi bi-person-x display-1"></i>
          <h3 className="mt-3">Please Log In</h3>
          <p>You need to be logged in to view your wishlist</p>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Log In
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className={`mb-4 ${theme === 'dark' ? 'text-light' : ''}`}>
        <i className="bi bi-heart-fill text-danger me-2"></i>
        My Wishlist
      </h2>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      {wishlistItems.length === 0 ? (
        <div className={`text-center py-5 ${theme === 'dark' ? 'text-light' : ''}`}>
          <i className="bi bi-heart display-1"></i>
          <h3 className="mt-3">Your wishlist is empty</h3>
          <p>Add items to your wishlist while shopping</p>
          <Button variant="primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {wishlistItems.map(product => (
            <Col key={product.id}>
              <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                <Card.Img variant="top" src={product.image} alt={product.name} />
                <Card.Body>
                  <Card.Title className="h5 mb-2">{product.name}</Card.Title>
                  <Card.Text className="text-primary fw-bold mb-2">${product.price}</Card.Text>
                  <Card.Text className={`mb-3 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                    {product.description}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button variant="primary" className="flex-grow-1">
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline-danger"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Wishlist; 