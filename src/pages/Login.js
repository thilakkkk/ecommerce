import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Card } from 'react-bootstrap';

function Login({ theme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validate fields
    let isValid = true;

    if (!email) {
      setEmailError('Please fill out this field');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Please fill out this field');
      isValid = false;
    }

    if (isValid) {
      // Handle login logic here
      console.log('Login attempt with:', { email, password });
    }
  };

  return (
    <div className={`min-vh-100 d-flex align-items-center py-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
      <Container className="py-5">
        <Card 
          className={`mx-auto shadow-lg ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`}
          style={{ maxWidth: '450px' }}
        >
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <div 
                className={`mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle ${theme === 'dark' ? 'bg-primary' : 'bg-primary'}`}
                style={{ width: '60px', height: '60px' }}
              >
                <i className="bi bi-person-fill fs-2 text-white"></i>
              </div>
              <h2 className="mb-0">Welcome Back</h2>
              <p className={`mt-2 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                Sign in to continue
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!emailError}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  placeholder="Enter your email"
                />
                <Form.Control.Feedback type="invalid">
                  {emailError}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!passwordError}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  placeholder="Enter your password"
                />
                <Form.Control.Feedback type="invalid">
                  {passwordError}
                </Form.Control.Feedback>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                size="lg"
              >
                Sign In
              </Button>

              <div className="text-center">
                <span className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                  Don't have an account?{' '}
                </span>
                <Link 
                  to="/signup" 
                  className="text-decoration-none"
                >
                  Create Account
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Login; 