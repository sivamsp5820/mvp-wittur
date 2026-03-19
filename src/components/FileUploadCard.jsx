import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X } from 'lucide-react';
import { Card, CardContent, Typography, Box, Button, IconButton, Stack, alpha } from '@mui/material';

export const FileUploadCard = ({ title, subtitle, onFileSelect }) => {
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    onFileSelect(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          {title}
        </Typography>

        <Box
          {...getRootProps()}
          sx={{
            flex: 1,
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'divider',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            transition: 'all 0.2s',
            cursor: 'pointer',
            bgcolor: isDragActive ? alpha('#0d9488', 0.05) : (file ? alpha('#0d9488', 0.05) : 'transparent'),
            '&:hover': {
              borderColor: 'primary.light',
              bgcolor: alpha('#0d9488', 0.02),
            },
            ...(file && { borderColor: alpha('#0d9488', 0.3) })
          }}
        >
          <input {...getInputProps()} />

          {file ? (
            <Stack spacing={1} alignItems="center" textAlign="center">
              <Box
                sx={{
                  w: 48,
                  h: 48,
                  bgcolor: alpha('#0d9488', 0.1),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                  p: 1.5
                }}
              >
                <FileText color="#0d9488" />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: 200, noWrap: true }}>
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(file.size / 1024).toFixed(1)} KB
              </Typography>
              <Button
                size="small"
                color="error"
                startIcon={<X size={14} />}
                onClick={removeFile}
                sx={{ mt: 2, textTransform: 'none' }}
              >
                Remove
              </Button>
            </Stack>
          ) : (
            <Stack spacing={2} alignItems="center" textAlign="center">
              <UploadCloud size={48} color="#94a3b8" />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Select or Drag & Drop file here
              </Typography>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  mt: 2,
                  bgcolor: '#0d9488',
                  '&:hover': { bgcolor: '#0f766e' },
                  textTransform: 'none',
                  px: 3
                }}
              >
                Choose File
              </Button>
            </Stack>
          )}
        </Box>

        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              mt: 2,
              color: 'text.disabled',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
