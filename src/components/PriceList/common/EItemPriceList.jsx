import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { E_ITEM_PRICE_DATA } from '../../../data/eItemPriceData';

const EItemPriceList = () => {
  const COLORS = {
    PURPLE: '#B4A7D6',
    YELLOW: '#FFFF00',
    BORDER: '#000000',
    WHITE: '#FFFFFF'
  };

  const excelHeaderStyle = {
    fontWeight: 'bold',
    fontSize: '11px',
    color: '#000',
    border: `1px solid ${COLORS.BORDER}`,
    textAlign: 'center',
    padding: '4px 8px',
    backgroundColor: COLORS.PURPLE,
    whiteSpace: 'nowrap'
  };

  const excelCellStyle = {
    fontSize: '11px',
    color: '#000',
    border: `1px solid ${COLORS.BORDER}`,
    textAlign: 'center',
    padding: '2px 4px',
    backgroundColor: COLORS.WHITE,
    fontFamily: 'Arial, sans-serif'
  };

  const emptyCellStyle = {
    border: 'none',
    width: '40px'
  };

  const metadataLabelStyle = {
    fontSize: '10px',
    color: '#444',
    textAlign: 'center',
    paddingBottom: '2px',
    border: 'none'
  };

  return (
    <Box sx={{ bgcolor: COLORS.WHITE, minHeight: '100vh', p: 0 }}>
      <TableContainer sx={{ boxShadow: 'none', borderRadius: 0, overflowX: 'auto' }}>
        <Table size="small" sx={{
          width: 'auto',
          borderCollapse: 'collapse',
          '& td, & th': { border: `1px solid ${COLORS.BORDER}` }
        }}>
          <TableBody>
            {E_ITEM_PRICE_DATA.map((section, sectionIdx) => (
              <React.Fragment key={sectionIdx}>
                {/* Section Separator (Empty row before each section except the first) */}
                {sectionIdx > 0 && <TableRow sx={{ height: '30px', border: 'none' }}><TableCell colSpan={14} sx={{ border: 'none' }} /></TableRow>}

                {/* Metadata Row for pricing columns */}
                {sectionIdx === 0 && (
                  <TableRow sx={{ border: 'none' }}>
                    <TableCell colSpan={9} sx={{ border: 'none' }} />
                    <TableCell sx={emptyCellStyle} />
                    <TableCell sx={metadataLabelStyle}>Item max Lenght 38 char</TableCell>
                    <TableCell colSpan={2} sx={metadataLabelStyle}>Description max lenght 30 char</TableCell>
                    <TableCell sx={{ border: 'none' }} />
                  </TableRow>
                )}

                {/* Section Header Row */}
                <TableRow>
                  <TableCell sx={{ border: 'none', width: 80 }}></TableCell> {/* Blank prefix column header */}
                  <TableCell sx={excelHeaderStyle}>Product</TableCell>
                  <TableCell sx={excelHeaderStyle}>Type</TableCell>
                  <TableCell sx={excelHeaderStyle}>Clear Opening</TableCell>
                  <TableCell sx={excelHeaderStyle}>Clear Height</TableCell>
                  <TableCell sx={excelHeaderStyle}>Door type</TableCell>
                  <TableCell sx={excelHeaderStyle}>Fire rated code</TableCell>
                  <TableCell sx={excelHeaderStyle}>Finish</TableCell>
                  <TableCell sx={excelHeaderStyle}>Grade</TableCell>
                  <TableCell sx={emptyCellStyle} />
                  <TableCell sx={{ ...excelHeaderStyle, backgroundColor: COLORS.YELLOW, minWidth: 200 }}>Price item code</TableCell>
                  <TableCell sx={{ ...excelHeaderStyle, minWidth: 100 }}>{section.title}</TableCell>
                  <TableCell sx={{ ...excelHeaderStyle, minWidth: 180 }}>Description</TableCell>
                  <TableCell sx={emptyCellStyle} />
                </TableRow>

                {/* Section Data Rows */}
                {section.rows.map((row, rowIdx) => (
                  <TableRow key={rowIdx}>
                    <TableCell sx={{ ...excelCellStyle, borderRight: 'none', textAlign: 'left', fontWeight: 'bold' }}>{row.codePrefix}</TableCell>
                    <TableCell sx={{ ...excelCellStyle, borderLeft: 'none' }}>{row.product}</TableCell>
                    <TableCell sx={excelCellStyle}>{row.type}</TableCell>
                    <TableCell sx={excelCellStyle}>{row.opening}</TableCell>
                    <TableCell sx={excelCellStyle}>{row.height}</TableCell>
                    <TableCell sx={excelCellStyle}>{row.doorType}</TableCell>
                    <TableCell sx={excelCellStyle}>{row.fireRating}</TableCell>
                    <TableCell sx={excelCellStyle}>{row.finish}</TableCell>
                    <TableCell sx={excelCellStyle}>{row.grade || ''}</TableCell>

                    {/* Index gap column */}
                    <TableCell sx={{ ...excelCellStyle, border: 'none', color: '#666', fontSize: '9px', width: 30 }}>
                      {row.index}
                    </TableCell>

                    <TableCell sx={{ ...excelCellStyle, textAlign: 'left', fontFamily: 'monospace' }}>{row.priceCode}</TableCell>
                    <TableCell sx={{ ...excelCellStyle, fontWeight: 'bold' }}>{row.price.toLocaleString()}</TableCell>
                    <TableCell sx={{ ...excelCellStyle, textAlign: 'left' }}>{row.description}</TableCell>

                    {/* Right index gap column */}
                    <TableCell sx={{ ...excelCellStyle, border: 'none', color: '#666', fontSize: '9px', width: 30 }}>
                      {row.rightIndex}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EItemPriceList;
