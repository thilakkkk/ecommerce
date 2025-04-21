import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = ({ theme }) => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className={`p-4 rounded ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
            <h1 className="display-1 mb-4">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead mb-4">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <Button
              as={Link}
              to="/"
              variant={theme === 'dark' ? 'outline-light' : 'primary'}
              size="lg"
              className="px-4"
            >
              Go Back Home
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound; 