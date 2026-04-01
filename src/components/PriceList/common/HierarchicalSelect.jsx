import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Popover,
  OutlinedInput,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Chip,
  alpha,
  useTheme,
  InputAdornment,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Recursive Tree Node Component
const TreeNode = ({ node, level, expanded, toggleExpand, selectedNodes, handleSelect }) => {
  const theme = useTheme();
  const isExpanded = expanded.includes(node.id);
  const isSelected = selectedNodes.some((n) => n.id === node.id);

  if (node.isLeaf) {
    return (
      <ListItem
        button
        onClick={() => handleSelect(node)}
        sx={{
          pl: level * 3 + 2,
          py: 0.8,
          bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.08) },
        }}
      >
        <ListItemText
          primary={node.label}
          primaryTypographyProps={{
            fontSize: '0.85rem',
            fontWeight: isSelected ? 600 : 500,
            color: isSelected ? theme.palette.primary.main : 'text.primary',
          }}
        />
      </ListItem>
    );
  }

  return (
    <>
      <ListItem
        button
        onClick={() => toggleExpand(node.id)}
        sx={{ pl: level * 3 + 1, py: 0.8 }}
      >
        <ListItemIcon sx={{ minWidth: 28 }}>
          {isExpanded ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText
          primary={node.label}
          primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600, color: 'text.primary' }}
        />
      </ListItem>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              toggleExpand={toggleExpand}
              selectedNodes={selectedNodes}
              handleSelect={handleSelect}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

// Main Dropdown Component
const HierarchicalSelect = ({ options, value, onChange, placeholder = 'Select items...' }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
     // Optional: expand all level 1 nodes by default
     if (options && options.length > 0 && expanded.length === 0) {
        setExpanded(options.map(opt => opt.id));
     }
  }, [options, expanded.length]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'hierarchical-select-popover' : undefined;

  const toggleExpand = (nodeId) => {
    setExpanded((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const handleSelect = (node) => {
    const isAlreadySelected = value.some((n) => n.id === node.id);
    let newSelection;
    if (isAlreadySelected) {
      newSelection = value.filter((n) => n.id !== node.id);
    } else {
      newSelection = [...value, node];
    }
    onChange(newSelection);
  };

  const handleDelete = (e, nodeToRemove) => {
    e.stopPropagation();
    onChange(value.filter((n) => n.id !== nodeToRemove.id));
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Box sx={{ minWidth: 320, maxWidth: 600, width: '100%' }}>
      <OutlinedInput
        ref={inputRef}
        onClick={handleClick}
        fullWidth
        readOnly
        placeholder={value.length === 0 ? placeholder : ''}
        size="small"
        sx={{
          borderRadius: 2.5,
          cursor: 'pointer',
          bgcolor: 'background.paper',
          px: 1,
          py: 0.5,
          minHeight: 44, // maintain height even without chips
          alignItems: 'center',
          '& .MuiOutlinedInput-input': {
            cursor: 'pointer',
            padding: 0,
            display: value.length === 0 ? 'block' : 'none', 
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: open ? theme.palette.primary.main : alpha(theme.palette.divider, 0.8),
            borderWidth: open ? 2 : 1,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        }}
        startAdornment={
          value.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 0.5, maxWidth: 'calc(100% - 60px)' }}>
              {value.map((node) => {
                // Show a path-like label if possible, e.g., LD -> Telescopic
                const chipLabel = node.chipLabel || node.label;
                return (
                  <Chip
                    key={node.id}
                    label={chipLabel}
                    onDelete={(e) => handleDelete(e, node)}
                    onMouseDown={(e) => e.stopPropagation()}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.dark,
                      fontWeight: 600,
                      borderRadius: 1.5,
                      height: 24,
                      '& .MuiChip-deleteIcon': {
                        color: alpha(theme.palette.primary.main, 0.5),
                        '&:hover': {
                          color: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                );
              })}
            </Box>
          )
        }
        endAdornment={
          <InputAdornment position="end" sx={{ position: 'absolute', right: 8 }}>
            {value.length > 0 && (
              <IconButton size="small" onClick={handleClearAll} onMouseDown={(e) => e.stopPropagation()} edge="end" sx={{ mr: 0, p: 0.5 }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" edge="end" sx={{ pointerEvents: 'none', p: 0.5 }}>
              <KeyboardArrowDownIcon 
                sx={{ 
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  color: open ? theme.palette.primary.main : 'action.active'
                }} 
              />
            </IconButton>
          </InputAdornment>
        }
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            width: inputRef.current ? inputRef.current.clientWidth : 320,
            maxHeight: 400,
            overflowY: 'auto',
            borderRadius: 2.5,
            boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
          },
        }}
      >
        <List component="nav" disablePadding sx={{ py: 1 }}>
          {options.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              expanded={expanded}
              toggleExpand={toggleExpand}
              selectedNodes={value}
              handleSelect={handleSelect}
            />
          ))}
          {(!options || options.length === 0) && (
            <ListItem>
              <ListItemText 
                primary="No items found" 
                primaryTypographyProps={{ align: 'center', color: 'text.secondary', fontSize: '0.85rem' }} 
              />
            </ListItem>
          )}
        </List>
      </Popover>
    </Box>
  );
};

export default HierarchicalSelect;
