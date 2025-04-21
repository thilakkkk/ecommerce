import React from 'react';
import { Carousel, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = ({ theme }) => {
  const categories = [
    { id: 1, name: 'Electronics', icon: '📱', path: '/category/electronics' },
    { id: 2, name: 'Fashion', icon: '👕', path: '/category/fashion' },
    { id: 3, name: 'Home & Kitchen', icon: '🏠', path: '/category/home-kitchen' },
    { id: 4, name: 'Books', icon: '📚', path: '/category/books' },
    { id: 5, name: 'Sports', icon: '⚽', path: '/category/sports' },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Nike Air Max 270",
      price: 10799,
      description: "Classic comfort meets modern design.",
      image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-shoes-V4DfZQ.png"
    },
    {
      id: 2,
      name: "Adidas Ultraboost 22",
      price: 13279,
      description: "Revolutionary comfort and energy return.",
      image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg"
    },
    {
      id: 3,
      name: "Puma RS-X³",
      price: 7469,
      description: "Retro-inspired design with modern technology.",
      image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_1200,h_1200/global/373308/02/sv01/fnd/IND/fmt/png/RS-X%C2%B3-Puzzle-Shoes"
    }
  ];

  const banners = [
    {
      id: 1,
      image: 'https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/w_1824,c_limit/b7c63a65-aa42-4c31-8768-9e08ea8b1f44/nike-just-do-it.jpg',
      title: 'Summer Sale',
      description: 'Up to 50% off on Sports Collection',
      link: '/sale/summer'
    },
    {
      id: 2,
      image: 'https://brand.assets.adidas.com/image/upload/f_auto,q_auto,fl_lossy/enUS/Images/running-fw23-ultraboost-light-global-launch-hp-mh-d_tcm221-1010929.jpg',
      title: 'New Arrivals',
      description: 'Check out our latest products',
      link: '/new-arrivals'
    },
    {
      id: 3,
      image: 'https://cdn.sanity.io/images/qa41whrn/prod/ed3512e342bf9f01f3d33e5e1a5c8455e61b5c1c-2000x1335.jpg',
      title: 'Free Shipping',
      description: 'On orders above ₹499',
      link: '/shipping'
    },
  ];

  const categoryStyle = {
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
    transform: 'translateY(0)',
  };

  const cardStyle = {
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
    border: 'none',
    borderRadius: '8px',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    transform: 'translateY(0)',
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} style={{ color: '#ffc107' }}>★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} style={{ color: '#ffc107' }}>⭐</span>);
      } else {
        stars.push(<span key={i} style={{ color: '#ffc107' }}>☆</span>);
      }
    }
    return stars;
  };

  // Add CSS for hover effects
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .category-card:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }
      .product-card:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      }
      .carousel-control-prev,
      .carousel-control-next {
        width: 5%;
        background: rgba(0,0,0,0.3);
      }
      .carousel-indicators {
        margin-bottom: 0.5rem;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Banner Carousel */}
      <Carousel className="mb-4" indicators={true} controls={true}>
        {banners.map((banner) => (
          <Carousel.Item key={banner.id}>
            <Link to={banner.link}>
              <img
                className="d-block w-100"
                src={banner.image}
                alt={banner.title}
                style={{ maxHeight: '400px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x400?text=Image+Not+Found';
                }}
              />
              <Carousel.Caption>
                <h3>{banner.title}</h3>
                <p>{banner.description}</p>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Featured Products */}
      <section className="mb-5">
        <h2 className={`mb-4 ${theme === 'dark' ? 'text-light' : ''}`}>
          <i className="bi bi-star-fill text-warning me-2"></i>
          Featured Products
        </h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {featuredProducts.map(product => (
            <Col key={product.id}>
              <ProductCard product={product} theme={theme} />
            </Col>
          ))}
        </Row>
      </section>

      {/* Categories */}
      <Container className="mb-5">
        <h4 className={`mb-4 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
          Shop by Category
        </h4>
        <Row className="g-4">
          {categories.map((category) => (
            <Col key={category.id} xs={6} sm={4} md={3} lg={2}>
              <Link to={category.path} style={{ textDecoration: 'none' }}>
                <div style={categoryStyle} className="category-card shadow-sm">
                  <div style={{ fontSize: '2rem' }}>{category.icon}</div>
                  <div className="mt-2">{category.name}</div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
