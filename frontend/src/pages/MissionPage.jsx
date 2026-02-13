
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Download, Video, Target, FileText,
    AlertTriangle, Shield, CheckCircle
} from 'lucide-react';
import { useVideos } from '../context/VideoContext';
import { useDefects } from '../context/DefectContext';
import { useAuth } from '../context/AuthContext';
import { generatePDF } from '../utils/pdfGenerator';
import { formatDateTime } from '../utils/formatters';

const MissionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { completedVideos } = useVideos();
    const { defects } = useDefects();

    const mission = useMemo(() =>
        completedVideos.find(v => v.id === id),
        [completedVideos, id]
    );

    const filteredDefects = useMemo(() =>
        mission ? defects.filter(d => d.videoId === mission.id) : [],
        [mission, defects]
    );
    const { user } = useAuth();

    const handleGenerateReport = () => {
        const severityDistribution = {
            critical: filteredDefects.filter(d => d.severity === 'critical').length,
            high: filteredDefects.filter(d => d.severity === 'high').length,
            medium: filteredDefects.filter(d => d.severity === 'medium').length,
            low: filteredDefects.filter(d => d.severity === 'low').length,
        };

        const reportData = {
            ...mission,
            id: mission.id,
            totalDefects: filteredDefects.length,
            severityDistribution,
            generatedBy: user?.username || 'User',
        };

        generatePDF(reportData, filteredDefects);
    };

    if (!mission) {
        // ... existing check ...
    }

    return (
        <motion.div
        // ... existing props ...
        >
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">{mission.missionName}</h1>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Video className="w-4 h-4" /> {mission.name}</span>
                            <span className="flex items-center gap-1"><Target className="w-4 h-4" /> {mission.location}</span>
                            <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {formatDateTime(mission.uploadDate)}</span>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={handleGenerateReport}
                            className="btn-primary"
                        >
                            <Download className="w-4 h-4" /> Download Full Report
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="card p-6 bg-white border-l-4 border-l-blue-500">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Defects</span>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{filteredDefects.length}</p>
                    </div>
                    <div className="card p-6 bg-white border-l-4 border-l-red-500">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Critical Issues</span>
                        <p className="text-3xl font-bold text-red-600 mt-2">{filteredDefects.filter(d => d.severity === 'critical').length}</p>
                    </div>
                    <div className="card p-6 bg-white border-l-4 border-l-yellow-500">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">High Severity</span>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">{filteredDefects.filter(d => d.severity === 'high').length}</p>
                    </div>
                    <div className="card p-6 bg-white border-l-4 border-l-green-500">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Confidence</span>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {filteredDefects.length ? Math.round(filteredDefects.reduce((acc, d) => acc + d.confidence, 0) / filteredDefects.length) : 0}%
                        </p>
                    </div>
                </div>

                {/* Defect List */}
                <div className="card bg-white border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                        <h3 className="text-lg font-semibold text-gray-900">Defect Analysis Results</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="clean-table">
                            <thead>
                                <tr>
                                    <th className="pl-6">ID</th>
                                    <th>Frame</th>
                                    <th>Type</th>
                                    <th>Severity</th>
                                    <th>Confidence</th>
                                    <th className="pr-6">Review Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDefects.map((d) => (
                                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="pl-6 font-mono text-xs text-gray-500">{d.id.slice(0, 8)}</td>
                                        <td><span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">#{d.frameNumber}</span></td>
                                        <td className="font-medium text-gray-900">{d.typeLabel}</td>
                                        <td>
                                            <span className={`badge severity-${d.severity} capitalized`}>
                                                {d.severityLabel}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${d.confidence > 85 ? 'bg-green-500' : d.confidence > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${d.confidence}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500">{d.confidence}%</span>
                                            </div>
                                        </td>
                                        <td className="pr-6">
                                            <span className="badge badge-gray">{d.reviewStatus}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredDefects.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <Shield className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <p>No defects detected in this mission.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MissionPage;
