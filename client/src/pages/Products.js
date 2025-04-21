import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

const Products = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { addToWishlist, isInWishlist } = useWishlist();

  // Sample products data
  const products = [
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
    },
    {
      id: 4,
      name: "New Balance 574",
      price: 6639,
      description: "Timeless style with modern comfort.",
      image: "https://nb.scene7.com/is/image/NB/ml574evg_nb_02_i?$pdpflexf2$&wid=440&hei=440"
    },
    {
      id: 5,
      name: "Reebok Classic Leather",
      price: 5809,
      description: "Iconic design that never goes out of style.",
      image: "https://assets.reebok.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy,c_fill,g_auto/7dac2f3e4d7649be9640aae800bf4c8f_9366/Classic_Leather_Shoes_White_49797_01_standard.jpg"
    },
    {
      id: 6,
      name: "Converse Chuck 70 Hi",
      price: 7139,
      description: "Premium materials meet classic design.",
      image: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw5e36e710/images/a_107/162050C_A_107X1.jpg"
    }
  ];

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-4">
      {/* Search Bar */}
      <div className="mb-4">
        <InputGroup>
          <InputGroup.Text className={theme === 'dark' ? 'bg-dark border-secondary text-light' : ''}>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={theme === 'dark' ? 'bg-dark border-secondary text-light' : ''}
          />
        </InputGroup>
      </div>

      {/* Products Grid */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredProducts.map(product => (
          <Col key={product.id}>
            <ProductCard 
              product={product} 
              theme={theme}
              onAddToWishlist={addToWishlist}
              isInWishlist={isInWishlist(product.id)}
            />
          </Col>
        ))}
      </Row>

      {/* No Results Message */}
      {filteredProducts.length === 0 && (
        <div className={`text-center py-5 ${theme === 'dark' ? 'text-light' : ''}`}>
          <i className="bi bi-search display-1"></i>
          <h3 className="mt-3">No products found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}
    </Container>
  );
};

export default Products;
