import React from 'react';
import { ChevronDown, Filter, Download } from 'lucide-react';
import { Typography, Box, Button, Card, CardContent, Divider, Stack, Grid, LinearProgress, alpha, useTheme } from '@mui/material';

export const ResultsSection = () => {
  const theme = useTheme();
  return (
    <Box sx={{ mt: 6 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ md: 'flex-end' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            BOM Comparison Results
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Comparison results between{' '}
            <Typography component="span" variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
              S00014756CORE_CD
            </Typography>{' '}
            and{' '}
            <Typography component="span" variant="body2" sx={{ fontFamily: 'monospace', color: 'text.primary' }}>
              S00014658CORE_CD
            </Typography>
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Filter size={16} />}
            endIcon={<ChevronDown size={16} />}
            sx={{ borderColor: 'divider', textTransform: 'none', color: 'text.secondary' }}
          >
            1 selected
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            endIcon={<ChevronDown size={16} />}
            sx={{ borderColor: 'divider', textTransform: 'none', color: 'text.secondary' }}
          >
            Group Based Cost
          </Button>
        </Stack>
      </Stack>

      <Card variant="outlined" sx={{ p: 1 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} sx={{ mb: 4 }} spacing={2}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              Sum of DERIVED MATERIAL GROSS COST Landed cost [INR]
            </Typography>
            <Button
              variant="contained"
              startIcon={<Download size={16} />}
              disableElevation
              sx={{
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
                textTransform: 'none',
                px: 3
              }}
            >
              Export
            </Button>
          </Stack>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <Typography variant="body2" color="text.secondary">BOM 1 Total Cost</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>₹ 14,250,000</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', borderRadius: 4 }
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <Typography variant="body2" color="text.secondary">BOM 2 Total Cost</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>₹ 16,800,000</Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': { bgcolor: 'text.disabled', borderRadius: 4 }
                  }}
                />
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="subtitle2"
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: 'success.main',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 600
              }}
            >
              +17.9%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Cost variance detected in raw material group
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
