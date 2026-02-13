import React, { memo, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FileText, Download, Eye, Search, Calendar, Filter,
    ChevronUp, ChevronDown, Trash2, Copy
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useReports } from '../context/ReportContext';
import { useToast } from '../components/common/Toast';
import { formatDateTime } from '../utils/formatters';
import { copyToClipboard } from '../utils/helpers';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const ReportHistoryPage = memo(() => {
    const { reports, deleteReport } = useReports();
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('generationDate');
    const [sortDir, setSortDir] = useState('desc');
    const [severityFilter, setSeverityFilter] = useState([]);
    const [dateFilter, setDateFilter] = useState('all');

    const handleSort = useCallback((field) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    }, [sortField]);

    const filteredReports = useMemo(() => {
        let result = [...reports];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(r =>
                r.missionName.toLowerCase().includes(term) ||
                r.id.toLowerCase().includes(term) ||
                r.generatedBy.toLowerCase().includes(term)
            );
        }

        result.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];
            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [reports, searchTerm, sortField, sortDir]);

    const handleCopyId = async (id) => {
        const ok = await copyToClipboard(id);
        if (ok) toast.success('Report ID copied');
    };

    const handleDelete = (id) => {
        deleteReport(id);
        toast.success('Report deleted');
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronUp className="w-3 h-3 opacity-20" />;
        return sortDir === 'asc'
            ? <ChevronUp className="w-3 h-3 text-cyan-400" />
            : <ChevronDown className="w-3 h-3 text-cyan-400" />;
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                {/* Header */}
                <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <FileText className="w-8 h-8 text-cyan-400" />
                            Report History
                        </h1>
                        <p className="text-gray-400 mt-2">View and manage all generated inspection reports</p>
                    </div>
                    <Badge variant="primary" size="md">{reports.length} Reports</Badge>
                </motion.div>

                {/* Filters */}
                <motion.div variants={item}>
                    <Card animate={false} noPadding>
                        <div className="p-4 flex flex-wrap items-center gap-3">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search reports..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="input-field pl-10 py-2 text-sm"
                                />
                            </div>
                            <select className="input-field py-2 text-sm w-auto min-w-[130px]" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                                <option value="all">All Time</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                            </select>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-y border-white/5 bg-white/[0.02]">
                                        {[
                                            { key: 'id', label: 'Report ID' },
                                            { key: 'missionName', label: 'Mission Name' },
                                            { key: 'generationDate', label: 'Date' },
                                            { key: 'generatedBy', label: 'Generated By' },
                                            { key: 'totalDefects', label: 'Defects' },
                                            { key: 'actions', label: 'Actions', noSort: true },
                                        ].map(col => (
                                            <th
                                                key={col.key}
                                                onClick={() => !col.noSort && handleSort(col.key)}
                                                className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${!col.noSort ? 'cursor-pointer hover:text-cyan-400 select-none' : ''}`}
                                            >
                                                <div className="flex items-center gap-1">
                                                    {col.label}
                                                    {!col.noSort && <SortIcon field={col.key} />}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                                <p>No reports found</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredReports.map((report) => (
                                            <tr key={report.id} className="border-b border-white/5 table-row-hover">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs text-cyan-400">{report.id}</span>
                                                        <button onClick={() => handleCopyId(report.id)} className="text-gray-600 hover:text-gray-400 transition-colors">
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-white">{report.missionName}</td>
                                                <td className="px-4 py-3 text-gray-400">{formatDateTime(report.generationDate)}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                            {report.generatedBy[0]?.toUpperCase()}
                                                        </div>
                                                        <span className="text-gray-300">{report.generatedBy}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-white font-medium">{report.totalDefects}</span>
                                                        <div className="flex gap-0.5">
                                                            {report.severityDistribution.critical > 0 && (
                                                                <Badge variant="critical" size="xs">{report.severityDistribution.critical}</Badge>
                                                            )}
                                                            {report.severityDistribution.high > 0 && (
                                                                <Badge variant="high" size="xs">{report.severityDistribution.high}</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Link to={`/reports/${report.id}`}>
                                                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-green-400 hover:bg-green-400/10 transition-all">
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(report.id)}
                                                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
});

ReportHistoryPage.displayName = 'ReportHistoryPage';
export default ReportHistoryPage;
