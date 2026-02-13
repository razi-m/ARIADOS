import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, CheckCircle, XCircle, Clock, Loader2, RotateCw } from 'lucide-react';
import Badge from '../common/Badge';
import { formatFileSize, formatDateTime } from '../../utils/formatters';
import { PROCESSING_STATES } from '../../utils/constants';

const statusConfig = {
    [PROCESSING_STATES.QUEUED]: { icon: Clock, label: 'Queued', variant: 'queued' },
    [PROCESSING_STATES.UPLOADING]: { icon: Loader2, label: 'Uploading', variant: 'processing' },
    [PROCESSING_STATES.PROCESSING]: { icon: Loader2, label: 'Processing', variant: 'processing' },
    [PROCESSING_STATES.ANALYZING]: { icon: Loader2, label: 'Analyzing', variant: 'processing' },
    [PROCESSING_STATES.COMPLETED]: { icon: CheckCircle, label: 'Completed', variant: 'completed' },
    [PROCESSING_STATES.FAILED]: { icon: XCircle, label: 'Failed', variant: 'failed' },
};

const ProcessingQueue = memo(({ videos, title = 'Processing Queue', onRetry }) => {
    return (
        <div className="space-y-3">
            <AnimatePresence>
                {videos.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-gray-500"
                    >
                        <Film className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No videos in queue</p>
                    </motion.div>
                ) : (
                    videos.map((video, index) => {
                        const config = statusConfig[video.status] || statusConfig[PROCESSING_STATES.QUEUED];
                        const StatusIcon = config.icon;
                        const isProcessing = [PROCESSING_STATES.UPLOADING, PROCESSING_STATES.PROCESSING, PROCESSING_STATES.ANALYZING].includes(video.status);

                        return (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
                            >
                                {/* Thumbnail placeholder */}
                                <div className="w-16 h-12 rounded-lg bg-dark-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    <Film className="w-5 h-5 text-gray-600" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{video.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(video.size)} • {formatDateTime(video.uploadDate)}
                                    </p>

                                    {/* Progress bar */}
                                    {isProcessing && (
                                        <div className="mt-1.5 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${video.progress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    {isProcessing && (
                                        <span className="text-xs text-cyan-400 font-mono">{video.progress}%</span>
                                    )}
                                    <Badge variant={config.variant} size="xs" dot>
                                        {config.label}
                                    </Badge>
                                    {video.status === PROCESSING_STATES.FAILED && onRetry && (
                                        <button
                                            onClick={() => onRetry(video.id)}
                                            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-1"
                                        >
                                            <RotateCw className="w-3 h-3" /> Retry
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </AnimatePresence>
        </div>
    );
});

ProcessingQueue.displayName = 'ProcessingQueue';
export default ProcessingQueue;
