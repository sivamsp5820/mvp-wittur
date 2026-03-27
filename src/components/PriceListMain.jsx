import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Search, Download, Upload, Info, CircularProgress, SlidersHorizontal } from 'lucide-react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  alpha,
  FormControl,
  InputLabel,
  Chip,
  Pagination,
  useTheme
} from '@mui/material';

import {
  CUSTOMERS,
  COLUMNS,
  PINNED_COLUMNS,
  MOCK_PRICING_DATA,
  MITSUBISHI_DEFAULT_NEW_INDEX,
  getMockVersions
} from '../data/mockPriceListData';

import { MitsubishiPricingTable } from './PriceListUI/MitsubishiPricingTable';
import { MaterialWeightsDialog } from './PriceListUI/MaterialWeightsDialog';
import { PriceHistoryPopover } from './PriceListUI/PriceHistoryPopover';

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
  const [priceHistoryAnchorEl, setPriceHistoryAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [materialWeightsOpen, setMaterialWeightsOpen] = useState(false);
  const [posVarianceThreshold, setPosVarianceThreshold] = useState('0');
  const [negVarianceThreshold, setNegVarianceThreshold] = useState('0');

  // Editable Index State
  const [newIndexDate, setNewIndexDate] = useState('2026-01-01');
  const [newIndexPrices, setNewIndexPrices] = useState(MITSUBISHI_DEFAULT_NEW_INDEX);

  const handleNewIndexPriceChange = (index, field, value) => {
    const updated = [...newIndexPrices];
    updated[index][field] = value;
    setNewIndexPrices(updated);
  };

  const isColumnPickerOpen = Boolean(columnPickerAnchorEl);
  const isPriceHistoryOpen = Boolean(priceHistoryAnchorEl);

  useEffect(() => {
    const fetchPricing = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(MOCK_PRICING_DATA.map(({ price, ...item }) => item));
        const mockVersions = getMockVersions(MOCK_PRICING_DATA);
        setVersions(mockVersions);
        setSelectedVersionId(mockVersions[0].id);
      } catch (err) {
        setError('Failed to load pricing data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPricing();
  }, [selectedCustomer]);

  const filteredData = useMemo(() =>
    data.filter(item =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  useEffect(() => { setPage(1); }, [searchTerm, selectedCustomer, rowsPerPage]);

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

  useEffect(() => {
    if (versions.length > 0) {
      const latest = versions[0];
      setExpandedYears([latest.date.getFullYear()]);
      setExpandedMonths([`${latest.date.getFullYear()}-${latest.date.toLocaleString('default', { month: 'long' })}`]);
    }
  }, [versions.length]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header & Search */}
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'flex-end' }} justifyContent="space-between" spacing={3}>
        <Typography variant="h4" sx={{ fontWeight: 300, color: 'text.primary', letterSpacing: '-0.02em' }}>Price Book</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Customer</InputLabel>
            <Select value={selectedCustomer} label="Customer" onChange={(e) => setSelectedCustomer(e.target.value)} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
              {CUSTOMERS.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField size="small" placeholder="Search item code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> }} sx={{ bgcolor: 'background.paper', borderRadius: 2, width: 260 }} />
        </Stack>
      </Stack>

      {/* Buttons */}
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<Download size={18} />} sx={{ borderRadius: 2, px: 3, bgcolor: '#0d9488', boxShadow: 'none' }}>Export Price List</Button>
          <input type="file" ref={fileInputRef} hidden onChange={() => { }} />
          <Button variant="outlined" startIcon={<Upload size={18} />} onClick={() => fileInputRef.current?.click()} sx={{ borderRadius: 2, px: 3, borderColor: '#0d9488', color: '#0d9488' }}>Import New Prices</Button>
          {selectedCustomer === 'Mitsubishi' && (
            <Button variant="outlined" startIcon={<Info size={18} />} onClick={() => setMaterialWeightsOpen(true)} sx={{ borderRadius: 2, px: 3, borderColor: '#1b5e20', color: '#1b5e20' }}>Show Material Weights</Button>
          )}
        </Stack>
      </Stack>

      {/* Consolidated Mitsubishi Grid */}
      {selectedCustomer === 'Mitsubishi' && (
        <MitsubishiPricingTable
          newIndexDate={newIndexDate}
          setNewIndexDate={setNewIndexDate}
          newIndexPrices={newIndexPrices}
          handleNewIndexPriceChange={handleNewIndexPriceChange}
          posVarianceThreshold={posVarianceThreshold}
          setPosVarianceThreshold={setPosVarianceThreshold}
          negVarianceThreshold={negVarianceThreshold}
          setNegVarianceThreshold={setNegVarianceThreshold}
        />
      )}

      {/* Main Table */}
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', minHeight: 400, borderColor: 'divider' }}>
        <Box sx={{ px: 4, py: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: alpha(theme.palette.background.default, 0.5) }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Products</Typography>
            {!isLoading && <Chip label={`${filteredData.length} Results`} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.625rem', fontWeight: 700 }} />}
          </Stack>
          <IconButton size="small" onClick={(e) => setColumnPickerAnchorEl(e.currentTarget)} sx={{ borderRadius: 2, border: '1px solid', borderColor: isColumnPickerOpen ? 'primary.main' : 'divider' }}>
            <SlidersHorizontal size={18} />
          </IconButton>
        </Box>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableCell key={col} onClick={col === 'Price' ? (e) => setPriceHistoryAnchorEl(e.currentTarget) : undefined}
                    sx={{
                      cursor: col === 'Price' ? 'pointer' : 'default', fontWeight: 800, bgcolor: 'background.paper', color: 'text.secondary', py: 2,
                      ...(col === 'Price' && { color: 'primary.main', borderBottom: '2px solid', borderBottomColor: 'primary.main' })
                    }}>
                    <Stack direction="row" spacing={0.5} alignItems="center" justifyContent={col === 'Price' ? 'flex-end' : 'flex-start'}>
                      {col === 'Price' && <Chip label={selectedVersionId?.toUpperCase()} size="small" sx={{ height: 18, fontSize: '0.6rem', mr: 1, bgcolor: alpha('#0d9488', 0.1), color: '#0d9488' }} />}
                      {col} {col === 'Price' && <ChevronDown size={14} />}
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 10 }}><CircularProgress size={24} sx={{ color: '#0d9488' }} /></TableCell></TableRow>
              ) : paginatedData.map((row, idx) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ color: 'text.disabled', fontWeight: 600 }}>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 700 }}>{row.code}</TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.opening}</TableCell>
                  <TableCell>{row.height}</TableCell>
                  <TableCell>{row.doorType}</TableCell>
                  <TableCell>{row.fireRating}</TableCell>
                  <TableCell>{row.panelType}</TableCell>
                  <TableCell>{row.frameSize}</TableCell>
                  <TableCell>{row.finish}</TableCell>
                  <TableCell>{row.grade}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: 'text.primary', bgcolor: alpha('#0d9488', 0.01) }}>
                    ₹ {(selectedVersion?.prices[row.id] || 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ px: 4, py: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination count={Math.ceil(filteredData.length / rowsPerPage)} page={page} onChange={(_, p) => setPage(p)} size="small" sx={{ '& .Mui-selected': { bgcolor: alpha('#0d9488', 0.1), color: '#0d9488' } }} />
        </Box>
      </Paper>

      {/* Sub-Components */}
      <PriceHistoryPopover
        open={isPriceHistoryOpen}
        anchorEl={priceHistoryAnchorEl}
        onClose={() => setPriceHistoryAnchorEl(null)}
        groupedVersions={groupedVersions}
        selectedVersionId={selectedVersionId}
        setSelectedVersionId={setSelectedVersionId}
        expandedYears={expandedYears}
        toggleYear={(y) => setExpandedYears(prev => prev.includes(y) ? prev.filter(i => i !== y) : [...prev, y])}
        expandedMonths={expandedMonths}
        toggleMonth={(m) => setExpandedMonths(prev => prev.includes(m) ? prev.filter(i => i !== m) : [...prev, m])}
      />
      <MaterialWeightsDialog open={materialWeightsOpen} onClose={() => setMaterialWeightsOpen(false)} />
    </Box>
  );
};
