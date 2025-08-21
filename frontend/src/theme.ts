import { createTheme, ThemeOptions } from '@mui/material/styles';

// Logo-inspired color palette
const colors = {
  primary: {
    main: '#E91E63', // Vibrant pink from logo
    light: '#F48FB1',
    dark: '#AD1457',
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#2196F3', // Blue from logo
    light: '#64B5F6',
    dark: '#1565C0',
    contrastText: '#FFFFFF'
  },
  accent: {
    orange: '#FF9800',
    green: '#4CAF50',
    purple: '#9C27B0',
    teal: '#009688'
  }
};

// Light theme configuration
const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#212121',
      secondary: '#757575'
    },
    divider: '#E0E0E0',
    success: {
      main: colors.accent.green,
      light: '#81C784',
      dark: '#388E3C'
    },
    warning: {
      main: colors.accent.orange,
      light: '#FFB74D',
      dark: '#F57C00'
    },
    error: {
      main: '#F44336',
      light: '#EF5350',
      dark: '#D32F2F'
    },
    info: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem'
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem'
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.secondary.main} 100%)`,
          boxShadow: '0 4px 20px rgba(233, 30, 99, 0.3)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(233, 30, 99, 0.15)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600
        },
        contained: {
          boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(233, 30, 99, 0.4)'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
  }
};

// Dark theme configuration
const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#F48FB1', // Lighter pink for dark mode
      light: '#FCE4EC',
      dark: '#E91E63',
      contrastText: '#000000'
    },
    secondary: {
      main: '#64B5F6', // Lighter blue for dark mode
      light: '#BBDEFB',
      dark: '#2196F3',
      contrastText: '#000000'
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0'
    },
    divider: '#333333',
    success: {
      main: '#66BB6A',
      light: '#81C784',
      dark: '#4CAF50'
    },
    warning: {
      main: '#FFB74D',
      light: '#FFCC02',
      dark: '#FF9800'
    },
    error: {
      main: '#EF5350',
      light: '#FFCDD2',
      dark: '#F44336'
    },
    info: {
      main: '#64B5F6',
      light: '#BBDEFB',
      dark: '#2196F3'
    }
  },
  typography: lightThemeOptions.typography,
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.secondary.dark} 100%)`,
          boxShadow: '0 4px 20px rgba(244, 143, 177, 0.3)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#1E1E1E',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(244, 143, 177, 0.2)',
            transform: 'translateY(-2px)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600
        },
        contained: {
          boxShadow: '0 4px 12px rgba(244, 143, 177, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(244, 143, 177, 0.4)'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E'
        }
      }
    }
  }
};

export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);

// Theme context types
export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: typeof lightTheme;
}

// Department colors for consistency
export const departmentColors = {
  roto: colors.accent.orange,
  paint: colors.accent.green,
  comp: colors.primary.main,
  matchmove: colors.secondary.main,
  lighting: colors.accent.purple,
  fx: colors.accent.teal,
  animation: '#FF5722',
  modeling: '#795548'
};

// Status colors
export const statusColors = {
  todo: '#9E9E9E',
  in_progress: colors.secondary.main,
  review: colors.accent.orange,
  approved: colors.accent.green,
  retake: '#F44336',
  final: colors.accent.purple
};

// Priority colors
export const priorityColors = {
  low: colors.accent.green,
  medium: colors.accent.orange,
  high: '#F44336',
  urgent: colors.primary.main
};