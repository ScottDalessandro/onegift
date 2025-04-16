export const theme = {
  colors: {
    primary: '#1eb8b8', // teal
    secondary: '#3498db', // blue
    accent: '#a370f7', // purple
    tertiary: '#f39c12', // orange
    quaternary: '#e74c3c', // red
    white: '#ffffff',
    black: '#000000',
    gray: {
      100: '#f9f7fe',
      200: '#f1f1f1', 
      300: '#e2e2e2',
      400: '#d4d4d4',
      500: '#a0a0a0',
      600: '#717171',
      700: '#4a4a4a',
      800: '#2d2d2d',
      900: '#1a1a1a',
    }
  },
  gradients: {
    rainbow: 'linear-gradient(to right, #1eb8b8, #3498db, #a370f7, #f39c12, #e74c3c)',
    primary: 'linear-gradient(to right, #1eb8b8, #3498db)'
  },
  utils: {
    withOpacity: (color: string, opacity: number) => {
      // Convert hex to rgba
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }
} as const;

// Type-safe theme access
export type Theme = typeof theme;
export type ThemeColors = keyof typeof theme.colors;
export type ThemeGradients = keyof typeof theme.gradients; 