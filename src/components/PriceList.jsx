import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Search, Download, Upload, MoreHorizontal, Info, Loader2, GripVertical, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  alpha,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Chip,
  Popover,
  Grow,
  Pagination,
  useTheme
} from '@mui/material';

const CUSTOMERS = ['Independent', 'Otis', 'Kone', 'TKEI', 'Mitsubishi', 'Schindler'];

const COLUMNS = [
  "S.No",
  "Item Code",
  "Product",
  "Type",
  "Clear Opening",
  "Clear Height",
  "Door type",
  "Fire rated code",
  "Panel Type",
  "Frame Size",
  "Finish",
  "Grade",
  "Price"
];

const PINNED_COLUMNS = ["S.No", "Item Code", "Price"];

export const PriceList = () => {
  const theme = useTheme();
  const [selectedCustomer, setSelectedCustomer] = useState(CUSTOMERS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [versions, setVersions] = useState([]);
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const fileInputRef = useRef(null);
  const [expandedYears, setExpandedYears] = useState([]);
  const [expandedMonths, setExpandedMonths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(PINNED_COLUMNS);
  const [columnPickerAnchorEl, setColumnPickerAnchorEl] = useState(null);
  const [showColumnCount, setShowColumnCount] = useState(false);
  const columnCountTimerRef = useRef(null);
  const [priceHistoryAnchorEl, setPriceHistoryAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsOptions = [10, 25, 50, 75, 100];

  const handleColumnPickerClick = (event) => {
    setColumnPickerAnchorEl(event.currentTarget);
  };

  const handleColumnPickerClose = () => {
    setColumnPickerAnchorEl(null);
    setShowColumnCount(true);
    if (columnCountTimerRef.current) clearTimeout(columnCountTimerRef.current);
    columnCountTimerRef.current = setTimeout(() => {
      setShowColumnCount(false);
    }, 4000);
  };

  const isColumnPickerOpen = Boolean(columnPickerAnchorEl);

  const handlePriceHeaderClick = (event) => {
    setPriceHistoryAnchorEl(event.currentTarget);
  };

  const handlePriceHistoryClose = () => {
    setPriceHistoryAnchorEl(null);
  };

  const isPriceHistoryOpen = Boolean(priceHistoryAnchorEl);

  /**
   * HOW TO MAP AN API CALL TO THIS TABLE:
   * 
   * 1. Define your data interface (PriceItem) to match your API response.
   * 2. Use the useEffect hook to trigger the fetch whenever the customer changes.
   * 3. Map the API response fields to the PriceItem fields if they differ.
   */
  useEffect(() => {
    const fetchPricing = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // --- SIMULATED API CALL ---
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate latency

        const mockData = [
          { id: 1, code: "E.COM.700.2000.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "700mm", height: "2000mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 18500 },
          { id: 2, code: "E.COM.800.2000.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "800mm", height: "2000mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 19200 },
          { id: 3, code: "E.COM.900.2000.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "900mm", height: "2000mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 21000 },
          { id: 4, code: "E.COM.1000.2000.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "1000mm", height: "2000mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "120mm", finish: "Powder Coated", grade: "Grade A", price: 22500 },
          { id: 5, code: "E.COM.700.2000.L2T.E120.PF", product: "Telescopic Door", type: "Premium", opening: "700mm", height: "2000mm", doorType: "L2T", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade B+", price: 24000 },
          { id: 6, code: "E.COM.800.2000.L2T.E120.PF", product: "Telescopic Door", type: "Premium", opening: "800mm", height: "2000mm", doorType: "L2T", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade B+", price: 25500 },
          { id: 7, code: "E.COM.900.2000.L2T.E120.PF", product: "Telescopic Door", type: "Premium", opening: "900mm", height: "2000mm", doorType: "L2T", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade B+", price: 27000 },
          { id: 8, code: "E.COM.1000.2000.L2T.E120.PF", product: "Telescopic Door", type: "Premium", opening: "1000mm", height: "2000mm", doorType: "L2T", fireRating: "E120", panelType: "PF", frameSize: "120mm", finish: "Powder Coated", grade: "Grade B+", price: 29500 },
          { id: 9, code: "E.EA.FRM.700.2000.L2C.90.PF", product: "Fire Rated Frame", type: "Safety", opening: "700mm", height: "2000mm", doorType: "L2C", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 12000 },
          { id: 10, code: "E.EA.FRM.800.2000.L2C.90.PF", product: "Fire Rated Frame", type: "Safety", opening: "800mm", height: "2000mm", doorType: "L2C", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 13500 },
          { id: 11, code: "E.EA.FRM.900.2000.L2C.90.PF", product: "Fire Rated Frame", type: "Safety", opening: "900mm", height: "2000mm", doorType: "L2C", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 14800 },
          { id: 12, code: "E.EA.FRM.1000.2000.L2C.90.PF", product: "Fire Rated Frame", type: "Safety", opening: "1000mm", height: "2000mm", doorType: "L2C", fireRating: "90 Min", panelType: "PF", frameSize: "180mm", finish: "Zinc Primed", grade: "Industrial", price: 16200 },
          { id: 13, code: "E.EA.FRM.700.2000.L2T.90.PF", product: "Telescopic Frame", type: "Safety", opening: "700mm", height: "2000mm", doorType: "L2T", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 18500 },
          { id: 14, code: "E.EA.FRM.800.2000.L2T.90.PF", product: "Telescopic Frame", type: "Safety", opening: "800mm", height: "2000mm", doorType: "L2T", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 19800 },
          { id: 15, code: "E.EA.FRM.900.2000.L2T.90.PF", product: "Telescopic Frame", type: "Safety", opening: "900mm", height: "2000mm", doorType: "L2T", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 21500 },
          { id: 16, code: "E.EA.FRM.1000.2000.L2T.90.PF", product: "Telescopic Frame", type: "Safety", opening: "1000mm", height: "2000mm", doorType: "L2T", fireRating: "90 Min", panelType: "PF", frameSize: "180mm", finish: "Zinc Primed", grade: "Industrial", price: 23000 },
          { id: 17, code: "E.COM.700.2100.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "700mm", height: "2100mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 19500 },
          { id: 18, code: "E.COM.800.2100.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "800mm", height: "2100mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 20200 },
          { id: 19, code: "E.COM.900.2100.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "900mm", height: "2100mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 22000 },
          { id: 20, code: "E.COM.1000.2100.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "1000mm", height: "2100mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "120mm", finish: "Powder Coated", grade: "Grade A", price: 23500 }
        ];

        const mockItems = mockData.map(({ price, ...item }) => item);

        const mockVersions = [
          {
            id: 'v1',
            date: new Date(2026, 0, 10),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.92 }), {})
          },
          {
            id: 'v2',
            date: new Date(2026, 2, 14),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.95 }), {})
          },
          {
            id: 'v3',
            date: new Date(2026, 2, 25),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.98 }), {})
          },
          {
            id: 'v4',
            date: new Date(2026, 3, 1),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price }), {})
          },
          {
            id: 'v5',
            date: new Date(2026, 3, 20),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 1.05 }), {})
          },
          {
            id: 'v2025-1',
            date: new Date(2025, 11, 15),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.88 }), {})
          },
          {
            id: 'v2025-2',
            date: new Date(2025, 10, 22),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.85 }), {})
          },
          {
            id: 'v2025-3',
            date: new Date(2025, 9, 5),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.82 }), {})
          },
          {
            id: 'v2024-1',
            date: new Date(2024, 11, 1),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.75 }), {})
          }
        ].sort((a, b) => b.date.getTime() - a.date.getTime());

        setData(mockItems);
        setVersions(mockVersions);
        setSelectedVersionId(mockVersions[0].id);
      } catch (err) {
        setError('Failed to load pricing data. Please check your connection.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, [selectedCustomer]);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCustomer, rowsPerPage]);

  const selectedVersion = versions.find(v => v.id === selectedVersionId);

  const groupedVersions = useMemo(() => {
    return versions.reduce((acc, v) => {
      const year = v.date.getFullYear();
      const month = v.date.toLocaleString('default', { month: 'long' });
      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = [];
      acc[year][month].push(v);
      return acc;
    }, {});
  }, [versions]);

  const toggleYear = (year) => {
    setExpandedYears(prev => prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]);
  };

  const toggleMonth = (monthKey) => {
    setExpandedMonths(prev => prev.includes(monthKey) ? prev.filter(m => m !== monthKey) : [...prev, monthKey]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate file processing
    const newDate = new Date();
    const newPriceVersion = {
      id: `v-${Date.now()}`,
      date: newDate,
      prices: data.reduce((acc, item) => ({
        ...acc,
        [item.id]: (selectedVersion?.prices[item.id] || 0) * (1 + (Math.random() * 0.1 - 0.05))
      }), {})
    };

    setVersions(prev => [newPriceVersion, ...prev]);
    setSelectedVersionId(newPriceVersion.id);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Auto-expand latest on load
  useEffect(() => {
    if (versions.length > 0) {
      const latest = versions[0];
      setExpandedYears([latest.date.getFullYear()]);
      setExpandedMonths([`${latest.date.getFullYear()}-${latest.date.toLocaleString('default', { month: 'long' })}`]);
    }
  }, [versions.length]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4, animation: 'fadeIn 0.7s ease-in-out' }}>
      {/* Header Section */}
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }} justifyContent="space-between" spacing={3}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 300, color: 'text.primary', letterSpacing: '-0.02em' }}>
            Price Book
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: '100%', md: 'auto' } }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="customer-select-label">Customer</InputLabel>
            <Select
              labelId="customer-select-label"
              value={selectedCustomer}
              label="Customer"
              onChange={(e) => setSelectedCustomer(e.target.value)}
              sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
            >
              {CUSTOMERS.map(customer => (
                <MenuItem key={customer} value={customer}>{customer}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Search item code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: 'background.paper', borderRadius: 2, width: { xs: '100%', md: 260 } }}
          />

          {selectedCustomer === 'Independent' && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                style={{ display: 'none' }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<Upload size={14} />}
                onClick={() => fileInputRef.current?.click()}
                disableElevation
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  px: 2,
                  height: 40 // Match TextField height
                }}
              >
                Upload Price List
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      {/* Table Container */}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          minHeight: 400,
          position: 'relative',
          borderColor: 'divider',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 10px 40px -10px rgba(0,0,0,0.3)'
            : '0 10px 40px -10px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ px: 4, py: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: alpha(theme.palette.background.default, 0.5) }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Products
            </Typography>
            {!isLoading && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                  {filteredData.length > 0 ? `${(page - 1) * rowsPerPage + 1} to ${Math.min(page * rowsPerPage, filteredData.length)} of ${filteredData.length}` : '0 of 0'}
                </Typography>
                <Chip
                  label={`${filteredData.length} Results`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.625rem', fontWeight: 700, color: 'text.secondary' }}
                />
              </Stack>
            )}
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AnimatePresence>
                {showColumnCount && (
                  <Chip
                    component={motion.div}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    label={`${visibleColumns.length} columns selected`}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      border: '1px solid'
                    }}
                  />
                )}
              </AnimatePresence>

              <IconButton
                size="small"
                onClick={handleColumnPickerClick}
                sx={{
                  border: '1px solid',
                  borderColor: isColumnPickerOpen ? 'primary.main' : 'divider',
                  color: isColumnPickerOpen ? 'primary.main' : 'text.secondary',
                  borderRadius: 2,
                  bgcolor: isColumnPickerOpen ? alpha('#0d9488', 0.05) : 'transparent',
                  '&:hover': { bgcolor: alpha('#0d9488', 0.05) }
                }}
              >
                <SlidersHorizontal size={18} />
              </IconButton>

              <Popover
                open={isColumnPickerOpen}
                anchorEl={columnPickerAnchorEl}
                onClose={handleColumnPickerClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    width: 220,
                    p: 1,
                    borderRadius: 2,
                    boxShadow: 10
                  }
                }}
              >
                <Box sx={{ px: 1.5, py: 1, borderBottom: '1px solid', borderColor: 'grey.50', mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Toggle Columns
                  </Typography>
                </Box>
                <Stack spacing={0.5}>
                  {COLUMNS.filter(col => !PINNED_COLUMNS.includes(col)).map(col => {
                    const isVisible = visibleColumns.includes(col);
                    return (
                      <Button
                        key={col}
                        onClick={() => {
                          setVisibleColumns(prev =>
                            isVisible ? prev.filter(c => c !== col) : [...prev, col]
                          );
                        }}
                        fullWidth
                        sx={{
                          justifyContent: 'space-between',
                          textTransform: 'none',
                          px: 1.5,
                          py: 1,
                          fontSize: '0.75rem',
                          color: isVisible ? 'text.primary' : 'text.secondary',
                          bgcolor: isVisible ? 'grey.50' : 'transparent',
                          '&:hover': { bgcolor: 'grey.50' }
                        }}
                      >
                        {col}
                        <Box sx={{
                          width: 14,
                          height: 14,
                          border: '1px solid',
                          borderColor: isVisible ? 'primary.main' : 'divider',
                          borderRadius: 0.5,
                          bgcolor: isVisible ? 'primary.main' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isVisible && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'white' }} />}
                        </Box>
                      </Button>
                    );
                  })}
                </Stack>
              </Popover>
            </Box>

            <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Download size={16} />
            </IconButton>
          </Stack>
        </Box>

        {isLoading ? (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', zIndex: 10 }}>
            <CircularProgress size={32} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">Fetching latest pricing...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ py: 12, textAlign: 'center' }}>
            <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>{error}</Typography>
            <Button variant="text" size="small" onClick={() => window.location.reload()} sx={{ mt: 2, textTransform: 'none', color: 'text.primary', textDecoration: 'underline' }}>
              Retry Connection
            </Button>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <AnimatePresence mode="popLayout">
                    {[...visibleColumns.filter(c => c !== 'Price'), 'Price'].map(col => {
                      const isPrice = col === 'Price';
                      return (
                        <TableCell
                          key={col}
                          component={motion.th}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          sx={{
                            bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#f8fafc',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: isPrice ? 'primary.main' : 'text.disabled',
                            py: 2,
                            px: 3,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            cursor: isPrice ? 'pointer' : 'default',
                            whiteSpace: 'nowrap',
                            minWidth: isPrice ? 120 : 'auto',
                            textAlign: isPrice ? 'right' : 'left',
                            '&:hover': isPrice ? { bgcolor: alpha(theme.palette.primary.main, 0.05) } : {}
                          }}
                          onClick={isPrice ? handlePriceHeaderClick : undefined}
                        >
                          <Stack direction="row" alignItems="center" justifyContent={isPrice ? 'flex-end' : 'flex-start'} spacing={1}>
                            {col}
                            {isPrice && <ChevronDown size={14} style={{ transform: isPriceHistoryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
                          </Stack>
                        </TableCell>
                      );
                    })}
                  </AnimatePresence>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: alpha(theme.palette.background.default, 0.8) },
                      '& td': { py: 2, px: 3, borderBottom: '1px solid', borderColor: 'divider' }
                    }}
                  >
                    <AnimatePresence mode="popLayout">
                      {[...visibleColumns.filter(c => c !== 'Price'), 'Price'].map(col => {
                        let content;
                        const serialNumber = (page - 1) * rowsPerPage + index + 1;
                        switch (col) {
                          case 'S.No': content = serialNumber; break;
                          case 'Item Code':
                            content = (
                              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                {item.code}
                              </Typography>
                            );
                            break;
                          case 'Price':
                            content = (
                              <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                ₹ {selectedVersion?.prices[item.id]?.toLocaleString() || 'N/A'}
                              </Typography>
                            );
                            break;
                          default:
                            const key = col.toLowerCase().replace(/ /g, '');
                            const itemKey = {
                              'product': 'product',
                              'type': 'type',
                              'clearopening': 'opening',
                              'clearheight': 'height',
                              'doortype': 'doorType',
                              'fireratedcode': 'fireRating',
                              'paneltype': 'panelType',
                              'framesize': 'frameSize',
                              'finish': 'finish',
                              'grade': 'grade'
                            }[key];
                            content = (
                              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', fontSize: '0.75rem' }}>
                                {item[itemKey] || '-'}
                              </Typography>
                            );
                        }
                        return (
                          <TableCell
                            key={col}
                            component={motion.td}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            sx={{
                              whiteSpace: 'nowrap',
                              minWidth: col === 'Price' ? 120 : 'auto',
                              textAlign: col === 'Price' ? 'right' : 'left'
                            }}
                          >
                            {content}
                          </TableCell>
                        );
                      })}
                    </AnimatePresence>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination Footer */}
        {!isLoading && filteredData.length > 0 && (
          <Box sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: alpha(theme.palette.background.default, 0.5),
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2
          }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Rows per page:
              </Typography>
              <Select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(e.target.value); setPage(1); }}
                size="small"
                variant="standard"
                disableUnderline
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  '& .MuiSelect-select': { py: 0.5, px: 1, color: 'primary.main' }
                }}
              >
                {rowsOptions.map(opt => (
                  <MenuItem key={opt} value={opt} sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </Stack>

            <Pagination
              count={Math.ceil(filteredData.length / rowsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              size="small"
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  borderRadius: 1.5
                }
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Price History Dropdown (Popover Replacement) */}
      <Popover
        open={isPriceHistoryOpen}
        anchorEl={priceHistoryAnchorEl}
        onClose={handlePriceHistoryClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 320,
            maxHeight: 480,
            borderRadius: 3,
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'grey.100', bgcolor: '#f8fafc' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Version History</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{selectedCustomer} Revisions</Typography>
        </Box>

        <Box sx={{ p: 1, overflow: 'auto', maxHeight: 380 }}>
          <Stack spacing={0.5}>
            {Object.entries(groupedVersions).sort((a, b) => Number(b[0]) - Number(a[0])).map(([year, months]) => (
              <Box key={year} sx={{ mb: 0.5 }}>
                <Button
                  fullWidth
                  size="small"
                  onClick={() => toggleYear(Number(year))}
                  endIcon={<ChevronDown size={14} style={{ transform: expandedYears.includes(Number(year)) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
                  sx={{
                    justifyContent: 'space-between',
                    px: 1.5,
                    py: 1,
                    color: 'text.primary',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    '&:hover': { bgcolor: 'grey.50' }
                  }}
                >
                  {year}
                </Button>
                <AnimatePresence>
                  {expandedYears.includes(Number(year)) && (
                    <Box component={motion.div} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} sx={{ overflow: 'hidden', ml: 1 }}>
                      {Object.entries(months).sort((a, b) => {
                        const monthsOrder = ['December', 'November', 'October', 'September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January'];
                        return monthsOrder.indexOf(a[0]) - monthsOrder.indexOf(b[0]);
                      }).map(([month, monthVersions]) => {
                        const monthKey = `${year}-${month}`;
                        return (
                          <Box key={month}>
                            <Button
                              fullWidth
                              size="small"
                              onClick={() => toggleMonth(monthKey)}
                              endIcon={<ChevronDown size={12} style={{ transform: expandedMonths.includes(monthKey) ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
                              sx={{
                                justifyContent: 'space-between',
                                px: 1.5,
                                py: 0.5,
                                color: 'text.secondary',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                '&:hover': { bgcolor: 'transparent', color: 'text.primary' }
                              }}
                            >
                              {month}
                            </Button>
                            <AnimatePresence>
                              {expandedMonths.includes(monthKey) && (
                                <Stack component={motion.div} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} sx={{ overflow: 'hidden', ml: 1.5, mb: 1 }}>
                                  {monthVersions.map((v) => (
                                    <Button
                                      key={v.id}
                                      fullWidth
                                      size="small"
                                      onClick={() => {
                                        setSelectedVersionId(v.id);
                                        handlePriceHistoryClose();
                                      }}
                                      sx={{
                                        justifyContent: 'flex-start',
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 1,
                                        bgcolor: selectedVersionId === v.id ? alpha('#0d9488', 0.1) : 'transparent',
                                        color: selectedVersionId === v.id ? '#0d9488' : 'text.primary',
                                        '&:hover': { bgcolor: alpha('#0d9488', 0.05) },
                                        textAlign: 'left'
                                      }}
                                    >
                                      <Box>
                                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 800 }}>
                                          {v.id.toUpperCase()}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: '0.6rem', opacity: 0.7 }}>
                                          {v.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </Typography>
                                      </Box>
                                    </Button>
                                  ))}
                                </Stack>
                              )}
                            </AnimatePresence>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </AnimatePresence>
              </Box>
            ))}
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
};
