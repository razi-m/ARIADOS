import { useMemo } from 'react';
import { useDefects } from '../context/DefectContext';
import { useVideos } from '../context/VideoContext';
import { useReports } from '../context/ReportContext';

export default function useMetrics() {
    const { defects, metrics: defectMetrics } = useDefects();
    const { videos, completedVideos } = useVideos();
    const { reports } = useReports();

    const metrics = useMemo(() => ({
        totalDefects: defectMetrics.total,
        criticalIssues: defectMetrics.critical,
        avgConfidence: defectMetrics.avgConfidence,
        videosProcessed: completedVideos.length,
        reportsGenerated: reports.length,
        trends: {
            defects: defectMetrics.total > 5 ? '+12%' : '+3%',
            critical: defectMetrics.critical > 2 ? '+8%' : '-2%',
            videos: '+5%',
            reports: '+15%',
        },
    }), [defectMetrics, completedVideos, reports]);

    return metrics;
}
