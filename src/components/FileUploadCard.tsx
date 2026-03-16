import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadCardProps {
  title: string;
  subtitle?: string;
  onFileSelect: (file: File | null) => void;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({ title, subtitle, onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const removeFile = (e: React.MouseEvent) => {
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
  } as any);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{title}</h3>

      <div
        {...getRootProps()}
        className={cn(
          "flex-1 border-2 border-dashed rounded-md flex flex-col items-center justify-center p-8 transition-colors cursor-pointer",
          isDragActive ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50",
          file ? "border-primary/30 bg-primary/5" : ""
        )}
      >
        <input {...getInputProps()} />

        {file ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-slate-700 max-w-[200px] truncate">{file.name}</p>
            <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            <button
              onClick={removeFile}
              className="mt-4 text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
            <p className="text-sm font-medium text-slate-600">Select or Drag & Drop file here</p>
            <button className="mt-4 px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors">
              Choose File
            </button>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-4 text-xs text-slate-400 font-mono uppercase tracking-wider">
          {subtitle}
        </p>
      )}
    </div>
  );
};
