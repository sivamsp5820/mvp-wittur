import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TextField,
  Tooltip,
  Stack,
  alpha,
  useTheme,
  Box
} from '@mui/material';
import { Plus, X } from 'lucide-react';

import AddColumnDialog from '../common/AddColumnDialog';

const OtisMainTable = ({
  data,
  searchTerm,
  page,
  rowsPerPage,
  selectedVersion
}) => {
  const theme = useTheme();

  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);

  // Local state for adjacent columns
  const [adjacentColumns, setAdjacentColumns] = useState(() => {
    const saved = localStorage.getItem('otis_adjacent_columns');
    return saved ? JSON.parse(saved) : [];
  });

  const [adjacentValues, setAdjacentValues] = useState(() => {
    const saved = localStorage.getItem('otis_adjacent_values');
    return saved ? JSON.parse(saved) : {};
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('otis_adjacent_columns', JSON.stringify(adjacentColumns));
  }, [adjacentColumns]);

  useEffect(() => {
    localStorage.setItem('otis_adjacent_values', JSON.stringify(adjacentValues));
  }, [adjacentValues]);

  const handleAddAdjacentClick = () => {
    setIsAddColumnDialogOpen(true);
  };

  const submitNewColumns = (newCols) => {
    setAdjacentColumns(prev => [...prev, ...newCols]);
  };

  const deleteAdjacentColumn = (colId) => {
    if (window.confirm("Delete this column?")) {
      setAdjacentColumns(prev => prev.filter(c => c.id !== colId));
      // Cleanup values
      setAdjacentValues(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(itemId => {
          if (next[itemId]) {
            const rowData = { ...next[itemId] };
            delete rowData[colId];
            next[itemId] = rowData;
          }
        });
        return next;
      });
    }
  };

  const handleValueChange = (itemId, colId, value) => {
    setAdjacentValues(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [colId]: value
      }
    }));
  };

  // Logic: Insert dynamic columns between Revised Price and Final Price
  const headers = useMemo(() => {
    if (!data || !data.headers) return [];

    // Split headers at "Final Price"
    const baseHeaders = data.headers.filter(h => h !== "Final Price");
    // Find index of "Revised Price..." 
    const revIdx = baseHeaders.findIndex(h => h.includes("Revised Price"));

    const finalHeaders = [...baseHeaders];
    // Dynamic columns go after Revised Price
    // But the user requested a "+" button specifically BEFORE the Final Price column.
    return finalHeaders;
  }, [data]);

  const filteredRows = useMemo(() => {
    if (!data || !data.rows) return [];

    return data.rows.filter(item => {
      const search = searchTerm.toLowerCase();
      return (
        item.item_code?.toLowerCase().includes(search) ||
        item.finish_code?.toLowerCase().includes(search) ||
        item.door_type?.toLowerCase().includes(search) ||
        item.fire_rating?.toLowerCase().includes(search) ||
        item.co?.toString().includes(search) ||
        item.ch?.toString().includes(search) ||
        item.id?.toLowerCase().includes(search)
      );
    });
  }, [data, searchTerm]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  const otisHeaderStyle = useMemo(() => ({
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
  }), [theme]);

  if (!data || !data.rows) return null;

  return (
    <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {/* Header sequence according to otisMainData.json headers */}
            <TableCell sx={otisHeaderStyle}>S.No</TableCell>
            <TableCell sx={otisHeaderStyle}>Item Code</TableCell>
            <TableCell sx={otisHeaderStyle}>CLEAR OPENING</TableCell>
            <TableCell sx={otisHeaderStyle}>CLEAR HEIGHT</TableCell>
            <TableCell sx={otisHeaderStyle}>DOOR TYPE</TableCell>
            <TableCell sx={otisHeaderStyle}>HANDAGE</TableCell>
            <TableCell sx={otisHeaderStyle}>FIRE RATING</TableCell>
            <TableCell sx={otisHeaderStyle}>Toeguard</TableCell>
            <TableCell sx={otisHeaderStyle}>FINISH CODE</TableCell>
            <TableCell sx={otisHeaderStyle}>Revised Price From 1st July 2025 to 31st December 2025</TableCell>

            {/* Adjacent Columns (Dynamic) */}
            {adjacentColumns.map(col => (
              <TableCell key={col.id} sx={otisHeaderStyle}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{col.name}</Typography>
                  <IconButton size="small" onClick={() => deleteAdjacentColumn(col.id)} sx={{ p: 0, color: 'text.disabled', '&:hover': { color: 'error.main' } }}>
                    <X size={12} />
                  </IconButton>
                </Stack>
              </TableCell>
            ))}

            {/* Final Price Column with + Button */}
            <TableCell sx={{
              ...otisHeaderStyle,
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              position: 'relative'
            }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                {/* User asked: "Before the Final Price column, include a + button" */}
                {/* We'll put it slightly inside the header or maybe as a separate column. 
                    Let's put it as a tooltip icon next to Final Price header for better UI. */}
                <Tooltip title="Add Adjacent Columns">
                  <IconButton
                    size="small"
                    onClick={handleAddAdjacentClick}
                    sx={{
                      mr: 1,
                      color: 'primary.main',
                      border: '1px dashed',
                      borderColor: 'primary.main',
                      borderRadius: 1.5,
                      p: 0.2
                    }}
                  >
                    <Plus size={14} />
                  </IconButton>
                </Tooltip>
                Final Price
              </Stack>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedRows.map((row, index) => {
            const basePrice = row.revised_price || 0;
            const serialNumber = (page - 1) * rowsPerPage + index + 1;

            // Calculate final price: Revised Price + sum of dynamic columns
            let finalPrice = basePrice;
            adjacentColumns.forEach(col => {
              const val = parseFloat(adjacentValues[row.id]?.[col.id]) || 0;
              finalPrice += val;
            });

            return (
              <TableRow key={row.id} hover sx={{ '& td': { py: 1.5, px: 2, borderBottom: '1px solid', borderColor: 'divider' } }}>
                <TableCell align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{serialNumber}</Typography></TableCell>
                <TableCell align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.item_code}</Typography></TableCell>
                <TableCell align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.co}mm</Typography></TableCell>
                <TableCell align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.ch}mm</Typography></TableCell>
                <TableCell align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.door_type}</Typography></TableCell>
                <TableCell align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.handage}</Typography></TableCell>
                <TableCell align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.fire_rating}</Typography></TableCell>
                <TableCell align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.toeguard}</Typography></TableCell>
                <TableCell align="center"><Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{row.finish_code}</Typography></TableCell>
                <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>₹ {basePrice.toLocaleString()}</Typography></TableCell>

                {/* Dynamic adjacent cells */}
                {adjacentColumns.map(col => (
                  <TableCell key={col.id} align="center">
                    <TextField
                      size="small"
                      variant="outlined"
                      type="number"
                      value={adjacentValues[row.id]?.[col.id] || ''}
                      onChange={(e) => handleValueChange(row.id, col.id, e.target.value)}
                      sx={{
                        width: 90,
                        '& .MuiInputBase-input': {
                          py: 0.4, px: 0.8, fontSize: '0.75rem', fontWeight: 700, textAlign: 'center',
                          bgcolor: alpha(theme.palette.success.main, 0.05)
                        }
                      }}
                    />
                  </TableCell>
                ))}

                <TableCell align="center" sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderLeft: '2px solid',
                  borderColor: 'primary.main',
                  position: 'relative'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main', fontSize: '0.9rem', position: 'relative', zIndex: 1, whiteSpace: 'nowrap' }}>
                    ₹ {finalPrice.toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <AddColumnDialog
        open={isAddColumnDialogOpen}
        onClose={() => setIsAddColumnDialogOpen(false)}
        onSubmit={submitNewColumns}
      />
    </TableContainer>
  );
};

export default OtisMainTable;
