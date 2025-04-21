import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = ({ theme }) => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();

  // Calculate total price in rupees (using conversion rate of 1 USD = 20 INR)
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.price * 20) * item.quantity;
  }, 0);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  if (!user) {
    return (
      <Container className="py-4">
        <div className={`text-center py-5 ${theme === 'dark' ? 'text-light' : ''}`}>
          <i className="bi bi-person-x display-1"></i>
          <h3 className="mt-3">Please Log In</h3>
          <p>You need to be logged in to view your cart</p>
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
        <i className="bi bi-cart-fill text-primary me-2"></i>
        My Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className={`text-center py-5 ${theme === 'dark' ? 'text-light' : ''}`}>
          <i className="bi bi-cart display-1"></i>
          <h3 className="mt-3">Your cart is empty</h3>
          <p>Add items to your cart while shopping</p>
          <Button variant="primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          <Row>
            <Col md={8}>
              {cartItems.map(item => (
                <Card key={item.id} className={`mb-3 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs={3} sm={2}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="img-fluid rounded"
                          style={{ maxHeight: '80px', objectFit: 'contain' }}
                        />
                      </Col>
                      <Col xs={9} sm={4}>
                        <h5 className="mb-1">{item.name}</h5>
                        <p className="mb-0 text-primary">₹{Math.round(item.price * 20)}</p>
                      </Col>
                      <Col xs={6} sm={3}>
                        <div className="d-flex align-items-center">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </Col>
                      <Col xs={6} sm={3} className="text-end">
                        <p className="mb-2 text-primary fw-bold">₹{Math.round(item.price * 20 * item.quantity)}</p>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Col>
            <Col md={4}>
              <Card className={`${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                <Card.Body>
                  <h4 className="mb-3">Order Summary</h4>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Items ({cartItems.length}):</span>
                    <span>₹{Math.round(totalPrice)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr className={theme === 'dark' ? 'border-secondary' : ''} />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong className="text-primary">₹{Math.round(totalPrice)}</strong>
                  </div>
                  <Button variant="primary" className="w-100">
                    Proceed to Checkout
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Cart;
