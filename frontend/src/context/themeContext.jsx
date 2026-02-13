import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 1. Force Default to FALSE (Light Mode)
  // We commented out localStorage reading to fix your "It's all black" issue.
  const [isDark, setIsDark] = useState(() => {
    // const saved = localStorage.getItem("theme");
    // return saved === "dark"; 
    return false; // <--- FORCE LIGHT MODE DEFAULT
  });

  // 2. Apply class to HTML tag (Required for Tailwind 'class' mode)
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);