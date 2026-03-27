import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Popover,
  Stack,
  alpha
} from '@mui/material';
import { ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PriceHistoryPopover = ({
  open,
  anchorEl,
  onClose,
  groupedVersions,
  selectedVersionId,
  setSelectedVersionId,
  expandedYears,
  toggleYear,
  expandedMonths,
  toggleMonth
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: { width: 280, borderRadius: 2, mt: 1, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Price Version History</Typography>
        <IconButton size="small"><MoreHorizontal size={14} /></IconButton>
      </Box>
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        <Stack spacing={0.5} sx={{ p: 1 }}>
          {Object.entries(groupedVersions).map(([year, months]) => (
            <Box key={year}>
              <Button
                fullWidth
                size="small"
                onClick={() => toggleYear(parseInt(year))}
                startIcon={expandedYears.includes(parseInt(year)) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                sx={{
                  justifyContent: 'flex-start',
                  fontWeight: 800,
                  color: 'text.secondary',
                  py: 0.5,
                  fontSize: '0.75rem',
                  '&:hover': { bgcolor: 'transparent', color: 'text.primary' }
                }}
              >
                {year}
              </Button>
              <AnimatePresence>
                {expandedYears.includes(parseInt(year)) && (
                  <Box component={motion.div} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} sx={{ overflow: 'hidden', ml: 1.5 }}>
                    {Object.entries(months).map(([month, monthVersions]) => {
                      const monthKey = `${year}-${month}`;
                      return (
                        <Box key={monthKey}>
                          <Button
                            fullWidth
                            size="small"
                            onClick={() => toggleMonth(monthKey)}
                            startIcon={expandedMonths.includes(monthKey) ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            sx={{
                              justifyContent: 'flex-start',
                              fontWeight: 700,
                              color: 'text.disabled',
                              py: 0.25,
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
