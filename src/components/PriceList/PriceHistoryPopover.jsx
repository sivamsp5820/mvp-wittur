import React from 'react';
import {
  Popover,
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  alpha
} from '@mui/material';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PriceHistoryPopover = ({
  anchorEl,
  onClose,
  groupedVersions,
  expandedYears,
  expandedMonths,
  toggleYear,
  toggleMonth,
  selectedVersionId,
  setSelectedVersionId
}) => {
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          width: 280,
          maxHeight: 400,
          mt: 1.5,
          borderRadius: 3,
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha('#0d9488', 0.02) }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Price History
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Select specific version to view
        </Typography>
      </Box>
      <Box sx={{ maxHeight: 310, overflowY: 'auto', p: 1 }}>
        <Stack spacing={0.5}>
          {Object.entries(groupedVersions).sort((a, b) => Number(b[0]) - Number(a[0])).map(([year, months]) => (
            <Box key={year}>
              <Button
                fullWidth
                size="small"
                onClick={() => toggleYear(year)}
                startIcon={expandedYears.includes(Number(year)) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                sx={{
                  justifyContent: 'flex-start',
                  fontWeight: 800,
                  color: 'text.primary',
                  py: 1,
                  px: 1.5,
                  fontSize: '0.75rem',
                  '&:hover': { bgcolor: 'transparent', color: 'primary.main' }
                }}
              >
                {year}
              </Button>
              <AnimatePresence>
                {expandedYears.includes(Number(year)) && (
                  <Box component={motion.div} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} sx={{ overflow: 'hidden', ml: 1.5 }}>
                    {Object.entries(months).map(([month, monthVersions]) => {
                      const monthKey = `${year}-${month}`;
                      return (
                        <Box key={month}>
                          <Button
                            fullWidth
                            size="small"
                            onClick={() => toggleMonth(monthKey)}
                            startIcon={expandedMonths.includes(monthKey) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            sx={{
                              justifyContent: 'flex-start',
                              fontWeight: 700,
                              color: 'text.secondary',
                              py: 0.75,
                              px: 1,
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
                                      onClose();
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
  );
};

export default PriceHistoryPopover;
