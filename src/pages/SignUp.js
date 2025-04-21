import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Card } from 'react-bootstrap';

function SignUp({ theme }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});

    // Validate fields
    let newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Please fill out this field';
    }

    if (!formData.email) {
      newErrors.email = 'Please fill out this field';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Please fill out this field';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length === 0) {
      // Handle signup logic here
      console.log('Sign up attempt with:', formData);
    } else {
      setErrors(newErrors);
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
                <i className="bi bi-person-plus-fill fs-2 text-white"></i>
              </div>
              <h2 className="mb-0">Create Account</h2>
              <p className={`mt-2 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                Join us today
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  placeholder="Enter your full name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  placeholder="Enter your email"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  placeholder="Create a password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  placeholder="Confirm your password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3"
                size="lg"
              >
                Sign Up
              </Button>

              <div className="text-center">
                <span className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                  Already have an account?{' '}
                </span>
                <Link 
                  to="/login" 
                  className="text-decoration-none"
                >
                  Sign In
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default SignUp; 