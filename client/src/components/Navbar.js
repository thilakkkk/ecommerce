// ✅ src/components/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown, NavDropdown, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, onThemeChange, cartCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navbarStyle = {
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#90caf9',
    borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#64b5f6'}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const linkStyle = {
    color: theme === 'dark' ? '#fff !important' : '#2c3e50 !important',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    display: 'block',
    fontWeight: '500',
  };

  const brandStyle = {
    ...linkStyle,
    fontSize: '24px',
    fontWeight: 'bold',
  };

  const themeSelectStyle = {
    padding: '5px',
    borderRadius: '4px',
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#333',
    border: `1px solid ${theme === 'dark' ? '#555' : '#ccc'}`,
    marginLeft: '10px',
  };

  return (
    <BootstrapNavbar 
      expand="lg" 
      style={navbarStyle}
      className={`${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}
      sticky="top"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" style={brandStyle}>
          MyShop
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle 
          aria-controls="basic-navbar-nav"
          style={{
            borderColor: theme === 'dark' ? '#555' : '#64b5f6',
          }}
        />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={linkStyle} active={location.pathname === '/'}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" style={linkStyle} active={location.pathname === '/products'}>
              Products
            </Nav.Link>
            
            {/* Categories Dropdown */}
            <NavDropdown 
              title="Categories" 
              id="basic-nav-dropdown"
              className={theme === 'dark' ? 'dropdown-dark' : ''}
            >
              <NavDropdown.Item as={Link} to="/category/dresses">
                <i className="bi bi-bag me-2"></i>
                Dresses
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/electronics">
                <i className="bi bi-laptop me-2"></i>
                Electronics
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/category/shoes">
                <i className="bi bi-boot me-2"></i>
                Shoes
              </NavDropdown.Item>
            </NavDropdown>

            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/chat" style={linkStyle} active={location.pathname === '/chat'}>
                  Chat
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="d-flex align-items-center gap-3">
            {/* Wishlist Icon - Removed count notification */}
            <Nav.Link 
              as={Link} 
              to="/wishlist" 
              className="position-relative me-3"
              style={linkStyle}
              active={location.pathname === '/wishlist'}
            >
              <i className="bi bi-heart fs-5"></i>
            </Nav.Link>
            
            {/* Cart Icon */}
            <Nav.Link 
              as={Link} 
              to="/cart" 
              className="position-relative me-3"
              style={linkStyle}
              active={location.pathname === '/cart'}
            >
              <i className="bi bi-cart fs-5"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </Nav.Link>

            {/* Theme Toggle */}
            <Button
              variant="link"
              className={`p-0 border-0 ${theme === 'dark' ? 'text-light' : 'text-dark'} me-3`}
              onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            >
              <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'} fs-5`}></i>
            </Button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <img
                    src={user?.profileImage || 'https://via.placeholder.com/32'}
                    alt="Profile"
                    className="rounded-circle"
                    width="32"
                    height="32"
                    style={{ objectFit: 'cover' }}
                  />
                }
                id="user-dropdown"
                align="end"
                className={theme === 'dark' ? 'dropdown-dark' : ''}
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="bi bi-person me-2"></i>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/edit-profile">
                  <i className="bi bi-pencil me-2"></i>
                  Edit Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/wishlist">
                  <i className="bi bi-heart me-2"></i>
                  Wishlist
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">
                  <i className="bi bi-box me-2"></i>
                  Orders
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button 
                  variant={theme === 'dark' ? 'outline-light' : 'outline-primary'}
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;