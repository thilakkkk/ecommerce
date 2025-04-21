import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'registered_users';

// Initialize with empty users array
const initializeUsers = () => {
  try {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    return savedUsers ? JSON.parse(savedUsers) : [];
  } catch (error) {
    console.error('Error loading users data:', error);
    return [];
  }
};

// Helper function to safely store data to localStorage
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

// Helper function to prune user data to minimize storage size
const pruneUserData = (userData) => {
  if (!userData) return null;
  
  // Only keep essential fields
  const essentialData = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    username: userData.username,
    profileImage: userData.profileImage,
    bio: userData.bio
  };
  
  // Remove any undefined or null values to minimize size
  return Object.fromEntries(
    Object.entries(essentialData).filter(([_, v]) => v != null)
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  });

  const [users, setUsers] = useState(() => initializeUsers());

  // Save user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      // Prune user data before storing
      const prunedUserData = pruneUserData(user);
      safeSetItem('currentUser', JSON.stringify(prunedUserData));
    } else {
      try {
        localStorage.removeItem('currentUser');
      } catch (error) {
        console.error('Error removing currentUser:', error);
      }
    }
  }, [user]);

  // Save users data when it changes
  useEffect(() => {
    if (users.length > 0) {
      // Prune each user's data before storing the entire array
      const prunedUsers = users.map(u => pruneUserData(u));
      safeSetItem(USERS_STORAGE_KEY, JSON.stringify(prunedUsers));
    }
  }, [users]);

  const updateProfile = async (updatedUserData) => {
    try {
      // Prune the updated user data
      const prunedUserData = pruneUserData(updatedUserData);
      
      // Update the users array with pruned user data
      const updatedUsers = users.map(u => 
        u.id === prunedUserData.id ? { 
          ...u, 
          ...prunedUserData
        } : u
      );
      setUsers(updatedUsers);

      // Update the current user
      setUser(prunedUserData);

      return { success: true, user: prunedUserData };
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  };

  const signup = async (name, email, password, username) => {
    // Check if email or username already exists
    if (users.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    if (users.some(u => u.username === username)) {
      throw new Error('Username already taken');
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      username,
      password,
      profileImage: 'https://via.placeholder.com/150' // Default profile image
    };

    setUsers(prev => [...prev, newUser]);

    // Log in the new user (without password)
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  const login = (userInput, password) => {
    // Trim the input values
    const trimmedInput = userInput.trim();
    const trimmedPassword = password.trim();

    // Check if input is empty
    if (!trimmedInput || !trimmedPassword) {
      throw new Error('Please fill in all fields');
    }

    // Find user and convert to lowercase for case-insensitive comparison
    const foundUser = users.find(
      u => (u.username.toLowerCase() === trimmedInput.toLowerCase() || 
            u.email.toLowerCase() === trimmedInput.toLowerCase()) && 
            u.password === trimmedPassword
    );

    if (!foundUser) {
      throw new Error('Invalid username/email or password');
    }

    // Create safe user object without password
    const { password: _, ...safeUser } = foundUser;
    const prunedUser = pruneUserData(safeUser);
    setUser(prunedUser);
    
    return prunedUser;
  };

  const logout = () => {
    // Clear the current user
    setUser(null);
    try {
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error removing currentUser during logout:', error);
    }
  };

  const value = {
    user,
    users,
    signup,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;