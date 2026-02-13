import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_MOCK_REPORTS, generateMockReport } from '../utils/mockData';

const ReportContext = createContext(null);

export const useReports = () => {
    const context = useContext(ReportContext);
    if (!context) throw new Error('useReports must be used within ReportProvider');
    return context;
};

export const ReportProvider = ({ children }) => {
    const [reports, setReports] = useState(() => {
        try {
            const stored = localStorage.getItem('ariados_reports');
            return stored ? JSON.parse(stored) : INITIAL_MOCK_REPORTS;
        } catch {
            return INITIAL_MOCK_REPORTS;
        }
    });
    const [generating, setGenerating] = useState(false);

    const saveReports = useCallback((updated) => {
        setReports(updated);
        try { localStorage.setItem('ariados_reports', JSON.stringify(updated)); } catch { }
    }, []);

    const generateReport = useCallback(async (missionName, defects, generatedBy) => {
        setGenerating(true);
        // Simulate generation time
        await new Promise(r => setTimeout(r, 1500));

        const report = generateMockReport(missionName, defects, generatedBy);

        setReports(prev => {
            const updated = [report, ...prev];
            try { localStorage.setItem('ariados_reports', JSON.stringify(updated)); } catch { }
            return updated;
        });

        setGenerating(false);
        return report;
    }, []);

    const getReportById = useCallback((id) => {
        return reports.find(r => r.id === id) || null;
    }, [reports]);

    const deleteReport = useCallback((id) => {
        setReports(prev => {
            const updated = prev.filter(r => r.id !== id);
            try { localStorage.setItem('ariados_reports', JSON.stringify(updated)); } catch { }
            return updated;
        });
    }, []);

    const value = {
        reports,
        generating,
        generateReport,
        getReportById,
        deleteReport,
    };

    return (
        <ReportContext.Provider value={value}>
            {children}
        </ReportContext.Provider>
    );
};
