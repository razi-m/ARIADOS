import React, { memo, useState } from 'react';
import { MapPin, Calendar, FileText } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { Rocket } from 'lucide-react';

const MissionForm = memo(({ onSubmit, disabled = false }) => {
    const [formData, setFormData] = useState({
        missionName: '',
        location: '',
        dateTime: new Date().toISOString().slice(0, 16),
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.missionName.trim()) newErrors.missionName = 'Mission name is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit?.(formData);
        setFormData({ missionName: '', location: '', dateTime: new Date().toISOString().slice(0, 16) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Mission Name"
                placeholder="e.g., Bridge Inspection 2024-02"
                value={formData.missionName}
                onChange={handleChange('missionName')}
                error={errors.missionName}
                icon={FileText}
                required
            />

            <Input
                label="Location"
                placeholder="e.g., Golden Gate Bridge, San Francisco"
                value={formData.location}
                onChange={handleChange('location')}
                error={errors.location}
                icon={MapPin}
                required
            />

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Date/Time</label>
                <input
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={handleChange('dateTime')}
                    className="input-field"
                />
            </div>

            <Button
                type="submit"
                fullWidth
                icon={Rocket}
                disabled={disabled}
                className="mt-6"
            >
                Start AI Analysis
            </Button>
        </form>
    );
});

MissionForm.displayName = 'MissionForm';
export default MissionForm;
