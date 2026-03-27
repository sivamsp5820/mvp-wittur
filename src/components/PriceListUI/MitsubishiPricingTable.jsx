import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  alpha,
  useTheme
} from '@mui/material';
import {
  MITSUBISHI_MATERIAL_INDEXES,
  MITSUBISHI_REFERENCE_INDEX
} from '../../data/mockPriceListData';

export const MitsubishiPricingTable = ({
  newIndexDate,
  setNewIndexDate,
  newIndexPrices,
  handleNewIndexPriceChange,
  posVarianceThreshold,
  setPosVarianceThreshold,
  negVarianceThreshold,
  setNegVarianceThreshold
}) => {
  const theme = useTheme();

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', mb: 4 }}>
      <Table size="small" sx={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        '& th, & td': { border: '1px solid', borderColor: 'divider', py: 1, px: 1.5, fontSize: '0.8rem' } 
      }}>
        <TableHead>
          {/* Main Top Header Groups */}
          <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
            <TableCell colSpan={3} align="center" sx={{ fontWeight: 800, color: 'text.secondary' }}>Material Details</TableCell>
            <TableCell colSpan={2} align="center" sx={{ fontWeight: 800, color: 'text.secondary' }}>Reference Index</TableCell>
            <TableCell colSpan={2} align="center" sx={{ fontWeight: 800, color: 'primary.dark' }}>New Index price</TableCell>
            <TableCell colSpan={2} align="center" sx={{ fontWeight: 800, color: '#d32f2f', bgcolor: alpha('#d32f2f', 0.02) }}>Variance Analysis</TableCell>
          </TableRow>

          {/* Sub-Header Group 1: Dates & Thresholds */}
          <TableRow sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
            <TableCell colSpan={3}></TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', width: '80px' }}>Date:</TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, color: 'text.primary', width: '140px' }}>10/1/2025</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', width: '80px' }}>Date:</TableCell>
            <TableCell align="center" sx={{ p: 0.5, borderBottom: '1px solid', borderColor: 'divider', width: '180px' }}>
              <TextField
                type="date"
                variant="standard"
                size="small"
                fullWidth
                value={newIndexDate}
                onChange={(e) => setNewIndexDate(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { fontSize: '0.85rem', fontWeight: 800, color: 'primary.dark', '& input': { textAlign: 'center', cursor: 'pointer', p: 0 } } }}
              />
            </TableCell>
            <TableCell colSpan={2} sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider', p: 0.5, bgcolor: '#fff9c4' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', flex: 1, color: '#1b5e20' }}>+ Threshold:</Typography>
                  <TextField
                    variant="standard"
                    value={posVarianceThreshold}
                    onChange={(e) => setPosVarianceThreshold(e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      endAdornment: <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#000', marginLeft: '2px' }}>%</span>,
                      sx: { fontSize: '0.75rem', fontWeight: 'bold', '& input': { textAlign: 'right', p: 0, width: '30px' } }
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', p: 0.5, bgcolor: '#fff9c4' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold', flex: 1, color: '#d32f2f' }}>- Threshold:</Typography>
                  <TextField
                    variant="standard"
                    value={negVarianceThreshold}
                    onChange={(e) => setNegVarianceThreshold(e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      endAdornment: <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#000', marginLeft: '2px' }}>%</span>,
                      sx: { fontSize: '0.75rem', fontWeight: 'bold', '& input': { textAlign: 'right', p: 0, width: '30px' } }
                    }}
                  />
                </Box>
              </Box>
            </TableCell>
          </TableRow>

          {/* Sub-Header Group 2: Column Titles */}
          <TableRow sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', width: '100px' }}>Finish</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', width: '100px' }}>Material</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', width: '100px' }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', width: '90px' }}>Price / Kg</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', width: '90px' }}>Price / Kg (₹)</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, color: 'text.secondary' }}>Description</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', width: '80px' }}>Diff Amt</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', width: '80px' }}>Variance %</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {MITSUBISHI_MATERIAL_INDEXES.map((matRow, idx) => {
            const refRow = MITSUBISHI_REFERENCE_INDEX[idx];
            const newRow = newIndexPrices[idx] || { price: '0', desc: '' };
            
            const refPrice = parseFloat(refRow.price);
            const newVal = parseFloat(newRow.price) || 0;
            const diff = newVal - refPrice;
            const variancePct = ((diff / refPrice) * 100).toFixed(1);
            const isZero = diff === 0;

            return (
              <TableRow key={idx} hover sx={{ '& td': { fontWeight: 600, color: 'text.primary' } }}>
                {/* Material Details */}
                <TableCell>{matRow.finish}</TableCell>
                <TableCell>{matRow.material}</TableCell>
                <TableCell>{matRow.type}</TableCell>

                {/* Reference Index */}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box component="span" sx={{ color: 'text.secondary' }}>₹</Box>
                    <Box component="span">{refRow.price}</Box>
                  </Box>
                </TableCell>
                <TableCell align="center">{refRow.desc}</TableCell>

                {/* New Index (Editable) */}
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={newRow.price}
                    onChange={(e) => handleNewIndexPriceChange(idx, 'price', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '0.8rem', fontWeight: 800, bgcolor: 'background.paper', color: 'primary.main',
                        '& fieldset': { borderColor: alpha(theme.palette.primary.main, 0.3) },
                        '&:hover fieldset': { borderColor: 'primary.main' }
                      },
                      '& .MuiInputBase-input': { py: 0.5, px: 1, textAlign: 'right' }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={newRow.desc}
                    onChange={(e) => handleNewIndexPriceChange(idx, 'desc', e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontSize: '0.8rem', fontWeight: 600, bgcolor: 'background.paper',
                        '& fieldset': { borderColor: 'divider' },
                        '&:hover fieldset': { borderColor: 'primary.main' }
                      },
                      '& .MuiInputBase-input': { py: 0.5, px: 1, textAlign: 'center' }
                    }}
                  />
                </TableCell>

                {/* Variance Analysis */}
                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box component="span" sx={{ fontWeight: 'normal', color: 'text.secondary' }}>₹</Box>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>{isZero ? '-' : diff.toFixed(2)}</Box>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ bgcolor: alpha(theme.palette.divider, 0.3), color: diff > 0 ? '#1b5e20' : '#d32f2f', fontWeight: 'bold' }}>
                  {isZero ? '0.0%' : `${variancePct}%`}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
};
