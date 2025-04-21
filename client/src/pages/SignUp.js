import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function Signup({ theme }) {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setUsernameError('');
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setError('');

    // Validate fields
    let isValid = true;

    if (!username.trim()) {
      setUsernameError('Please enter a username');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      isValid = false;
    }

    if (!name.trim()) {
      setNameError('Please enter your name');
      isValid = false;
    }

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
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    if (isValid) {
      try {
        setLoading(true);
        const result = await signup(name, email, password, username);
        if (result.success) {
          navigate('/'); // Redirect to home page after successful signup
        } else {
          setError(result.error || 'Failed to create an account');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`min-vh-100 d-flex align-items-center py-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
      <Container className="py-5">
        <Card 
          className={`mx-auto shadow-lg ${theme === 'dark' ? 'bg-dark text-light border-secondary' : 'bg-white'}`}
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
              <h2 className="mb-0">Create Account</h2>
              <p className={`mt-2 ${theme === 'dark' ? 'text-light' : 'text-muted'}`}>
                Join us today!
              </p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isInvalid={!!usernameError}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  placeholder="Choose a username"
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {usernameError}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={!!nameError}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {nameError}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!emailError}
                  className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
                  placeholder="Enter your email"
                  disabled={loading}
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
                  placeholder="Create a password"
                  disabled={loading}
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
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center">
                <span className={theme === 'dark' ? 'text-light' : 'text-muted'}>
                  Already have an account?{' '}
                </span>
                <Link 
                  to="/login" 
                  className="text-decoration-none"
                >
                  Log in
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Signup;
