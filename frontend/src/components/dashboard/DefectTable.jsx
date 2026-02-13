import React, { memo, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Eye, Filter, Download, Search } from 'lucide-react';
import Badge from '../common/Badge';
import { formatPercentage } from '../../utils/formatters';

const DefectTable = memo(({ defects, onSelectDefect, selectedDefectId }) => {
    const [sortField, setSortField] = useState('frameNumber');
    const [sortDir, setSortDir] = useState('asc');
    const [filterType, setFilterType] = useState('all');
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const handleSort = useCallback((field) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    }, [sortField]);

    const filteredDefects = useMemo(() => {
        let result = [...defects];

        if (filterType !== 'all') {
            result = result.filter(d => d.type === filterType);
        }
        if (filterSeverity !== 'all') {
            result = result.filter(d => d.severity === filterSeverity);
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(d =>
                d.typeLabel?.toLowerCase().includes(term) ||
                d.id?.toLowerCase().includes(term)
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
    }, [defects, filterType, filterSeverity, searchTerm, sortField, sortDir]);

    const pagedDefects = useMemo(() => {
        return filteredDefects.slice(page * perPage, (page + 1) * perPage);
    }, [filteredDefects, page, perPage]);

    const totalPages = Math.ceil(filteredDefects.length / perPage);
    const types = [...new Set(defects.map(d => d.type))];
    const severities = [...new Set(defects.map(d => d.severity))];

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronUp className="w-3 h-3 opacity-20" />;
        return sortDir === 'asc'
            ? <ChevronUp className="w-3 h-3 text-cyan-400" />
            : <ChevronDown className="w-3 h-3 text-cyan-400" />;
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search defects..."
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
                        className="input-field pl-10 py-2 text-sm"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={e => { setFilterType(e.target.value); setPage(0); }}
                    className="input-field py-2 text-sm w-auto min-w-[130px]"
                >
                    <option value="all">All Types</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select
                    value={filterSeverity}
                    onChange={e => { setFilterSeverity(e.target.value); setPage(0); }}
                    className="input-field py-2 text-sm w-auto min-w-[130px]"
                >
                    <option value="all">All Severity</option>
                    {severities.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-white/5">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            {[
                                { key: 'frameNumber', label: 'Frame' },
                                { key: 'typeLabel', label: 'Defect Type' },
                                { key: 'severity', label: 'Severity' },
                                { key: 'confidence', label: 'Confidence' },
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
                        {pagedDefects.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    No defects found
                                </td>
                            </tr>
                        ) : (
                            pagedDefects.map((defect) => (
                                <motion.tr
                                    key={defect.id}
                                    onClick={() => onSelectDefect?.(defect)}
                                    className={`border-b border-white/5 cursor-pointer table-row-hover ${selectedDefectId === defect.id ? 'bg-cyan-400/10 border-cyan-400/20' : ''
                                        }`}
                                    whileHover={{ backgroundColor: 'rgba(0,212,255,0.05)' }}
                                >
                                    <td className="px-4 py-3 text-white font-mono">{defect.frameNumber}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: defect.typeColor }} />
                                            <span className="text-white">{defect.typeLabel}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={defect.severity} size="sm">{defect.severityLabel}</Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500"
                                                    style={{ width: `${defect.confidence}%` }}
                                                />
                                            </div>
                                            <span className="text-gray-300 text-xs font-mono">{defect.confidence}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onSelectDefect?.(defect); }}
                                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        Showing {page * perPage + 1}-{Math.min((page + 1) * perPage, filteredDefects.length)} of {filteredDefects.length}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0}
                            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
                        >
                            Prev
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === i ? 'bg-cyan-400/20 text-cyan-400' : 'text-gray-400 hover:bg-white/5'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                            disabled={page >= totalPages - 1}
                            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});

DefectTable.displayName = 'DefectTable';
export default DefectTable;
