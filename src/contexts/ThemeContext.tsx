import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Theme Context Implementation
 *
 * Provides a centralized theme management system for the entire application.
 * Features:
 * - Light/dark theme switching
 * - Persistent theme storage using localStorage
 * - Automatic DOM class application for CSS styling
 * - Type-safe theme context with proper error boundaries
 */

/** Available theme options */
type Theme = 'light' | 'dark';

/** Type definition for the theme context value */
interface ThemeContextType {
  /** Current active theme */
  theme: Theme;
  /** Function to toggle between light and dark themes */
  toggleTheme: () => void;
}

/** React context for theme state management */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider Component
 *
 * Provides theme context to the entire application tree.
 * Handles theme persistence, DOM updates, and state management.
 *
 * @param children - React components that will have access to theme context
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme state with lazy initialization to read from localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    // Attempt to restore saved theme from localStorage
    const saved = localStorage.getItem('theme');
    // Default to 'light' theme if no saved preference exists
    return (saved as Theme) || 'light';
  });

  /**
   * Effect to handle theme persistence and DOM updates.
   * Runs whenever the theme changes to:
   * 1. Save the new theme to localStorage for persistence across sessions
   * 2. Apply the theme class to document.documentElement for CSS styling
   */
  useEffect(() => {
    // Persist theme preference to localStorage
    localStorage.setItem('theme', theme);
    // Apply theme class to HTML element for CSS selectors (e.g., .dark .some-class)
    document.documentElement.className = theme;
  }, [theme]);

  /**
   * Toggle function to switch between light and dark themes.
   * Uses functional state update to ensure correct state transitions.
   */
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Provide theme state and toggle function to child components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 *
 * Custom hook to access theme context from any component within the theme provider.
 * Provides type-safe access to current theme and toggle functionality.
 *
 * @returns Theme context containing current theme and toggle function
 * @throws Error if used outside of ThemeProvider component tree
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme } = useTheme();
 *
 *   return (
 *     <button onClick={toggleTheme}>
 *       Current theme: {theme}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme() {
  // Get theme context value
  const context = useContext(ThemeContext);

  // Ensure hook is used within ThemeProvider
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}