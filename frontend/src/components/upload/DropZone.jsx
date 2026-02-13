import React, { memo, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Film, X, CheckCircle, AlertCircle } from 'lucide-react';
import { validateVideoFile } from '../../utils/validation';
import { formatFileSize } from '../../utils/formatters';

const DropZone = memo(({ onFileSelect }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFile = useCallback((file) => {
        const errors = validateVideoFile(file);
        if (errors.length > 0) {
            setError(errors[0]);
            setSelectedFile(null);
            return;
        }
        setError(null);
        setSelectedFile(file);
        onFileSelect?.(file);
    }, [onFileSelect]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    }, [processFile]);

    const handleFileInput = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    }, [processFile]);

    const clearFile = useCallback(() => {
        setSelectedFile(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = '';
    }, []);

    return (
        <div className="space-y-4">
            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${isDragging
                    ? 'border-cyan-400 bg-cyan-400/5 shadow-glow'
                    : error
                        ? 'border-red-500/30 bg-red-500/5'
                        : selectedFile
                            ? 'border-green-500/30 bg-green-500/5'
                            : 'border-white/20 hover:border-cyan-400/50 bg-white/[0.02]'
                    }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                    onChange={handleFileInput}
                    className="hidden"
                />

                <motion.div
                    animate={isDragging ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedFile ? 'bg-green-500/20' : 'bg-cyan-400/10'
                        }`}>
                        {selectedFile ? (
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        ) : (
                            <UploadCloud className="w-8 h-8 text-cyan-400" />
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                            {selectedFile ? selectedFile.name : 'Drag & Drop Video Upload'}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {selectedFile
                                ? formatFileSize(selectedFile.size)
                                : 'Accepts file types: MP4, MOV, AVI'}
                        </p>
                    </div>

                    {!selectedFile && (
                        <p className="text-xs text-gray-500 mt-2">
                            Accepts file types: MP4, MOV (500MB max)
                        </p>
                    )}
                </motion.div>

                {selectedFile && (
                    <button
                        onClick={(e) => { e.stopPropagation(); clearFile(); }}
                        className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </motion.div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm"
                >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </motion.div>
            )}
        </div>
    );
});

DropZone.displayName = 'DropZone';
export default DropZone;
