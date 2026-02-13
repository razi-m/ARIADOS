import React, { memo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Rocket } from 'lucide-react';
import Card from '../components/common/Card';
import DropZone from '../components/upload/DropZone';
import MissionForm from '../components/upload/MissionForm';
import ProcessingQueue from '../components/upload/ProcessingQueue';
import { useVideos } from '../context/VideoContext';
import { useDefects } from '../context/DefectContext';
import { useToast } from '../components/common/Toast';
import { PROCESSING_STATES } from '../utils/constants';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const UploadPage = memo(() => {
    const { videos, addVideo, startProcessing, setDefectCallback } = useVideos();
    const { addDefects } = useDefects();
    const toast = useToast();
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        setDefectCallback((newDefects) => {
            addDefects(newDefects);
            toast.success(`AI Analysis complete! Found ${newDefects.length} defects.`);
        });
    }, [setDefectCallback, addDefects, toast]);

    const handleFileSelect = useCallback((file) => {
        setSelectedFile(file);
    }, []);

    const handleMissionSubmit = useCallback((missionData) => {
        if (!selectedFile) {
            toast.warning('Please select a video file first');
            return;
        }

        const video = addVideo(selectedFile, missionData);
        toast.info(`Video "${selectedFile.name}" added to queue`);
        setSelectedFile(null);

        // Auto-start processing
        setTimeout(() => {
            startProcessing(video.id);
        }, 500);
    }, [selectedFile, addVideo, startProcessing, toast]);

    const defectQueue = videos.filter(v => v.status === PROCESSING_STATES.COMPLETED);
    const processingQueue = videos.filter(v =>
        [PROCESSING_STATES.QUEUED, PROCESSING_STATES.UPLOADING, PROCESSING_STATES.PROCESSING, PROCESSING_STATES.ANALYZING, PROCESSING_STATES.FAILED].includes(v.status)
    );

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
            <motion.div variants={container} initial="hidden" animate="show">
                {/* Page Header */}
                <motion.div variants={item} className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                        <Upload className="w-8 h-8 text-cyan-400" />
                        Mission Control
                    </h1>
                    <p className="text-gray-400 mt-2">Upload drone footage and start AI-powered analysis</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-6">
                        <motion.div variants={item}>
                            <Card title="Video Upload" icon={Upload} animate={false}>
                                <DropZone onFileSelect={handleFileSelect} />
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card title="Mission Metadata Form" icon={Rocket} animate={false}>
                                <MissionForm
                                    onSubmit={handleMissionSubmit}
                                    disabled={!selectedFile}
                                />
                            </Card>
                        </motion.div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        <motion.div variants={item}>
                            <Card title="Defect Queue" action="View All" animate={false}>
                                <ProcessingQueue videos={defectQueue.slice(0, 5)} title="Completed" />
                            </Card>
                        </motion.div>

                        <motion.div variants={item}>
                            <Card title="Processing Queue" action="View All" animate={false}>
                                <ProcessingQueue
                                    videos={processingQueue}
                                    title="Processing"
                                    onRetry={(id) => startProcessing(id)}
                                />
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

UploadPage.displayName = 'UploadPage';
export default UploadPage;
