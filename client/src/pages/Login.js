import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = ({ theme }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userInput, setUserInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(userInput, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className={`text-center mb-4 ${theme === 'dark' ? 'text-light' : ''}`}>Login</h2>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className={theme === 'dark' ? 'text-light' : ''}>
              Username or Email
            </Form.Label>
            <Form.Control
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter username or email"
              required
              disabled={loading}
              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className={theme === 'dark' ? 'text-light' : ''}>
              Password
            </Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
              className={theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </Form>

        <div className={`text-center mt-3 ${theme === 'dark' ? 'text-light' : ''}`}>
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className={theme === 'dark' ? 'text-info' : 'text-primary'}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Login;
