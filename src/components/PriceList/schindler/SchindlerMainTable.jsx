import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  alpha,
  useTheme,
  Box,
  Chip
} from '@mui/material';

// ─── Row-span helper ───────────────────────────────────────────────────────────
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

// ─── Currency formatter ────────────────────────────────────────────────────────
const fmt = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '–';
  return `₹ ${Number(val).toLocaleString('en-IN')}`;
};

// ─── Column definitions ────────────────────────────────────────────────────────
// Each entry drives both the header and body render
const PRICE_COLUMNS = [
  { key: 'basic',        label: 'RAL 7035\nHammered',          group: 'basic',    groupLabel: 'Basic\nPainted',  span: 1 },
  { key: 'adderPainted', label: 'R9006 White Al\nTextured',    group: 'adder1',   groupLabel: 'Adder\nPainted', span: 1 },
  { key: 'hamm2060',     label: 'Hamm NCS\nS 2060-Y20R',       group: 'painted',  groupLabel: 'Painted',        span: 1 },
  { key: 'hamm1010',     label: 'Hamm NCS\nS 1010-Y30R',       group: 'painted',  groupLabel: null,             span: 0 },
  { key: 'hamm4550',     label: 'Hamm NCS\nS 4550-Y90R',       group: 'painted2', groupLabel: 'Painted',        span: 1 },
  { key: 'ral0808',      label: 'RAL 08 08\n005 Hammered',     group: 'painted3', groupLabel: 'Painted',        span: 1 },
  { key: 'ss441',        label: 'SS441\nHairline',             group: 'ss',       groupLabel: 'Adder\nSS',      span: 1 },
  { key: 'ss304h',       label: 'SS304\nHairline',             group: 'ss',       groupLabel: null,             span: 0 },
  { key: 'ss304m',       label: 'SS304\nMirror',               group: 'ss',       groupLabel: null,             span: 0 },
];

// Which groups are "SS" (red highlight)
const SS_GROUPS = new Set(['ss']);
// Which groups are "Adder Painted" (blue tint)
const ADDER_GROUPS = new Set(['adder1']);
// Which groups are main painted (teal tint)
const PAINTED_GROUPS = new Set(['painted', 'painted2', 'painted3']);

// ─── SchindlerMainTable ────────────────────────────────────────────────────────
const SchindlerMainTable = ({
  data,
  searchTerm,
  page,
  rowsPerPage,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Palette shortcuts
  const ssRed       = '#d32f2f';
  const ssRedLight  = alpha('#d32f2f', 0.08);
  const headerBg    = isDark ? theme.palette.background.paper : '#f8fafc';
  const paintedBg   = isDark ? alpha('#0d9488', 0.08) : alpha('#0d9488', 0.04);
  const adderBg     = isDark ? alpha('#1565c0', 0.08) : alpha('#1565c0', 0.04);
  const ssBg        = ssRedLight;

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    if (!data?.rows) return [];
    const s = searchTerm.toLowerCase();
    return data.rows.filter(r =>
      r.opening?.toLowerCase().includes(s) ||
      String(r.bt || '').includes(s) ||
      String(r.ht || '').includes(s) ||
      (r.extra || '').toLowerCase().includes(s)
    );
  }, [data, searchTerm]);

  // ── Pagination ───────────────────────────────────────────────────────────────
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  // ── Row-spans for "Opening" column ───────────────────────────────────────────
  const openingSpans = useMemo(() => calculateRowSpans(paginatedRows, 'opening'), [paginatedRows]);

  // ── Base cell styles ─────────────────────────────────────────────────────────
  const baseHeader = {
    fontWeight: 800,
    fontSize: '0.68rem',
    border: '1px solid',
    borderColor: 'divider',
    whiteSpace: 'pre-line',
    textAlign: 'center',
    py: 0.75,
    px: 1,
    lineHeight: 1.35,
  };

  const groupHeader = (bg, color = 'text.disabled') => ({
    ...baseHeader,
    bgcolor: bg,
    color,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontSize: '0.65rem',
  });

  const subHeader = (bg, color = 'text.secondary') => ({
    ...baseHeader,
    bgcolor: bg,
    color,
    fontSize: '0.67rem',
    fontWeight: 700,
  });

  const getCellBg = (col) => {
    if (SS_GROUPS.has(col.group))     return ssBg;
    if (ADDER_GROUPS.has(col.group))  return adderBg;
    if (PAINTED_GROUPS.has(col.group)) return paintedBg;
    return 'transparent';
  };

  const getCellColor = (col) => {
    if (SS_GROUPS.has(col.group)) return ssRed;
    return 'text.primary';
  };

  // ── Build group-row spans for the top header row ──────────────────────────────
  // Groups and their colspans: basic(1), adder1(1), painted(2), painted2(1), painted3(1), ss(3)
  const groupDefs = [
    { key: 'basic',   label: 'Basic\nPainted',  cols: 1, bg: headerBg,   color: '#455a64' },
    { key: 'adder1',  label: 'Adder\nPainted',  cols: 1, bg: adderBg,    color: '#1565c0' },
    { key: 'painted', label: 'Painted',         cols: 2, bg: paintedBg,  color: '#00695c' },
    { key: 'painted2',label: 'Painted',         cols: 1, bg: paintedBg,  color: '#00695c' },
    { key: 'painted3',label: 'Painted',         cols: 1, bg: paintedBg,  color: '#00695c' },
    { key: 'ss',      label: 'Adder\nSS',       cols: 3, bg: ssBg,       color: ssRed     },
  ];

  if (!data?.rows) return null;

  return (
    <TableContainer
      sx={{
        maxHeight: 650,
        overflow: 'auto',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: isDark
          ? '0 4px 24px 0 rgba(0,0,0,0.3)'
          : '0 4px 24px 0 rgba(0,0,0,0.06)',
      }}
    >
      <Table stickyHeader size="small" sx={{ minWidth: 1200 }}>
        {/* ═══════════════════════════ HEAD ════════════════════════════ */}
        <TableHead>

          {/* ── Row 0: Product title + H1 2026 badge ── */}
          <TableRow>
            {/* Opening / BT / HT span all 3 header rows */}
            <TableCell
              rowSpan={3}
              sx={{ ...baseHeader, bgcolor: headerBg, color: 'text.primary', fontWeight: 900, fontSize: '0.72rem', minWidth: 90 }}
            >
              Opening
            </TableCell>
            <TableCell
              rowSpan={3}
              sx={{ ...baseHeader, bgcolor: headerBg, color: 'text.primary', fontWeight: 900, fontSize: '0.72rem', minWidth: 60 }}
            >
              BT
            </TableCell>
            <TableCell
              rowSpan={3}
              sx={{ ...baseHeader, bgcolor: headerBg, color: 'text.primary', fontWeight: 900, fontSize: '0.72rem', minWidth: 60 }}
            >
              HT
            </TableCell>

            {/* Product name cell spanning all price columns */}
            <TableCell
              colSpan={9}
              sx={{
                ...baseHeader,
                bgcolor: isDark ? '#1a2332' : '#fff',
                borderBottom: 'none',
                py: 0.5,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    color: '#e53935',
                    fontStyle: 'italic',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Wittur Augusta
                </Typography>
                <Chip
                  label={data.halfYear || 'H1 2026'}
                  size="small"
                  sx={{
                    bgcolor: '#f9a825',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '0.7rem',
                    height: 22,
                    borderRadius: 1,
                  }}
                />
              </Stack>
            </TableCell>

            {/* Remark col */}
            <TableCell
              rowSpan={3}
              sx={{ ...baseHeader, bgcolor: headerBg, color: 'text.disabled', minWidth: 80 }}
            >
              Remark
            </TableCell>
          </TableRow>

          {/* ── Row 1: Group labels ── */}
          <TableRow>
            {groupDefs.map(g => (
              <TableCell
                key={g.key}
                colSpan={g.cols}
                sx={groupHeader(g.bg, g.color)}
              >
                {g.label}
              </TableCell>
            ))}
          </TableRow>

          {/* ── Row 2: Sub-column labels ── */}
          <TableRow>
            {PRICE_COLUMNS.map(col => (
              <TableCell
                key={col.key}
                sx={subHeader(getCellBg(col), SS_GROUPS.has(col.group) ? ssRed : 'text.secondary')}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* ═══════════════════════════ BODY ════════════════════════════ */}
        <TableBody>
          {paginatedRows.map((row, index) => {
            const showOpening = openingSpans[index] > 0;

            return (
              <TableRow
                key={row.id}
                hover
                sx={{
                  '&:hover': { bgcolor: isDark ? alpha('#fff', 0.02) : alpha('#0d9488', 0.02) },
                  '& td': {
                    border: '1px solid',
                    borderColor: 'divider',
                    py: 0.75,
                    px: 1,
                    fontSize: '0.72rem',
                  },
                }}
              >
                {/* Opening (row-grouped) */}
                {showOpening && (
                  <TableCell
                    rowSpan={openingSpans[index]}
                    align="center"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      bgcolor: isDark ? alpha('#fff', 0.04) : '#f1f5f9',
                      color: 'text.primary',
                      borderRight: '2px solid',
                      borderRightColor: 'divider',
                      verticalAlign: 'middle',
                    }}
                  >
                    {row.opening}
                  </TableCell>
                )}

                {/* BT */}
                <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {row.bt ?? ''}
                </TableCell>

                {/* HT / extra label */}
                <TableCell align="center" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {row.ht != null ? row.ht : (row.extra ? (
                    <Box
                      sx={{
                        display: 'inline-block',
                        bgcolor: isDark ? alpha('#fff', 0.06) : '#e8f5e9',
                        color: '#2e7d32',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.extra}
                    </Box>
                  ) : '')}
                </TableCell>

                {/* Price columns */}
                {PRICE_COLUMNS.map(col => {
                  const val = row[col.key];
                  const isSSCol = SS_GROUPS.has(col.group);
                  return (
                    <TableCell
                      key={col.key}
                      align="right"
                      sx={{
                        fontWeight: isSSCol ? 800 : 600,
                        color: isSSCol ? ssRed : 'text.primary',
                        bgcolor: isSSCol ? ssBg : 'transparent',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fmt(val)}
                    </TableCell>
                  );
                })}

                {/* Remark */}
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
                  {row.remark || ''}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SchindlerMainTable;
