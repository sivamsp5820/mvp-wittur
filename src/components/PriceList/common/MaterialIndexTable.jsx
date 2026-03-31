import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Tooltip,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import { ChevronsLeft, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

const MaterialIndexTable = ({
  materialIndexes = [],
  referenceIndexes = [],
  newIndexDate,
  setNewIndexDate,
  newIndexPrices = [],
  handleNewIndexPriceChange,
  posVarianceThreshold,
  negVarianceThreshold,
  isLoading,
  isEditing,
  onStartEdit,
  onConfirmEdit,
  onCancelEdit,
  onMoveToReference,
  historyIndex,
  historyLength,
  historyDate,
  onPrevHistory,
  onNextHistory
}) => {
  const theme = useTheme();

  if (!materialIndexes || materialIndexes.length === 0) return null;

  return (
    <Box sx={{ mb: 4, width: '100%', overflowX: 'auto', position: 'relative' }}>
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider', minHeight: 200, position: 'relative' }}>
        {isLoading && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', zIndex: 10 }}>
            <CircularProgress size={32} sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">Fetching material indexes...</Typography>
          </Box>
        )}
        <Table size="small" sx={{ minWidth: 1100, borderCollapse: 'collapse', '& th, & td': { border: '1px solid', borderColor: 'divider' } }}>
          <TableHead>
            {/* Top Level Grouping Header */}
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <TableCell colSpan={3} align="center" sx={{ fontWeight: 800, color: 'text.secondary', py: 1.5 }}>Material Information</TableCell>
              <TableCell colSpan={1} align="center" sx={{ fontWeight: 800, color: 'text.secondary', py: 1.5 }}>Reference Index</TableCell>
              <TableCell colSpan={1} align="center" sx={{ fontWeight: 800, color: 'primary.dark', py: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.08) }}>New Index Price</TableCell>
              <TableCell colSpan={2} align="center" sx={{ fontWeight: 800, color: 'text.secondary', py: 1.5 }}>Variance</TableCell>
            </TableRow>

            {/* Control & Date Header */}
            <TableRow sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
              <TableCell colSpan={3} align="center"></TableCell>
              <TableCell colSpan={1} align="center">
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                  {isEditing ? (
                    <>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>Price Basis : 10/1/2025</Typography>
                      <Tooltip title="Move current New Index Prices to Reference">
                        <IconButton
                          size="small"
                          onClick={onMoveToReference}
                          sx={{ color: 'primary.main', border: '1px solid', borderColor: 'primary.main', p: 0.2, borderRadius: 1 }}
                        >
                          <ChevronsLeft size={14} />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={onPrevHistory}
                        disabled={historyIndex === 0}
                        sx={{ p: 0.2, color: 'primary.main' }}
                      >
                        <ChevronLeft size={16} />
                      </IconButton>

                      <Box sx={{ minWidth: 140, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '0.65rem' }}>
                          {historyDate || 'Price Basis : 10/1/2025'}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ fontSize: '0.55rem', color: 'text.secondary', mt: -0.5 }}>
                          History: {historyIndex + 1} / {historyLength}
                        </Typography>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={onNextHistory}
                        disabled={historyIndex === historyLength - 1}
                        sx={{ p: 0.2, color: 'primary.main' }}
                      >
                        <ChevronRight size={16} />
                      </IconButton>
                    </Stack>
                  )}
                </Stack>
              </TableCell>
              <TableCell colSpan={1} align="center" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>Date:</Typography>
                  <TextField
                    type="date"
                    variant="standard"
                    size="small"
                    value={newIndexDate}
                    onChange={(e) => setNewIndexDate(e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      sx: { fontSize: '0.75rem', fontWeight: 800, color: 'primary.dark', '& input': { textAlign: 'center', cursor: 'pointer', p: 0 } }
                    }}
                  />
                </Stack>
              </TableCell>
              <TableCell colSpan={2} align="center">
                <Stack spacing={0.5} sx={{ px: 1 }}>
                  <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#d32f2f' }}>+ve Threshold:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'text.primary', minWidth: 40, textAlign: 'right', px: 1 }}>
                      {posVarianceThreshold}%
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#d32f2f' }}>-ve Threshold:</Typography>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'text.primary', minWidth: 40, textAlign: 'right', px: 1 }}>
                      {negVarianceThreshold}%
                    </Typography>
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>

            {/* Column Label Header */}
            <TableRow sx={{ bgcolor: alpha(theme.palette.background.default, 0.8) }}>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Finish</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Material</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Type</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>Price / Kg</TableCell>
              <TableCell align="center" sx={{ fontWeight: 800, color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.02) }}>New Price / Kg</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>Diff Amount</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>Variance %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materialIndexes.map((row, idx) => {
              const refPriceObj = referenceIndexes[idx] || { price: '0', desc: '-' };
              const refPrice = parseFloat(refPriceObj.price);
              const newVal = parseFloat(newIndexPrices[idx]?.price) || 0;
              const diff = newVal - refPrice;
              const variancePct = refPrice !== 0 ? ((diff / refPrice) * 100).toFixed(1) : '0.0';
              const isZero = diff === 0;

              return (
                <TableRow key={idx} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{row.finish}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.material}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.type}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>₹</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{refPriceObj.price}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                    {isEditing ? (
                      <TextField
                        variant="outlined"
                        size="small"
                        value={newIndexPrices[idx]?.price || ''}
                        onChange={(e) => handleNewIndexPriceChange(idx, 'price', e.target.value)}
                        sx={{
                          width: 90,
                          '& .MuiOutlinedInput-root': {
                            fontSize: '0.8rem', fontWeight: 800, bgcolor: 'background.paper', color: 'primary.main',
                            '& fieldset': { borderColor: alpha(theme.palette.primary.main, 0.2) },
                            '&:hover fieldset': { borderColor: 'primary.main' }
                          },
                          '& .MuiInputBase-input': { py: 0.5, px: 1, textAlign: 'center' }
                        }}
                      />
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        ₹ {newIndexPrices[idx]?.price || '0'}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="space-between" sx={{ width: '65px', ml: 'auto' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>₹</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{isZero ? '-' : diff.toFixed(2)}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ bgcolor: '#f1f1f1', color: diff > 0 ? '#1b5e20' : diff < 0 ? 'red' : 'text.secondary', fontWeight: 800, minWidth: 70 }}>
                    {isZero ? '0.0%' : `${variancePct}%`}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default MaterialIndexTable;
