import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = (mode) => {
    setTheme(mode);
    document.body.style.backgroundColor = mode === 'dark' ? '#121212' : '#fff';
    document.body.style.color = mode === 'dark' ? '#fff' : '#000';
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
