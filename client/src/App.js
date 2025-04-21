import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ChatProvider } from './context/ChatContext';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Chat from './pages/Chat';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import CategoryPage from './pages/CategoryPage';
import NotFound from './pages/NotFound';

// Import components
import Navbar from './components/Navbar';

const AppContent = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Update cart count when localStorage changes
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };

    // Initial count
    updateCartCount();

    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Apply theme to body
  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#e6f3ff';
    document.body.style.color = theme === 'dark' ? '#ffffff' : '#000000';
  }, [theme]);

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: theme === 'dark' ? '#1a1a1a' : '#e6f3ff',
    color: theme === 'dark' ? '#ffffff' : '#000000',
  };

  const mainStyle = {
    padding: '20px',
  };

  return (
    <div className={`app ${theme}`} style={containerStyle}>
      <Navbar 
        theme={theme} 
        onThemeChange={handleThemeChange}
        cartCount={cartCount}
      />
      <main style={mainStyle}>
        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/signup" element={<SignUp theme={theme} />} />
          <Route path="/products" element={<Products theme={theme} />} />
          <Route path="/product/:productId" element={<ProductDetail theme={theme} />} />
          <Route path="/cart" element={<Cart theme={theme} />} />
          <Route path="/chat" element={<Chat theme={theme} />} />
          <Route path="/wishlist" element={<Wishlist theme={theme} />} />
          <Route path="/profile" element={<Profile theme={theme} />} />
          <Route path="/edit-profile" element={<EditProfile theme={theme} />} />
          <Route path="/category/:category" element={<CategoryPage theme={theme} />} />
          <Route path="*" element={<NotFound theme={theme} />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ChatProvider>
              <AppContent />
            </ChatProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
