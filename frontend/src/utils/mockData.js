import { DEFECT_TYPES, SEVERITY_LEVELS, PROCESSING_STATES, REVIEW_STATUS } from './constants';

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

export const generateDefectId = () => `DEF-${Date.now()}-${randomInt(100, 999)}`;
export const generateReportId = () => `RPT-${Date.now()}-${randomInt(100, 999)}`;

export const generateMockDefect = (videoId, frameNumber) => {
    const defectType = randomChoice(DEFECT_TYPES);
    const severity = randomChoice(SEVERITY_LEVELS);
    const confidence = randomInt(62, 99);

    return {
        id: generateDefectId(),
        videoId,
        frameNumber: frameNumber || randomInt(1, 300),
        type: defectType.id,
        typeLabel: defectType.label,
        typeColor: defectType.color,
        severity: severity.id,
        severityLabel: severity.label,
        severityColor: severity.color,
        confidence,
        coordinates: {
            x: randomInt(50, 600),
            y: randomInt(50, 400),
            width: randomInt(40, 200),
            height: randomInt(40, 150),
        },
        timestamp: new Date().toISOString(),
        reviewStatus: REVIEW_STATUS.PENDING,
        notes: '',
    };
};

export const generateMockDefects = (videoId, count = null) => {
    const numDefects = count || randomInt(5, 15);
    const defects = [];
    for (let i = 0; i < numDefects; i++) {
        defects.push(generateMockDefect(videoId, randomInt(1, 300)));
    }
    return defects.sort((a, b) => a.frameNumber - b.frameNumber);
};

export const generateMockReport = (missionName, defects, generatedBy) => ({
    id: generateReportId(),
    missionName: missionName || `Mission ${randomInt(1, 100)}`,
    generationDate: new Date().toISOString(),
    generatedBy: generatedBy || 'inspector',
    totalDefects: defects.length,
    severityDistribution: {
        low: defects.filter(d => d.severity === 'low').length,
        medium: defects.filter(d => d.severity === 'medium').length,
        high: defects.filter(d => d.severity === 'high').length,
        critical: defects.filter(d => d.severity === 'critical').length,
    },
    avgConfidence: defects.length ? Math.round(defects.reduce((sum, d) => sum + d.confidence, 0) / defects.length) : 0,
    status: 'completed',
});

export const INITIAL_MOCK_VIDEOS = [
    {
        id: 'vid-001',
        name: 'Bridge_Inspection_Feb2024.mp4',
        missionName: 'Golden Gate Bridge Inspection',
        location: 'San Francisco, CA',
        size: 245 * 1024 * 1024,
        uploadDate: '2024-02-10T09:30:00Z',
        status: PROCESSING_STATES.COMPLETED,
        progress: 100,
        totalFrames: 240,
        duration: '4:00',
    },
    {
        id: 'vid-002',
        name: 'Highway_Overpass_Scan.mp4',
        missionName: 'Highway 101 Overpass',
        location: 'Los Angeles, CA',
        size: 189 * 1024 * 1024,
        uploadDate: '2024-02-11T14:15:00Z',
        status: PROCESSING_STATES.COMPLETED,
        progress: 100,
        totalFrames: 180,
        duration: '3:00',
    },
    {
        id: 'vid-003',
        name: 'Dam_Survey_Jan2024.mp4',
        missionName: 'Hoover Dam Annual Survey',
        location: 'Nevada/Arizona Border',
        size: 312 * 1024 * 1024,
        uploadDate: '2024-02-12T08:00:00Z',
        status: PROCESSING_STATES.PROCESSING,
        progress: 67,
        totalFrames: 360,
        duration: '6:00',
    },
];

export const INITIAL_MOCK_DEFECTS = [
    ...generateMockDefects('vid-001', 8),
    ...generateMockDefects('vid-002', 6),
];

export const INITIAL_MOCK_REPORTS = [
    {
        id: 'RPT-001',
        missionName: 'Golden Gate Bridge Inspection',
        generationDate: '2024-02-10T16:30:00Z',
        generatedBy: 'admin',
        totalDefects: 8,
        severityDistribution: { low: 2, medium: 3, high: 2, critical: 1 },
        avgConfidence: 87,
        status: 'completed',
    },
    {
        id: 'RPT-002',
        missionName: 'Highway 101 Overpass',
        generationDate: '2024-02-11T18:00:00Z',
        generatedBy: 'inspector',
        totalDefects: 6,
        severityDistribution: { low: 1, medium: 2, high: 2, critical: 1 },
        avgConfidence: 82,
        status: 'completed',
    },
];
