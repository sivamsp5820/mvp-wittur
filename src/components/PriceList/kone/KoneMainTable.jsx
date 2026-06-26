import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TextField,
  Tooltip,
  Stack,
  alpha,
  useTheme,
  Box,
  Chip
} from '@mui/material';
import { Plus, X } from 'lucide-react';

const calculateRowSpans = (rows, key) => {
  const spans = [];
  let currentVal = null;
  let currentSpanIndex = 0;

  for (let i = 0; i < rows.length; i++) {
    const val = rows[i][key];
    if (val !== currentVal) {
      spans.push(1);
      currentVal = val;
      currentSpanIndex = spans.length - 1;
    } else {
      spans[currentSpanIndex]++;
      spans.push(0);
    }
  }
  return spans;
};

const KoneMainTable = ({
  data,
  searchTerm,
  page,
  rowsPerPage,
  dynamicColumns,
  dynamicValues,
  updateDynamicValue,
  handleAddColumnClick,
  deleteColumn
}) => {
  const theme = useTheme();

  const filteredRows = useMemo(() => {
    if (!data) return [];
    return data.filter(item => {
      const search = searchTerm.toLowerCase();
      return (
        item.variantCode?.toLowerCase().includes(search) ||
        item.variantName?.toLowerCase().includes(search) ||
        item.co?.toString().includes(search) ||
        item.remarks?.toLowerCase().includes(search)
      );
    });
  }, [data, searchTerm]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const spans = useMemo(() => {
    return calculateRowSpans(paginatedRows, 'variantName');
  }, [paginatedRows]);

  const headerStyle = useMemo(() => ({
    bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#f8fafc',
    fontWeight: 800,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'text.disabled',
    py: 1,
    px: 1.5,
    border: '1px solid',
    borderColor: 'divider',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  }), [theme]);

  const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '-';
    return `₹ ${val.toLocaleString()}`;
  };

  const formatPercentage = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '-';
    return `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;
  };

  return (
    <TableContainer sx={{ maxHeight: 650, overflow: 'auto', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'divider' }}>
      <Table stickyHeader size="small">
        <TableHead>
          {/* Row 1 */}
          <TableRow>
            <TableCell rowSpan={3} sx={headerStyle}>Variant</TableCell>
            <TableCell rowSpan={3} sx={headerStyle}>Opening Size (mm)</TableCell>
            <TableCell rowSpan={3} sx={{ ...headerStyle, bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#f1f5f9' }}>Current Price H1_2025 (INR)</TableCell>
            <TableCell rowSpan={3} sx={headerStyle}>Weights (kg)</TableCell>
            <TableCell colSpan={3} sx={{ ...headerStyle, bgcolor: alpha(theme.palette.success.main, 0.05), color: 'success.main' }}>Steel index change (INR/kg)</TableCell>
            <TableCell rowSpan={3} sx={{ ...headerStyle, bgcolor: alpha(theme.palette.success.main, 0.05), color: 'success.main' }}>Steel index based PL change (INR)</TableCell>
            <TableCell colSpan={3} sx={{ ...headerStyle, bgcolor: alpha(theme.palette.info.main, 0.05), color: 'info.main' }}>FX CHANGE</TableCell>
            <TableCell rowSpan={3} sx={{ ...headerStyle, bgcolor: alpha(theme.palette.warning.main, 0.05), color: 'warning.main' }}>NEW PRICE H1_2026 (INR)</TableCell>
            <TableCell rowSpan={3} sx={headerStyle}>2% Discount on D10 R5 CDO & R2 TTR</TableCell>
            <TableCell rowSpan={3} sx={headerStyle}>Cost savings (Door Drive Belt Source)</TableCell>
            <TableCell rowSpan={3} sx={headerStyle}>Cost savings (DOP Cover)</TableCell>
            <TableCell rowSpan={3} sx={{ ...headerStyle, bgcolor: alpha(theme.palette.primary.main, 0.05), color: 'primary.main' }}>Revised Price H1_2026 (INR)</TableCell>

            {/* Dynamic adjustment headers go before Price Change */}
            {dynamicColumns.map(col => (
              <TableCell key={col.id} rowSpan={3} sx={headerStyle}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{col.name}</Typography>
                  <IconButton size="small" onClick={() => deleteColumn(col.id)} sx={{ p: 0, color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                    <X size={12} />
                  </IconButton>
                </Stack>
              </TableCell>
            ))}

            {/* Add adjacent column button */}
            <TableCell rowSpan={3} sx={{ ...headerStyle, width: 45, p: 0 }}>
              <Tooltip title="Add adjustment columns">
                <IconButton size="small" onClick={handleAddColumnClick} sx={{ color: 'primary.main', border: '1px dashed', borderColor: 'primary.main', borderRadius: 1.5 }}>
                  <Plus size={14} />
                </IconButton>
              </Tooltip>
            </TableCell>

            <TableCell colSpan={2} sx={{ ...headerStyle, bgcolor: alpha(theme.palette.primary.main, 0.08), color: 'primary.main' }}>Price change</TableCell>
            <TableCell rowSpan={3} sx={{ ...headerStyle, maxWidth: 200 }}>Remarks</TableCell>
          </TableRow>

          {/* Row 2 */}
          <TableRow>
            <TableCell sx={{ ...headerStyle, bgcolor: alpha(theme.palette.success.main, 0.02) }}>India</TableCell>
            <TableCell sx={{ ...headerStyle, bgcolor: alpha(theme.palette.success.main, 0.02) }}>Europe</TableCell>
            <TableCell sx={{ ...headerStyle, bgcolor: alpha(theme.palette.success.main, 0.02) }}>China</TableCell>

            <TableCell sx={{ ...headerStyle, bgcolor: alpha(theme.palette.info.main, 0.02) }}>15.37%</TableCell>
            <TableCell sx={{ ...headerStyle, bgcolor: alpha(theme.palette.info.main, 0.02) }}>8.03%</TableCell>
            <TableCell rowSpan={2} sx={{ ...headerStyle, bgcolor: alpha(theme.palette.info.main, 0.02) }}>price elem</TableCell>

            <TableCell rowSpan={2} sx={{ ...headerStyle, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>INR</TableCell>
            <TableCell rowSpan={2} sx={{ ...headerStyle, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>%</TableCell>
          </TableRow>

          {/* Row 3 */}
          <TableRow>
            <TableCell sx={{ bgcolor: '#fef08a', color: '#854d0e', fontWeight: 900, border: '1px solid', borderColor: 'divider', fontSize: '0.7rem', textAlign: 'center' }}>-1.254</TableCell>
            <TableCell sx={{ bgcolor: '#fef08a', color: '#854d0e', fontWeight: 900, border: '1px solid', borderColor: 'divider', fontSize: '0.7rem', textAlign: 'center' }}>-0.015</TableCell>
            <TableCell sx={{ bgcolor: '#fef08a', color: '#854d0e', fontWeight: 900, border: '1px solid', borderColor: 'divider', fontSize: '0.7rem', textAlign: 'center' }}>-0.152</TableCell>

            <TableCell sx={{ ...headerStyle, bgcolor: alpha(theme.palette.info.main, 0.01) }}>weightage</TableCell>
            <TableCell sx={{ ...headerStyle, bgcolor: alpha(theme.palette.info.main, 0.01) }}>weightage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row, index) => {
            const hasVariantGroup = spans[index] > 0;
            const isDiscounted = row.discount !== 0;

            // Base price for calculations is the Revised Price
            const basePrice = row.revisedPrice || 0;

            // Final Price = Revised Price + Sum of adjacent columns
            let finalRevisedPrice = basePrice;
            dynamicColumns.forEach(col => {
              const val = parseFloat(dynamicValues[row.id]?.[col.id]) || 0;
              finalRevisedPrice += val;
            });

            // Adjust price changes if dynamic columns are present
            const finalPriceChangeInr = row.currentPrice ? (finalRevisedPrice - row.currentPrice) : null;
            const finalPriceChangePercent = row.currentPrice && finalPriceChangeInr !== null ? (finalPriceChangeInr / row.currentPrice) * 100 : null;

            return (
              <TableRow
                key={row.id}
                hover
                sx={{
                  '& td': {
                    py: 1,
                    px: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    fontSize: '0.72rem'
                  }
                }}
              >
                {/* Variant Column (Grouped) */}
                {hasVariantGroup && (
                  <TableCell
                    rowSpan={spans[index]}
                    sx={{
                      fontWeight: 700,
                      bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : '#fafafa',
                      verticalAlign: 'middle',
                      borderRight: '2px solid',
                      borderRightColor: 'primary.light'
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.75rem', color: 'text.primary' }}>
                        {row.variantName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontWeight: 600 }}>
                        {row.variantCode}
                      </Typography>
                    </Box>
                  </TableCell>
                )}

                {/* Opening Size */}
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {row.co} mm
                </TableCell>

                {/* Current Price */}
                <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {formatCurrency(row.currentPrice)}
                </TableCell>

                {/* Weight */}
                <TableCell align="center">
                  {row.weight}
                </TableCell>

                {/* Steel weightages */}
                <TableCell align="center" sx={{ color: 'text.secondary' }}>
                  {row.steelIndia}%
                </TableCell>
                <TableCell align="center" sx={{ color: 'text.secondary' }}>
                  {row.steelEurope}%
                </TableCell>
                <TableCell align="center" sx={{ color: 'text.secondary' }}>
                  {row.steelChina}%
                </TableCell>

                {/* Steel index based PL change */}
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color: row.steelPlChange < 0 ? 'error.main' : row.steelPlChange > 0 ? 'success.main' : 'text.secondary'
                  }}
                >
                  {row.steelPlChange !== 0 ? (row.steelPlChange > 0 ? `+${row.steelPlChange}` : row.steelPlChange) : '0'}
                </TableCell>

                {/* FX Change weightages */}
                <TableCell align="center" sx={{ color: 'text.secondary' }}>
                  {row.fxWeightage1}%
                </TableCell>
                <TableCell align="center" sx={{ color: 'text.secondary' }}>
                  {row.fxWeightage2}%
                </TableCell>

                {/* FX Change price elem */}
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color: row.fxPriceElem > 0 ? 'success.main' : row.fxPriceElem < 0 ? 'error.main' : 'text.secondary'
                  }}
                >
                  {row.fxPriceElem !== 0 ? (row.fxPriceElem > 0 ? `+${row.fxPriceElem}` : row.fxPriceElem) : '0'}
                </TableCell>

                {/* NEW PRICE H1_2026 */}
                <TableCell align="right" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.warning.main, 0.02) }}>
                  {formatCurrency(row.newPrice)}
                </TableCell>

                {/* 2% Discount */}
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color: isDiscounted ? 'error.main' : 'text.disabled',
                    bgcolor: isDiscounted ? alpha(theme.palette.error.main, 0.02) : 'transparent'
                  }}
                >
                  {row.discount !== 0 ? row.discount : '-'}
                </TableCell>

                {/* Cost savings (Door Drive Belt Source) */}
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color: row.driveBeltSaving < 0 ? 'error.main' : 'text.disabled'
                  }}
                >
                  {row.driveBeltSaving !== 0 ? row.driveBeltSaving : '-'}
                </TableCell>

                {/* Cost savings (DOP Cover) */}
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color: row.dopCoverSaving < 0 ? 'error.main' : 'text.disabled'
                  }}
                >
                  {row.dopCoverSaving !== 0 ? row.dopCoverSaving : '-'}
                </TableCell>

                {/* Revised Price / Final Revised Price */}
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 900,
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderLeft: '2px solid',
                    borderLeftColor: 'primary.main'
                  }}
                >
                  {formatCurrency(finalRevisedPrice)}
                </TableCell>

                {/* Dynamic adjacent cells */}
                {dynamicColumns.map(col => (
                  <TableCell key={col.id} align="center">
                    <TextField
                      size="small"
                      variant="outlined"
                      type="number"
                      value={dynamicValues[row.id]?.[col.id] || ''}
                      onChange={(e) => updateDynamicValue(row.id, col.id, e.target.value)}
                      sx={{
                        width: 70,
                        '& .MuiInputBase-input': {
                          py: 0.4, px: 0.8, fontSize: '0.72rem', fontWeight: 700, textAlign: 'center',
                          bgcolor: alpha(theme.palette.success.main, 0.05)
                        }
                      }}
                    />
                  </TableCell>
                ))}

                {/* Empty cell for column spacer alignment */}
                <TableCell />

                {/* Price change INR */}
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color: finalPriceChangeInr && finalPriceChangeInr < 0 ? 'error.main' : finalPriceChangeInr && finalPriceChangeInr > 0 ? 'success.main' : 'text.secondary'
                  }}
                >
                  {finalPriceChangeInr !== null ? (finalPriceChangeInr > 0 ? `+${finalPriceChangeInr.toLocaleString()}` : finalPriceChangeInr.toLocaleString()) : '-'}
                </TableCell>

                {/* Price change % */}
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color: finalPriceChangePercent && finalPriceChangePercent < 0 ? 'error.main' : finalPriceChangePercent && finalPriceChangePercent > 0 ? 'success.main' : 'text.secondary'
                  }}
                >
                  {finalPriceChangePercent !== null ? formatPercentage(finalPriceChangePercent) : '-'}
                </TableCell>

                {/* Remarks */}
                <TableCell sx={{ maxWidth: 200, color: 'text.secondary', fontSize: '0.68rem' }}>
                  {row.remarks ? (
                    <Box sx={{ bgcolor: '#fef08a', color: '#854d0e', p: 1, borderRadius: 1, border: '1px solid #fdec6e', fontWeight: 600 }}>
                      {row.remarks}
                    </Box>
                  ) : ''}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default KoneMainTable;
