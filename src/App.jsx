import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Triangle } from 'lucide-react';
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
  alpha
} from '@mui/material';

export default function App() {
  const [activeTab, setActiveTab] = useState('BOM Comparison');
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      {/* Navigation Bar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ w: 32, h: 32, bgcolor: '#0f172a', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyCenter: 'center', p: 0.5 }}>
              <Triangle size={20} color="white" fill="white" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', tracking: '-0.02em', display: { xs: 'none', sm: 'block' } }}>
              WITTUR
            </Typography>
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
            <IconButton sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
              <User size={18} color="#475569" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1, py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl" disableGutters>
          {activeTab !== 'Price Book' && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: '#0f172a', tracking: '-0.02em' }}>
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
  );
}
