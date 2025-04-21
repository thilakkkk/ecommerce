import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Update localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    if (!user) {
      throw new Error('Please log in to add items to your wishlist');
    }

    setWishlistItems(prev => {
      // Check if product already exists
      if (prev.some(item => item.id === product.id)) {
        return prev;
      }

      // Create a new product object with all required fields
      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description || '',
        category: product.category || ''
      };

      // Add new product to wishlist
      const updatedWishlist = [...prev, newProduct];
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      return updatedWishlist;
    });
  };

  const removeFromWishlist = (productId) => {
    if (!user) {
      throw new Error('Please log in to manage your wishlist');
    }

    setWishlistItems(prev => {
      const updatedWishlist = prev.filter(item => item.id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.setItem('wishlist', JSON.stringify([]));
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext; 