import React from 'react';
import { Modal, Card, Button } from 'react-bootstrap';

const ShareProduct = ({ show, onHide, products, onShareProduct, theme }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}>
        <Modal.Title>Share a Product</Modal.Title>
        <Button variant="link" className="text-decoration-none" onClick={onHide}>
          <i className="bi bi-x-lg"></i>
        </Button>
      </Modal.Header>
      <Modal.Body className={theme === 'dark' ? 'bg-dark text-light' : ''}>
        <div className="row g-3">
          {products.map((product) => (
            <div key={product.id} className="col-md-4">
              <Card className={`h-100 ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}>
                <Card.Img variant="top" src={product.image} alt={product.name} />
                <Card.Body>
                  <Card.Title className="h6">{product.name}</Card.Title>
                  <Card.Text className="text-primary fw-bold">${product.price}</Card.Text>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="w-100"
                    onClick={() => {
                      onShareProduct(product);
                      onHide();
                    }}
                  >
                    <i className="bi bi-share me-2"></i>
                    Share
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShareProduct; 