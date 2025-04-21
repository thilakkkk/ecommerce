import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = ({ theme }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, isInWishlist } = useWishlist();

  // In a real app, this would come from an API call or Redux store
  const products = [
    {
      id: 1,
      name: "Nike Air Max 270",
      price: 129.99,
      description: "Classic comfort meets modern design.",
      image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-shoes-V4DfZQ.png",
      details: {
        brand: "Nike",
        color: "Black/White",
        material: "Mesh and synthetic materials",
        features: [
          "Responsive Air Max cushioning",
          "Breathable mesh upper",
          "Durable rubber outsole",
          "Padded collar for comfort"
        ],
        sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      }
    },
    {
      id: 2,
      name: "Adidas Ultraboost 22",
      price: 159.99,
      description: "Revolutionary comfort and energy return.",
      image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
      details: {
        brand: "Adidas",
        color: "Core Black",
        material: "Primeknit textile upper",
        features: [
          "Boost cushioning",
          "Tailored Fiber Placement",
          "Continental™ Rubber outsole",
          "Linear Energy Push system"
        ],
        sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"]
      }
    },
    // Add other products here...
  ];

  const product = products.find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h2 className={theme === 'dark' ? 'text-light' : ''}>Product not found</h2>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </Container>
    );
  }

  const containerStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const imageStyle = {
    width: '100%',
    height: '400px',
    objectFit: 'contain',
    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f8f9fa',
    borderRadius: '8px',
    padding: '1rem',
  };

  const buttonStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#90caf9',
    borderColor: theme === 'dark' ? '#333' : '#64b5f6',
    color: theme === 'dark' ? '#fff' : '#2c3e50',
  };

  return (
    <Container className="py-4">
      <Button 
        variant="outline-primary" 
        onClick={() => navigate('/products')}
        className="mb-4"
      >
        <i className="bi bi-arrow-left me-2"></i>
        Back to Products
      </Button>

      <div style={containerStyle}>
        <Row>
          <Col md={6} className="mb-4 mb-md-0">
            <img 
              src={product.image} 
              alt={product.name}
              style={imageStyle}
            />
          </Col>
          <Col md={6}>
            <h2 className={`mb-3 ${theme === 'dark' ? 'text-light' : ''}`}>
              {product.name}
            </h2>
            <h3 className="text-primary mb-4">₹{product.price}</h3>
            <p className={`mb-4 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
              {product.description}
            </p>

            {/* Product Details */}
            <Card className={`mb-4 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
              <Card.Body>
                <h5 className="mb-3">Product Details</h5>
                <Row>
                  <Col xs={4}>Brand:</Col>
                  <Col>{product.details.brand}</Col>
                </Row>
                <Row className="mt-2">
                  <Col xs={4}>Color:</Col>
                  <Col>{product.details.color}</Col>
                </Row>
                <Row className="mt-2">
                  <Col xs={4}>Material:</Col>
                  <Col>{product.details.material}</Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Sizes */}
            <div className="mb-4">
              <h5 className={theme === 'dark' ? 'text-light' : ''}>Select Size</h5>
              <div className="d-flex gap-2 flex-wrap">
                {product.details.sizes.map(size => (
                  <Button
                    key={size}
                    variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
                    className="px-3 py-2"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <h5 className={theme === 'dark' ? 'text-light' : ''}>Key Features</h5>
              <ul className={theme === 'dark' ? 'text-light' : ''}>
                {product.details.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                size="lg"
                style={buttonStyle}
              >
                Add to Cart
              </Button>
              <Button
                variant={isInWishlist(product.id) ? "danger" : theme === 'dark' ? 'outline-light' : 'outline-dark'}
                size="lg"
                onClick={() => addToWishlist(product)}
              >
                {isInWishlist(product.id) ? (
                  <>
                    <i className="bi bi-heart-fill me-2"></i>
                    Remove from Wishlist
                  </>
                ) : (
                  <>
                    <i className="bi bi-heart me-2"></i>
                    Add to Wishlist
                  </>
                )}
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default ProductDetail; 