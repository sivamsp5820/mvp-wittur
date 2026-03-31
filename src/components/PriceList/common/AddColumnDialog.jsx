import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Divider,
  Typography,
  Stack
} from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';

const AddColumnDialog = ({ open, onClose, onSubmit }) => {
  const [newColumnCount, setNewColumnCount] = useState('');
  const [newColumnNames, setNewColumnNames] = useState([]);

  // Clear state when dialog opens
  useEffect(() => {
    if (open) {
      setNewColumnCount('');
      setNewColumnNames([]);
    }
  }, [open]);

  const handleColumnCountChange = (val) => {
    setNewColumnCount(val);
    const count = parseInt(val);
    if (!isNaN(count) && count > 0) {
      setNewColumnNames(Array(count).fill(''));
    } else {
      setNewColumnNames([]);
    }
  };

  const handleColumnNameChange = (index, value) => {
    const updated = [...newColumnNames];
    updated[index] = value;
    setNewColumnNames(updated);
  };

  const handleSubmit = () => {
    const count = parseInt(newColumnCount);
    if (isNaN(count) || count <= 0) return;

    if (newColumnNames.some(name => !name.trim())) {
      alert('Please fill all column names.');
      return;
    }

    const timestamp = Date.now();
    const newCols = newColumnNames.map((name, i) => ({
      id: `dyn_${timestamp}_${i}`,
      name: name.trim()
    }));

    onSubmit(newCols);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
        Additional Price Impact Fields
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Price Impact Values Field Count"
          type="number"
          value={newColumnCount}
          onChange={(e) => handleColumnCountChange(e.target.value)}
          size="small"
          sx={{ mt: 2, mb: 3 }}
          autoFocus
        />

        <AnimatePresence>
          {newColumnNames.length > 0 && (
            <Box component={motion.div} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} sx={{ mt: 1 }}>
              <Divider sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled' }}>Column Names</Typography>
              </Divider>
              <Stack spacing={2} sx={{ maxHeight: 300, overflow: 'auto', px: 0.5, py: 1 }}>
                {newColumnNames.map((name, index) => (
                  <TextField
                    key={index}
                    fullWidth
                    label={`Column Name ${index + 1}`}
                    variant="outlined"
                    size="small"
                    value={name}
                    onChange={(e) => handleColumnNameChange(index, e.target.value)}
                    required
                  />
                ))}
              </Stack>
            </Box>
          )}
        </AnimatePresence>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ fontWeight: 700, color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disableElevation
          disabled={!newColumnCount || newColumnNames.some(n => !n.trim())}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Add Columns
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddColumnDialog;
