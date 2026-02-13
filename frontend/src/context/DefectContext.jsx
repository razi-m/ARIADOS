import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { REVIEW_STATUS } from '../utils/constants';
import { INITIAL_MOCK_DEFECTS } from '../utils/mockData';
import { useVideos } from './VideoContext';

const DefectContext = createContext(null);

export const useDefects = () => {
    const context = useContext(DefectContext);
    if (!context) throw new Error('useDefects must be used within DefectProvider');
    return context;
};

export const DefectProvider = ({ children }) => {
    const { setDefectCallback } = useVideos();
    const [defects, setDefects] = useState(() => {
        try {
            const stored = localStorage.getItem('ariados_defects');
            return stored ? JSON.parse(stored) : INITIAL_MOCK_DEFECTS;
        } catch {
            return INITIAL_MOCK_DEFECTS;
        }
    });

    const saveDefects = useCallback((updated) => {
        setDefects(updated);
        try { localStorage.setItem('ariados_defects', JSON.stringify(updated)); } catch { }
    }, []);

    const addDefects = useCallback((newDefects) => {
        setDefects(prev => {
            const updated = [...prev, ...newDefects];
            try { localStorage.setItem('ariados_defects', JSON.stringify(updated)); } catch { }
            return updated;
        });
    }, []);

    const updateDefectStatus = useCallback((defectId, status) => {
        setDefects(prev => {
            const updated = prev.map(d =>
                d.id === defectId ? { ...d, reviewStatus: status } : d
            );
            try { localStorage.setItem('ariados_defects', JSON.stringify(updated)); } catch { }
            return updated;
        });
    }, []);

    // Register callback with VideoContext to receive defects from analysis
    useEffect(() => {
        setDefectCallback(addDefects);
    }, [setDefectCallback, addDefects]);

    const approveDefect = useCallback((defectId) => {
        updateDefectStatus(defectId, REVIEW_STATUS.APPROVED);
    }, [updateDefectStatus]);

    const flagFalsePositive = useCallback((defectId) => {
        updateDefectStatus(defectId, REVIEW_STATUS.FALSE_POSITIVE);
    }, [updateDefectStatus]);

    const requestReanalysis = useCallback((defectId) => {
        updateDefectStatus(defectId, REVIEW_STATUS.REANALYSIS);
    }, [updateDefectStatus]);

    const metrics = useMemo(() => {
        const total = defects.length;
        const critical = defects.filter(d => d.severity === 'critical').length;
        const high = defects.filter(d => d.severity === 'high').length;
        const medium = defects.filter(d => d.severity === 'medium').length;
        const low = defects.filter(d => d.severity === 'low').length;
        const avgConfidence = total ? Math.round(defects.reduce((s, d) => s + d.confidence, 0) / total) : 0;
        const pending = defects.filter(d => d.reviewStatus === REVIEW_STATUS.PENDING).length;
        const approved = defects.filter(d => d.reviewStatus === REVIEW_STATUS.APPROVED).length;

        return { total, critical, high, medium, low, avgConfidence, pending, approved };
    }, [defects]);

    const value = {
        defects,
        metrics,
        addDefects,
        approveDefect,
        flagFalsePositive,
        requestReanalysis,
        updateDefectStatus,
    };

    return (
        <DefectContext.Provider value={value}>
            {children}
        </DefectContext.Provider>
    );
};
