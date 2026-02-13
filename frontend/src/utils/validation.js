import { ACCEPTED_VIDEO_FORMATS, MAX_FILE_SIZE } from './constants';

export const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
};

export const validateRequired = (value) => {
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== null && value !== undefined;
};

export const validateVideoFile = (file) => {
    const errors = [];
    if (!file) {
        errors.push('No file selected');
        return errors;
    }
    if (!ACCEPTED_VIDEO_FORMATS.includes(file.type)) {
        errors.push(`Invalid file type. Accepted: MP4, MOV, AVI, WebM`);
    }
    if (file.size > MAX_FILE_SIZE) {
        errors.push(`File too large. Maximum size: 500MB`);
    }
    return errors;
};

export const validateLoginForm = (username, password) => {
    const errors = {};
    if (!validateRequired(username)) errors.username = 'Username is required';
    if (!validateRequired(password)) errors.password = 'Password is required';
    return errors;
};

export const validateUserForm = (data) => {
    const errors = {};
    if (!validateRequired(data.username)) errors.username = 'Username is required';
    if (!validateRequired(data.email)) errors.email = 'Email is required';
    else if (!validateEmail(data.email)) errors.email = 'Invalid email format';
    if (!validateRequired(data.password)) errors.password = 'Password is required';
    else if (data.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!validateRequired(data.role)) errors.role = 'Role is required';
    return errors;
};

export const validateMissionForm = (data) => {
    const errors = {};
    if (!validateRequired(data.missionName)) errors.missionName = 'Mission name is required';
    if (!validateRequired(data.location)) errors.location = 'Location is required';
    return errors;
};

export const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const levels = [
        { label: 'Very Weak', color: '#ff3366' },
        { label: 'Weak', color: '#ff6b35' },
        { label: 'Fair', color: '#ffaa00' },
        { label: 'Good', color: '#00d4ff' },
        { label: 'Strong', color: '#00ff88' },
    ];
    const idx = Math.min(score, levels.length) - 1;
    return { score, ...levels[Math.max(0, idx)] };
};
