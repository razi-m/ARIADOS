export const APP_NAME = 'ARIADOS';

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    UPLOAD: '/upload',
    REPORT_VIEWER: '/reports/:id',
    REPORT_HISTORY: '/reports/history',
    ADMIN: '/admin',
};

export const ROLES = {
    ADMIN: 'admin',
    INSPECTOR: 'inspector',
};

export const DEFECT_TYPES = [
    { id: 'crack', label: 'Crack', color: '#ff3366' },
    { id: 'corrosion', label: 'Corrosion', color: '#ffaa00' },
    { id: 'spalling', label: 'Spalling', color: '#ff6b35' },
    { id: 'deformation', label: 'Deformation', color: '#8b5cf6' },
    { id: 'erosion', label: 'Erosion', color: '#06b6d4' },
    { id: 'settlement', label: 'Settlement', color: '#ec4899' },
];

export const SEVERITY_LEVELS = [
    { id: 'low', label: 'Low', color: '#00ff88', className: 'severity-low' },
    { id: 'medium', label: 'Medium', color: '#ffaa00', className: 'severity-medium' },
    { id: 'high', label: 'High', color: '#ff6b35', className: 'severity-high' },
    { id: 'critical', label: 'Critical', color: '#ff3366', className: 'severity-critical' },
];

export const PROCESSING_STATES = {
    QUEUED: 'queued',
    UPLOADING: 'uploading',
    PROCESSING: 'processing',
    ANALYZING: 'analyzing',
    COMPLETED: 'completed',
    FAILED: 'failed',
};

export const REVIEW_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    FALSE_POSITIVE: 'false_positive',
    REANALYSIS: 'reanalysis',
};

export const ACCEPTED_VIDEO_FORMATS = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export const PAGINATION_OPTIONS = [10, 25, 50, 100];

export const DEFAULT_USERS = [
    { id: 1, username: 'admin', password: 'admin123', email: 'admin@ariados.com', role: ROLES.ADMIN, status: 'active' },
    { id: 2, username: 'inspector', password: 'inspect123', email: 'inspector@ariados.com', role: ROLES.INSPECTOR, status: 'active' },
    { id: 3, username: 'john_doe', password: 'john123', email: 'john@ariados.com', role: ROLES.INSPECTOR, status: 'active' },
];

export const WORKFLOW_STEPS = [
    { id: 1, icon: 'drone', label: 'Drone Capture' },
    { id: 2, icon: 'cpu', label: 'AI Processing' },
    { id: 3, icon: 'search', label: 'Detection' },
    { id: 4, icon: 'file-text', label: 'Reports' },
    { id: 5, icon: 'layout-dashboard', label: 'Dashboard' },
];
