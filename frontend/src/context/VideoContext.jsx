import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { PROCESSING_STATES } from '../utils/constants';
import { generateMockDefects } from '../utils/mockData';
import { generateId } from '../utils/helpers';
import { INITIAL_MOCK_VIDEOS } from '../utils/mockData';

const VideoContext = createContext(null);

export const useVideos = () => {
    const context = useContext(VideoContext);
    if (!context) throw new Error('useVideos must be used within VideoProvider');
    return context;
};

export const VideoProvider = ({ children }) => {
    const [videos, setVideos] = useState(() => {
        try {
            const stored = localStorage.getItem('ariados_videos');
            return stored ? JSON.parse(stored) : INITIAL_MOCK_VIDEOS;
        } catch {
            return INITIAL_MOCK_VIDEOS;
        }
    });
    const [processingId, setProcessingId] = useState(null);
    const intervalRef = useRef(null);
    const defectCallbackRef = useRef(null);

    const setDefectCallback = useCallback((cb) => {
        defectCallbackRef.current = cb;
    }, []);

    const saveVideos = useCallback((newVideos) => {
        setVideos(newVideos);
        try {
            localStorage.setItem('ariados_videos', JSON.stringify(newVideos));
        } catch { /* ignore */ }
    }, []);

    const addVideo = useCallback((file, missionData) => {
        const video = {
            id: `vid-${generateId()}`,
            name: file.name,
            missionName: missionData.missionName || file.name,
            location: missionData.location || 'Unknown',
            size: file.size,
            uploadDate: new Date().toISOString(),
            status: PROCESSING_STATES.QUEUED,
            progress: 0,
            totalFrames: Math.floor(Math.random() * 200) + 100,
            duration: `${Math.floor(Math.random() * 5) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        };

        setVideos(prev => {
            const updated = [video, ...prev];
            try { localStorage.setItem('ariados_videos', JSON.stringify(updated)); } catch { }
            return updated;
        });

        return video;
    }, []);

    const startProcessing = useCallback((videoId) => {
        setProcessingId(videoId);

        setVideos(prev => {
            const updated = prev.map(v =>
                v.id === videoId ? { ...v, status: PROCESSING_STATES.PROCESSING, progress: 0 } : v
            );
            try { localStorage.setItem('ariados_videos', JSON.stringify(updated)); } catch { }
            return updated;
        });

        let progress = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            progress += Math.floor(Math.random() * 8) + 3;

            if (progress >= 100) {
                progress = 100;
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setProcessingId(null);

                setVideos(prev => {
                    const updated = prev.map(v =>
                        v.id === videoId ? { ...v, status: PROCESSING_STATES.COMPLETED, progress: 100 } : v
                    );
                    try { localStorage.setItem('ariados_videos', JSON.stringify(updated)); } catch { }
                    return updated;
                });

                // Generate defects via callback
                const defects = generateMockDefects(videoId);
                if (defectCallbackRef.current) {
                    defectCallbackRef.current(defects);
                }
            } else {
                const currentStatus = progress < 30 ? PROCESSING_STATES.UPLOADING
                    : progress < 70 ? PROCESSING_STATES.PROCESSING
                        : PROCESSING_STATES.ANALYZING;

                setVideos(prev => {
                    const updated = prev.map(v =>
                        v.id === videoId ? { ...v, status: currentStatus, progress } : v
                    );
                    try { localStorage.setItem('ariados_videos', JSON.stringify(updated)); } catch { }
                    return updated;
                });
            }
        }, 500);
    }, []);

    const removeVideo = useCallback((videoId) => {
        setVideos(prev => {
            const updated = prev.filter(v => v.id !== videoId);
            try { localStorage.setItem('ariados_videos', JSON.stringify(updated)); } catch { }
            return updated;
        });
    }, []);

    const completedVideos = videos.filter(v => v.status === PROCESSING_STATES.COMPLETED);
    const processingVideos = videos.filter(v =>
        [PROCESSING_STATES.QUEUED, PROCESSING_STATES.UPLOADING, PROCESSING_STATES.PROCESSING, PROCESSING_STATES.ANALYZING].includes(v.status)
    );

    const value = {
        videos,
        processingId,
        completedVideos,
        processingVideos,
        addVideo,
        startProcessing,
        removeVideo,
        setDefectCallback,
    };

    return (
        <VideoContext.Provider value={value}>
            {children}
        </VideoContext.Provider>
    );
};
