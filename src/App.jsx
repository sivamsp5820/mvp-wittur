import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Triangle, Moon, Sun, Settings } from 'lucide-react';
import { FileUploadCard } from './components/FileUploadCard';
import { ResultsSection } from './components/ResultsSection';
import { PriceList } from './components/PriceList';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Tabs,
  Tab as MuiTab,
  IconButton,
  Avatar,
  Paper,
  Grid,
  CircularProgress,
  alpha,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';

import logo from './images/Logo.png';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('BOM Comparison');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#0d9488', // Teal 600
      },
      background: {
        default: darkMode ? '#0f172a' : '#f8fafc',
        paper: darkMode ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#f8fafc' : '#0f172a',
        secondary: darkMode ? '#94a3b8' : '#475569',
      },
      divider: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: '"Poppins", sans-serif',
      h1: { fontWeight: 600 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 800 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: darkMode
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
              : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            color: darkMode ? '#f8fafc' : '#0f172a',
          }
        }
      }
    },
  });
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleCompare = () => {
    if (!file1 || !file2) return;
    setIsComparing(true);
    // Simulate comparison delay
    setTimeout(() => {
      setIsComparing(false);
      setShowResults(true);
    }, 1500);
  };

  const isReadyToCompare = file1 !== null && file2 !== null;

  const renderContent = () => {
    switch (activeTab) {
      case 'BOM Comparison':
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Upload Section */}
            <Grid container spacing={4} sx={{ maxWidth: 1000, mx: 'auto', mt: 2 }}>
              <Grid item xs={12} md={6}>
                <FileUploadCard
                  title="Upload BOM 1 Excel"
                  subtitle="COR CD 02C 700x20 FVP"
                  onFileSelect={setFile1}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FileUploadCard
                  title="Upload BOM 2 Excel"
                  subtitle="COR CD 02C 700x20 FVP"
                  onFileSelect={setFile2}
                />
              </Grid>
            </Grid>

            {/* Compare Button */}
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleCompare}
                disabled={!isReadyToCompare || isComparing}
                startIcon={isComparing ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: 'none',
                  bgcolor: isReadyToCompare ? '#0d9488' : 'action.disabledBackground',
                  '&:hover': { bgcolor: '#0f766e', transform: 'scale(1.02)' },
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 20px rgba(13, 148, 136, 0.2)'
                }}
              >
                {isComparing ? 'Comparing...' : 'Compare'}
              </Button>
            </Box>

            {/* Results Section */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <ResultsSection />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      case 'Price Book':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PriceList />
          </motion.div>
        );
      default:
        return (
          <Box sx={{ py: 10, textAlign: 'center' }}>
            <Typography variant="h5" color="text.disabled" sx={{ fontWeight: 700 }}>
              Section Under Development
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              The {activeTab} module will be available soon.
            </Typography>
          </Box>
        );
    }
  };

  const tabs = ['Home', 'Configurator', 'Cost Simulator', 'BOM Comparison', 'Price Book'];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', transition: 'background-color 0.3s ease' }}>
        {/* Navigation Bar */}
        <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0.5 }}>
                <img src={logo} alt="Wittur Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </Box>
            </Box>

            <Tabs
              value={tabs.indexOf(activeTab)}
              onChange={(e, newValue) => setActiveTab(tabs[newValue])}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                height: '100%',
                '& .MuiTabs-indicator': { bgcolor: '#0d9488', height: 3 },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 2,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  '&.Mui-selected': { color: '#0d9488' },
                  '&:hover': { color: '#0d9488' }
                }
              }}
            >
              {tabs.map((item) => (
                <MuiTab key={item} label={item} />
              ))}
            </Tabs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                }}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </IconButton>
              <IconButton sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
                <Settings size={18} color={darkMode ? '#94a3b8' : '#475569'} />
              </IconButton>
              <IconButton sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
                <User size={18} color={darkMode ? '#94a3b8' : '#475569'} />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box component="main" sx={{ flex: 1, py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
          <Container maxWidth="xl" disableGutters>
            {activeTab !== 'Price Book' && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: 'text.primary', tracking: '-0.02em' }}>
                  BOM Comparison Tool
                </Typography>
              </Box>
            )}

            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
