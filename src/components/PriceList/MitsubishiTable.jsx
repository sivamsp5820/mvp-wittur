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
  Button,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import { Info } from 'lucide-react';
import {
  MITSUBISHI_MATERIAL_INDEXES,
  MITSUBISHI_REFERENCE_INDEX
} from '../../data/mockPriceListData';

const MitsubishiTable = ({
  newIndexDate,
  setNewIndexDate,
  newIndexPrices,
  handleNewIndexPriceChange,
  posVarianceThreshold,
  setPosVarianceThreshold,
  negVarianceThreshold,
  setNegVarianceThreshold,
  onShowWeights
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4, width: '100%', overflowX: 'auto' }}>
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Table size="small" sx={{ minWidth: 1100, borderCollapse: 'collapse', '& th, & td': { border: '1px solid', borderColor: 'divider' } }}>
          <TableHead>
            {/* Top Level Grouping Header */}
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <TableCell colSpan={3} align="center" sx={{ fontWeight: 800, color: 'text.secondary', py: 1.5 }}>Material Information</TableCell>
              <TableCell colSpan={1} align="center" sx={{ fontWeight: 800, color: 'text.secondary', py: 1.5 }}>Reference Index (10/1/2025)</TableCell>
              <TableCell colSpan={1} align="center" sx={{ fontWeight: 800, color: 'primary.dark', py: 1.5, bgcolor: alpha(theme.palette.primary.main, 0.08) }}>New Index Price</TableCell>
              <TableCell colSpan={2} align="center" sx={{ fontWeight: 800, color: 'text.secondary', py: 1.5 }}>Variance</TableCell>
            </TableRow>

            {/* Control & Date Header */}
            <TableRow sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
              <TableCell colSpan={3} align="center">
                {/* <Button 
                  size="small" 
                  variant="contained" 
                  startIcon={<Info size={14} />}
                  onClick={onShowWeights}
                  sx={{ 
                    bgcolor: '#1b5e20', 
                    '&:hover': { bgcolor: '#154a19' }, 
                    fontSize: '0.7rem', 
                    borderRadius: 1, 
                    fontWeight: 700 
                  }}
                >
                  Show Material Weights
                </Button> */}
              </TableCell>
              <TableCell colSpan={1} align="center">
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.primary' }}>Price Basis: Oct 2025</Typography>
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
                    <TextField
                      variant="outlined"
                      size="small"
                      value={posVarianceThreshold}
                      onChange={(e) => setPosVarianceThreshold(e.target.value)}
                      sx={{ width: 55, '& .MuiInputBase-input': { py: 0.2, px: 0.5, fontSize: '0.65rem', fontWeight: 800, textAlign: 'right', bgcolor: '#fff9c4' } }}
                      InputProps={{ endAdornment: <Box component="span" sx={{ fontSize: '0.6rem', ml: 0.2 }}>%</Box> }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#d32f2f' }}>-ve Threshold:</Typography>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={negVarianceThreshold}
                      onChange={(e) => setNegVarianceThreshold(e.target.value)}
                      sx={{ width: 55, '& .MuiInputBase-input': { py: 0.2, px: 0.5, fontSize: '0.65rem', fontWeight: 800, textAlign: 'right', bgcolor: '#fff9c4' } }}
                      InputProps={{ endAdornment: <Box component="span" sx={{ fontSize: '0.6rem', ml: 0.2 }}>%</Box> }}
                    />
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
            {MITSUBISHI_MATERIAL_INDEXES.map((row, idx) => {
              const refPriceObj = MITSUBISHI_REFERENCE_INDEX[idx] || { price: '0', desc: '-' };
              const refPrice = parseFloat(refPriceObj.price);
              const newVal = parseFloat(newIndexPrices[idx]?.price) || 0;
              const diff = newVal - refPrice;
              const variancePct = ((diff / refPrice) * 100).toFixed(1);
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
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="space-between" sx={{ width: '65px', ml: 'auto' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>₹</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{isZero ? '-' : diff.toFixed(2)}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right" sx={{ bgcolor: '#f1f1f1', color: diff > 0 ? '#1b5e20' : 'red', fontWeight: 800, minWidth: 70 }}>
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

export default MitsubishiTable;
