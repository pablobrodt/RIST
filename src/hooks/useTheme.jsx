import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultTheme from '../theme/defaultTheme.json';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('rist_theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mergedTheme = { ...defaultTheme };
        Object.keys(parsed).forEach(section => {
          if (mergedTheme[section]) {
            mergedTheme[section] = { ...mergedTheme[section], ...parsed[section] };
          }
        });
        return mergedTheme;
      } catch (e) {
        console.error("Failed to parse theme from localStorage");
      }
    }
    return defaultTheme;
  });

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('rist_theme', JSON.stringify(newTheme));
  };

  // Sync state between tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'rist_theme' && e.newValue) {
         setTheme(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Inject CSS Variables dynamically
  useEffect(() => {
    const root = document.documentElement;
    // Iterate over sections
    Object.keys(theme).forEach((section) => {
      Object.keys(theme[section]).forEach((key) => {
        // e.g. --color-setup-bg
        root.style.setProperty(`--color-${section}-${key}`, theme[section][key]);
      });
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, defaultTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
