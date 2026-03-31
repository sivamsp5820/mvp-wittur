import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { 
  CENTER_OPENING_WEIGHTS, 
  TELESCOPIC_OPENING_WEIGHTS,
  OTIS_CENTER_OPENING_WEIGHTS,
  OTIS_TELESCOPIC_OPENING_WEIGHTS
} from '../../../data/mockPriceListData';

const MaterialWeightsDialog = ({ open, onClose, selectedCustomer }) => {
  const isOtis = selectedCustomer === 'Otis';
  
  const centerWeights = isOtis ? OTIS_CENTER_OPENING_WEIGHTS : CENTER_OPENING_WEIGHTS;
  const telescopicWeights = isOtis ? OTIS_TELESCOPIC_OPENING_WEIGHTS : TELESCOPIC_OPENING_WEIGHTS;

  const renderTable = (title, data) => {
    if (isOtis) {
      return (
        <Table size="small" sx={{
          width: '100%',
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          '& th, & td': { border: '1px solid #000', py: 0.5, px: 0.5, fontSize: '0.75rem', color: '#000', fontFamily: 'sans-serif', textAlign: 'center', wordWrap: 'break-word' }
        }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#d8e2f3' }}>
              <TableCell colSpan={5} align="left" sx={{ fontWeight: 900, fontSize: '0.85rem' }}>{title}</TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: '#d8e2f3' }}>
              <TableCell sx={{ borderTop: 'none', borderBottom: 'none' }}></TableCell>
              <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>CORE ( 2000 MM / 2100 MM )</TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: '#d8e2f3' }}>
              <TableCell rowSpan={2} sx={{ fontWeight: 'bold', verticalAlign: 'middle' }}>Mat weight</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Painted</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>SS Cladded Doors</TableCell>
              <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Frame</TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: '#d8e2f3' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Wt ( Kgs )</TableCell>
              <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Wt ( Kgs )</TableCell>
              <TableCell sx={{ borderTop: 'none', borderBottom: 'none' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx} sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>{row.w}</TableCell>
                <TableCell>{row.c1}</TableCell>
                <TableCell>{row.c2}</TableCell>
                <TableCell>{row.c3}</TableCell>
                <TableCell>{row.c4}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: '#d8e2f3' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Material</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>MS</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>MS</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>SS</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>SS</TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: '#d8e2f3' }}>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Thickness</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>1. mm</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>1. mm</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>0.5 mm</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>1.0 mm</TableCell>
            </TableRow>
            <TableRow sx={{ bgcolor: '#d8e2f3' }}>
              <TableCell sx={{ borderTop: 'none' }}></TableCell>
              <TableCell sx={{ borderTop: 'none', fontSize: '0.65rem' }}>Mech+Door</TableCell>
              <TableCell sx={{ borderTop: 'none', fontSize: '0.65rem' }}>Mech+Door</TableCell>
              <TableCell sx={{ borderTop: 'none', fontSize: '0.65rem' }}>Panel</TableCell>
              <TableCell sx={{ borderTop: 'none', fontSize: '0.65rem' }}>Frame</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    }

    // Default (Mitsubishi)
    return (
      <Table size="small" sx={{
        width: '100%',
        tableLayout: 'fixed',
        borderCollapse: 'collapse',
        '& th, & td': { border: '1px solid #000', py: 0.5, px: 0.5, fontSize: '0.75rem', color: '#000', fontFamily: 'sans-serif', textAlign: 'center', wordWrap: 'break-word' }
      }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#d8e2f3' }}>
            <TableCell colSpan={6} align="left" sx={{ fontWeight: 900, fontSize: '0.85rem' }}>{title}</TableCell>
          </TableRow>
          <TableRow sx={{ bgcolor: '#d8e2f3' }}>
            <TableCell sx={{ borderTop: 'none', borderBottom: 'none' }}></TableCell>
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>CORE (2000mm/2100mm)</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>CORE</TableCell>
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>CORE</TableCell>
          </TableRow>
          <TableRow sx={{ bgcolor: '#d8e2f3' }}>
            <TableCell rowSpan={2} sx={{ fontWeight: 'bold', verticalAlign: 'middle' }}>Mat<br />weight</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Painted Full<br />Door With<br />Accessories</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>SS DOORS Full Door<br />With Accessories</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Mechanism<br />With Sill<br />Group</TableCell>
            <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Frames</TableCell>
          </TableRow>
          <TableRow sx={{ bgcolor: '#d8e2f3' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Wt ( Kgs )</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Wt ( Kgs )</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Wt ( Kgs )</TableCell>
            <TableCell sx={{ borderTop: 'none', borderBottom: 'none' }}></TableCell>
            <TableCell sx={{ borderTop: 'none', borderBottom: 'none' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx} sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>{row.w}</TableCell>
              <TableCell>{row.c1}</TableCell>
              <TableCell>{row.c2}</TableCell>
              <TableCell>{row.c3}</TableCell>
              <TableCell>{row.c4}</TableCell>
              <TableCell>{row.c5}</TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ bgcolor: '#d8e2f3' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Material</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>MS</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>MS</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>SS</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>MS</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>SS</TableCell>
          </TableRow>
          <TableRow sx={{ bgcolor: '#d8e2f3' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Thickness</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>1mm</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>1mm</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>0.5 mm</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>1.0 mm</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>1.0 mm</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      PaperProps={{
        sx: { borderRadius: 3, p: 3, bgcolor: '#fdfdfd', width: '95vw', maxWidth: '1600px' }
      }}
    >
      <DialogTitle sx={{ p: 0, pb: 3, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ bgcolor: '#fce2cd', border: '1px solid #000', px: 6, py: 1, width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#000', textDecoration: 'underline' }}>
            Material Weights for Calculation ({selectedCustomer})
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0, overflowX: 'auto' }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} sx={{ width: '100%', pt: 1, pb: 2 }}>
          {renderTable('Center Opening', centerWeights)}
          {renderTable('Telescopic Opening', telescopicWeights)}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialWeightsDialog;
