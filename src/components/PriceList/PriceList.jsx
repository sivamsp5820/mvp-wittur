import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronDown, Search, Download, Upload, MoreHorizontal, Plus, Info, Loader2, GripVertical, ChevronRight, SlidersHorizontal, X, Check } from 'lucide-react';
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
  useTheme,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Chip,
  Popover,
  Grow,
  Pagination,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';

import {
  CUSTOMERS,
  COLUMNS,
  PINNED_COLUMNS,
  MOCK_PRICING_DATA,
  MITSUBISHI_MATERIAL_INDEXES,
  MITSUBISHI_REFERENCE_INDEX,
  MITSUBISHI_DEFAULT_NEW_INDEX,
  OTIS_MATERIAL_INDEXES,
  OTIS_REFERENCE_INDEX,
  OTIS_DEFAULT_NEW_INDEX,
  getMockVersions
} from '../../data/mockPriceListData';
import MaterialIndexTable from './common/MaterialIndexTable';
import MaterialWeightsDialog from './common/MaterialWeightsDialog';
import PriceHistoryPopover from './common/PriceHistoryPopover';
import EItemPriceList from './common/EItemPriceList';
import AddColumnDialog from './common/AddColumnDialog';
import OtisMainTable from './otis/OtisMainTable';
import mitsubishiMainData from '../../data/mitsubishiMainData.json';
import otisMainData from '../../data/otisMainData.json';


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
  const [materialWeightsOpen, setMaterialWeightsOpen] = useState(false);
  const [posVarianceThreshold, setPosVarianceThreshold] = useState('0');
  const [negVarianceThreshold, setNegVarianceThreshold] = useState('0');
  const [viewType, setViewType] = useState('rm');

  // New states for Add Column Dialog
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);

  // Editable Index State
  const [newIndexDate, setNewIndexDate] = useState('2026-01-01');
  const [newIndexPrices, setNewIndexPrices] = useState(MITSUBISHI_DEFAULT_NEW_INDEX);

  // New Edit Mode States
  const [currentReferencePrices, setCurrentReferencePrices] = useState(MITSUBISHI_REFERENCE_INDEX);
  const [isEditingMaterialPrices, setIsEditingMaterialPrices] = useState(false);
  const [draftNewIndexPrices, setDraftNewIndexPrices] = useState([]);
  const [draftReferencePrices, setDraftReferencePrices] = useState([]);

  // Material Price History
  const [materialPriceHistory, setMaterialPriceHistory] = useState([
    { date: 'Purchase Price 2025', prices: MITSUBISHI_REFERENCE_INDEX }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // --- DYNAMIC COLUMNS ---
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [dynamicValues, setDynamicValues] = useState({});

  useEffect(() => {
    // Set default values based on customer
    const defaultPrices = selectedCustomer === 'Otis' ? OTIS_DEFAULT_NEW_INDEX : MITSUBISHI_DEFAULT_NEW_INDEX;
    const defaultRefs = selectedCustomer === 'Otis' ? OTIS_REFERENCE_INDEX : MITSUBISHI_REFERENCE_INDEX;
    setNewIndexPrices(defaultPrices);
    setCurrentReferencePrices(defaultRefs);
    setIsEditingMaterialPrices(false);

    // Initial history entry
    const initialLabel = selectedCustomer === 'Otis' ? 'Purchase price July 2025' : 'Purchase price Oct 2025';
    setMaterialPriceHistory([{ date: initialLabel, prices: defaultRefs }]);
    setHistoryIndex(0);

    if (selectedCustomer === 'Otis') {
      setPosVarianceThreshold('5');
      setNegVarianceThreshold('5');
    } else {
      setPosVarianceThreshold('0');
      setNegVarianceThreshold('0');
    }

    if (selectedCustomer === 'Mitsubishi' || selectedCustomer === 'Otis') {
      const savedCols = localStorage.getItem(`${selectedCustomer.toLowerCase()}_dynamic_columns`);
      const savedVals = localStorage.getItem(`${selectedCustomer.toLowerCase()}_dynamic_values`);
      setDynamicColumns(savedCols ? JSON.parse(savedCols) : []);
      setDynamicValues(savedVals ? JSON.parse(savedVals) : {});
    } else {
      setDynamicColumns([]);
      setDynamicValues({});
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedCustomer === 'Mitsubishi' || selectedCustomer === 'Otis') {
      localStorage.setItem(`${selectedCustomer.toLowerCase()}_dynamic_columns`, JSON.stringify(dynamicColumns));
    }
  }, [dynamicColumns, selectedCustomer]);

  useEffect(() => {
    if (selectedCustomer === 'Mitsubishi' || selectedCustomer === 'Otis') {
      localStorage.setItem(`${selectedCustomer.toLowerCase()}_dynamic_values`, JSON.stringify(dynamicValues));
    }
  }, [dynamicValues, selectedCustomer]);

  const handleAddColumnClick = () => {
    setIsAddColumnDialogOpen(true);
  };

  const submitNewColumns = (newCols) => {
    setDynamicColumns(prev => [...prev, ...newCols.map(c => ({ ...c, type: 'add' }))]);
  };

  const deleteColumn = useCallback((colId) => {
    if (confirm('Delete this column and all its values?')) {
      setDynamicColumns(prev => prev.filter(col => col.id !== colId));
      setDynamicValues(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(rowId => {
          if (next[rowId]) {
            const rowData = { ...next[rowId] };
            delete rowData[colId];
            next[rowId] = rowData;
          }
        });
        return next;
      });
    }
  }, []);

  const updateDynamicValue = useCallback((itemId, colId, value) => {
    setDynamicValues(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [colId]: value
      }
    }));
  }, []);

  // Material Table Edit Handlers
  const handleStartEditMaterialPrices = useCallback(() => {
    // Automatically move current New Index Prices to the Reference column for the new update
    setDraftReferencePrices([...newIndexPrices]);
    // Clear out the New Index inputs for the new entry as requested
    setDraftNewIndexPrices(newIndexPrices.map(item => ({ ...item, price: '' })));
    // Set the date to today's date for the new update
    setNewIndexDate(new Date().toISOString().split('T')[0]);

    setIsEditingMaterialPrices(true);
  }, [newIndexPrices]);

  const handleConfirmEditMaterialPrices = useCallback(() => {
    // 1. Add the PREVIOUS New Index Prices to history before they are replaced.
    // This previously set value (e.g. 100) now becomes the "Reference" (baseline) for the new value (e.g. 1584).
    setMaterialPriceHistory(prev => {
      const historicalEntry = {
        date: `Update ${new Date().toLocaleDateString()}`,
        prices: [...newIndexPrices]
      };
      const newHistory = [...prev, historicalEntry];
      setHistoryIndex(newHistory.length - 1); // Point to the entry we just archived (100)
      return newHistory;
    });

    // 2. Save the newly typed draft prices (1584) as the current New Index Prices.
    setNewIndexPrices(draftNewIndexPrices);
    setCurrentReferencePrices(draftReferencePrices); // Sync current ref (optional but safe)

    setIsEditingMaterialPrices(false);
  }, [draftNewIndexPrices, draftReferencePrices, newIndexPrices]);

  const handleCancelEditMaterialPrices = useCallback(() => {
    setIsEditingMaterialPrices(false);
  }, []);

  const handlePrevHistory = useCallback(() => {
    setHistoryIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextHistory = useCallback(() => {
    setHistoryIndex(prev => Math.min(materialPriceHistory.length - 1, prev + 1));
  }, [materialPriceHistory.length]);

  const handleMoveToReference = useCallback(() => {
    // Moves the 'previous' (saved) new prices into the reference prices.
    setDraftReferencePrices([...newIndexPrices]);
  }, [newIndexPrices]);

  const handleNewIndexPriceChange = useCallback((index, field, value) => {
    if (isEditingMaterialPrices) {
      setDraftNewIndexPrices(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = { ...updated[index], [field]: value };
        }
        return updated;
      });
    } else {
      setNewIndexPrices(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = { ...updated[index], [field]: value };
        }
        return updated;
      });
    }
  }, [isEditingMaterialPrices]);

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

  const mitsubishiHeaderStyle = useMemo(() => ({
    bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#f8fafc',
    fontWeight: 800,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'text.disabled',
    py: 2,
    px: 2,
    borderBottom: '1px solid',
    borderColor: 'divider',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  }), [theme.palette.mode]);

  const mitsubishiHeadersList = useMemo(() => [
    <TableCell key="sn" sx={mitsubishiHeaderStyle}>SI. NO</TableCell>,
    <TableCell key="co" sx={mitsubishiHeaderStyle}>CO</TableCell>,
    <TableCell key="ch" sx={mitsubishiHeaderStyle}>CH</TableCell>,
    <TableCell key="fi" sx={mitsubishiHeaderStyle}>FINISH (Z Column)</TableCell>,
    <TableCell key="wpn" sx={mitsubishiHeaderStyle}>WIN PART NUMBER</TableCell>,
    <TableCell key="desc" sx={mitsubishiHeaderStyle}>DESCRIPTION</TableCell>,
    <TableCell key="imec" sx={mitsubishiHeaderStyle}>IMEC PART NUMBER</TableCell>,
    <TableCell key="rev" sx={mitsubishiHeaderStyle}>Revised Price for Q4 2025</TableCell>,
    <TableCell key="rm" sx={mitsubishiHeaderStyle}>RM Price movement</TableCell>,
    <TableCell key="add" sx={{ ...mitsubishiHeaderStyle, width: 50, p: 0, textAlign: 'center' }}>
      <Tooltip title="Add adjustment columns">
        <IconButton size="small" onClick={handleAddColumnClick} sx={{ color: 'primary.main', border: '1px dashed', borderColor: 'primary.main', borderRadius: 1.5 }}>
          <Plus size={16} />
        </IconButton>
      </Tooltip>
    </TableCell>,
    ... (dynamicColumns || []).map(col => (
      <TableCell key={col.id} sx={mitsubishiHeaderStyle}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <Typography variant="caption" sx={{ fontWeight: 800 }}>{col.name}</Typography>

          <IconButton size="small" onClick={() => deleteColumn(col.id)} sx={{ p: 0, color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
            <X size={12} />
          </IconButton>
        </Stack>
      </TableCell>
    )),
    <TableCell key="price" sx={{ ...mitsubishiHeaderStyle, color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.05) }}>Price</TableCell>
  ], [theme, dynamicColumns, deleteColumn, mitsubishiHeaderStyle]);

  /**
   * MAP AN API CALL TO THIS TABLE:
   */
  useEffect(() => {
    const fetchPricing = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (selectedCustomer === 'Mitsubishi' || selectedCustomer === 'Otis') {
          const mainData = selectedCustomer === 'Mitsubishi' ? mitsubishiMainData : otisMainData.rows;
          setData(mainData);
          const customerVersion = {
            id: `${selectedCustomer.toLowerCase()}-v1`,
            date: new Date(),
            prices: mainData.reduce((acc, item) => ({ ...acc, [item.id]: item.revisedPrice }), {})
          };
          setVersions([customerVersion]);
          setSelectedVersionId(customerVersion.id);
        } else {
          const mockItems = MOCK_PRICING_DATA.map(({ price, ...item }) => item);
          const mockVersions = getMockVersions(MOCK_PRICING_DATA);
          setData(mockItems);
          setVersions(mockVersions);
          setSelectedVersionId(mockVersions[0].id);
        }
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
    if (!data || !Array.isArray(data)) return [];

    return data.filter(item => {
      if (!item) return false;
      const code = (item.code || item.winPartNumber || '').toLowerCase();
      const product = (item.product || item.description || '').toLowerCase();
      const search = searchTerm.toLowerCase();
      return code.includes(search) || product.includes(search);
    });
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

  useEffect(() => {
    if (selectedCustomer !== 'Mitsubishi' && selectedCustomer !== 'Otis') {
      setViewType('rm');
    }
  }, [selectedCustomer]);

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

          {(selectedCustomer === 'Mitsubishi' || selectedCustomer === 'Otis') && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="small"
                onClick={() => setMaterialWeightsOpen(true)}
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  px: 2,
                  height: 40,
                  textTransform: 'none',
                  borderRadius: 2
                }}
              >
                Show Material Weight Calculation
              </Button>

              {!isEditingMaterialPrices ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleStartEditMaterialPrices}
                  sx={{
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    px: 2,
                    height: 40,
                    borderRadius: 2
                  }}
                >
                  Add New Index Price
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={handleConfirmEditMaterialPrices}
                    startIcon={<Check size={14} />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      height: 40,
                      borderRadius: 2,
                      px: 2
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={handleCancelEditMaterialPrices}
                    startIcon={<X size={14} />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      height: 40,
                      borderRadius: 2,
                      px: 2
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </Stack>
          )}

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

      {/* Universal Material Index Table (Above Table) - Only show for Mitsubishi and Otis */}
      {(selectedCustomer === 'Mitsubishi' || selectedCustomer === 'Otis') && (
        <MaterialIndexTable
          materialIndexes={selectedCustomer === 'Otis' ? OTIS_MATERIAL_INDEXES : MITSUBISHI_MATERIAL_INDEXES}
          referenceIndexes={isEditingMaterialPrices ? draftReferencePrices : materialPriceHistory[historyIndex].prices}
          newIndexDate={newIndexDate}
          setNewIndexDate={setNewIndexDate}
          newIndexPrices={isEditingMaterialPrices ? draftNewIndexPrices : newIndexPrices}
          handleNewIndexPriceChange={handleNewIndexPriceChange}
          posVarianceThreshold={posVarianceThreshold}
          negVarianceThreshold={negVarianceThreshold}
          isLoading={isLoading}
          isEditing={isEditingMaterialPrices}
          onStartEdit={handleStartEditMaterialPrices}
          onConfirmEdit={handleConfirmEditMaterialPrices}
          onCancelEdit={handleCancelEditMaterialPrices}
          onMoveToReference={handleMoveToReference}
          historyIndex={historyIndex}
          historyLength={materialPriceHistory.length}
          historyDate={materialPriceHistory[historyIndex].date}
          onPrevHistory={handlePrevHistory}
          onNextHistory={handleNextHistory}
        />
      )}

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
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
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

            {(selectedCustomer === 'Mitsubishi' || selectedCustomer === 'Otis') && (
              <>
                <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 24, alignSelf: 'center' }} />
                <ToggleButtonGroup
                  size="small"
                  value={viewType}
                  exclusive
                  onChange={(e, val) => val && setViewType(val)}
                  sx={{
                    height: 32,
                    '& .MuiToggleButton-root': {
                      px: 2,
                      py: 0.5,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      textTransform: 'none',
                      borderRadius: 1.5,
                      border: 'none',
                      color: 'text.disabled',
                      '&.Mui-selected': {
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }
                    }
                  }}
                >
                  <ToggleButton value="rm">RM Impact Price</ToggleButton>
                  <ToggleButton value="eitem">E.Item Price List</ToggleButton>
                </ToggleButtonGroup>
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <TextField
              size="small"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1.5,
                width: 220,
                '& .MuiInputBase-root': {
                  fontSize: '0.75rem',
                  height: 32
                }
              }}
            />

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
        ) : ((selectedCustomer === 'Mitsubishi' || selectedCustomer === 'Otis') && viewType === 'eitem') ? (
          <Box sx={{ p: 3 }}>
            <EItemPriceList />
          </Box>
        ) : selectedCustomer === 'Otis' ? (
          <OtisMainTable
            data={otisMainData}
            searchTerm={searchTerm}
            page={page}
            rowsPerPage={rowsPerPage}
            selectedVersion={selectedVersion}
          />
        ) : (
          <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
            <Table stickyHeader size="small" key={selectedCustomer}>

              <TableHead>
                <TableRow>
                  {selectedCustomer === 'Mitsubishi' || selectedCustomer === 'Otis' ? mitsubishiHeadersList : (
                    visibleColumns && [...visibleColumns.filter(c => c !== 'Price'), 'Price'].map(col => {
                      const isPrice = col === 'Price';
                      const primaryMain = theme.palette?.primary?.main || '#0d9488';
                      return (
                        <TableCell
                          key={col}
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
                            '&:hover': isPrice ? { bgcolor: alpha(primaryMain, 0.05) } : {}
                          }}
                          onClick={isPrice ? handlePriceHeaderClick : undefined}
                        >
                          <Stack direction="row" alignItems="center" justifyContent={isPrice ? 'flex-end' : 'flex-start'} spacing={1}>
                            {col}
                            {isPrice && <ChevronDown size={14} style={{ transform: isPriceHistoryOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
                          </Stack>
                        </TableCell>
                      );
                    })
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((item, index) => {
                  const serialNumber = (page - 1) * rowsPerPage + index + 1;
                  const basePrice = selectedVersion?.prices[item.id] || 0;

                  // Calculate final price based on dynamic columns
                  let finalPrice = basePrice;
                  dynamicColumns.forEach(col => {
                    const val = parseFloat(dynamicValues[item.id]?.[col.id]) || 0;
                    finalPrice += val;
                  });

                  if (selectedCustomer === 'Mitsubishi' || selectedCustomer === 'Otis') {
                    const rowData = [
                      <TableCell key="sn" align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{serialNumber}</Typography></TableCell>,
                      <TableCell key="co" align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{item.co}</Typography></TableCell>,
                      <TableCell key="ch" align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{item.ch}</Typography></TableCell>,
                      <TableCell key="fi" align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{item.finish}</Typography></TableCell>,
                      <TableCell key="wpn" align="center"><Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.7rem', fontFamily: 'monospace' }}>{item.winPartNumber || item.code}</Typography></TableCell>,
                      <TableCell key="desc" align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description || item.product}</Typography></TableCell>,
                      <TableCell key="imec" align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>{item.imecPartNumber || '-'}</Typography></TableCell>,
                      <TableCell key="rev" align="center"><Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>₹ {basePrice.toLocaleString()}</Typography></TableCell>,
                      <TableCell key="rm" align="center"><Typography variant="body2" sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'info.main' }}>{item.rmMovement}</Typography></TableCell>,
                      <TableCell key="add" sx={{ width: 50 }}></TableCell>,
                      ...dynamicColumns.map(col => (
                        <TableCell key={col.id} align="center">
                          <TextField
                            size="small"
                            variant="outlined"
                            type="number"
                            value={dynamicValues[item.id]?.[col.id] || ''}
                            onChange={(e) => updateDynamicValue(item.id, col.id, e.target.value)}
                            sx={{
                              width: 70,
                              '& .MuiInputBase-input': {
                                py: 0.4, px: 0.8, fontSize: '0.75rem', fontWeight: 700, textAlign: 'center',
                                bgcolor: alpha(theme.palette.success.main, 0.05)
                              }
                            }}
                          />
                        </TableCell>
                      )),
                      <TableCell key="fprice" align="center" sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderLeft: '2px solid',
                        borderColor: 'primary.main',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          bgcolor: finalPrice !== basePrice ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                          transition: 'background-color 0.3s'
                        }
                      }}><Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main', fontSize: '0.9rem', position: 'relative', zIndex: 1, whiteSpace: 'nowrap' }}>₹ {finalPrice.toLocaleString()}</Typography></TableCell>
                    ];

                    return (
                      <TableRow key={item.id} hover sx={{ '& td': { py: 1, px: 2, borderBottom: '1px solid', borderColor: 'divider' } }}>{rowData}</TableRow>
                    );
                  }


                  // Default rendering for other customers
                  return (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{
                        '&:hover': { bgcolor: alpha(theme.palette.background.default, 0.8) },
                        '& td': { py: 2, px: 3, borderBottom: '1px solid', borderColor: 'divider' }
                      }}
                    >
                      {[...visibleColumns.filter(c => c !== 'Price'), 'Price'].map(col => {
                        let content;
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

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


      <PriceHistoryPopover
        anchorEl={priceHistoryAnchorEl}
        onClose={handlePriceHistoryClose}
        groupedVersions={groupedVersions}
        expandedYears={expandedYears}
        expandedMonths={expandedMonths}
        toggleYear={toggleYear}
        toggleMonth={toggleMonth}
        selectedVersionId={selectedVersionId}
        setSelectedVersionId={setSelectedVersionId}
      />

      <MaterialWeightsDialog
        open={materialWeightsOpen}
        onClose={() => setMaterialWeightsOpen(false)}
        selectedCustomer={selectedCustomer}
      />

      <AddColumnDialog
        open={isAddColumnDialogOpen}
        onClose={() => setIsAddColumnDialogOpen(false)}
        onSubmit={submitNewColumns}
      />
    </Box>
  );
};
