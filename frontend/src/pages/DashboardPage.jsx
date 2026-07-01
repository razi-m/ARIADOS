import React, { memo, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  BarChart3, Upload, AlertTriangle, FileText, Users,
  Download, CheckCircle, Flag, RotateCw, LogOut, Shield,
  TrendingUp, TrendingDown, Target, Video, Cpu, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDefects } from '../context/DefectContext';
import { useReports } from '../context/ReportContext';
import { useVideos } from '../context/VideoContext';
import useMetrics from '../hooks/useMetrics';
import { useToast } from '../components/common/Toast';
import { REVIEW_STATUS, PROCESSING_STATES } from '../utils/constants';
import { generatePDF } from '../utils/pdfGenerator';
import { formatDateTime, formatFileSize } from '../utils/formatters';
import AnalyticsTab from '../components/dashboard/AnalyticsTab';
import Logo from '../components/common/Logo';

// Tab Components (inline for simplicity)
const OverviewTab = memo(({ metrics, defects, reports, completedVideos }) => {
  const metricCards = [
    { title: 'Total Defects', value: metrics.totalDefects, icon: AlertTriangle, color: '#3B82F6', bg: '#EFF6FF' },
    { title: 'Critical Issues', value: metrics.criticalIssues, icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2' },
    { title: 'Avg Confidence', value: `${metrics.avgConfidence}%`, icon: Target, color: '#22C55E', bg: '#DCFCE7' },
    { title: 'Videos Processed', value: metrics.videosProcessed, icon: Video, color: '#8B5CF6', bg: '#EDE9FE' },
    { title: 'Reports Generated', value: metrics.reportsGenerated, icon: FileText, color: '#F59E0B', bg: '#FEF3C7' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((m) => (
          <div key={m.title} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{m.title}</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: m.bg }}>
                <m.icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Defects + Recent Reports side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Defects</h3>
          {defects.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No defects detected yet. Upload a video to start.</p>
          ) : (
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Confidence</th>
                  <th>Frame</th>
                </tr>
              </thead>
              <tbody>
                {defects.slice(0, 5).map(d => (
                  <tr key={d.id}>
                    <td className="font-medium">{d.typeLabel}</td>
                    <td><span className={`badge badge-${d.severity === 'critical' ? 'red' : d.severity === 'high' ? 'yellow' : d.severity === 'medium' ? 'yellow' : 'blue'}`}>{d.severityLabel}</span></td>
                    <td>{d.confidence}%</td>
                    <td>#{d.frameNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
          {reports.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No reports generated yet.</p>
          ) : (
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Mission</th>
                  <th>Defects</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 5).map(r => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.missionName}</td>
                    <td>{r.totalDefects}</td>
                    <td className="text-gray-500 text-sm">{formatDateTime(r.generationDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Processed Videos */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Processed Videos</h3>
        {completedVideos.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No completed videos.</p>
        ) : (
          <table className="clean-table">
            <thead>
              <tr>
                <th>Video Name</th>
                <th>Mission</th>
                <th>Location</th>
                <th>Size</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {completedVideos.map(v => (
                <tr key={v.id}>
                  <td className="font-medium">{v.name}</td>
                  <td>{v.missionName}</td>
                  <td className="text-gray-500">{v.location}</td>
                  <td className="text-gray-500">{formatFileSize(v.size)}</td>
                  <td className="text-gray-500 text-sm">{formatDateTime(v.uploadDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

// Mission Detail View Overlay
const MissionDetailView = memo(({ mission, defects, onClose }) => {
  // Filter defects that belong to this video/mission
  const filteredDefects = defects.filter(d => d.videoId === mission.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-gray-50 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{mission.missionName}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Video className="w-4 h-4" /> {mission.name}</span>
              <span className="flex items-center gap-1"><Target className="w-4 h-4" /> {mission.location}</span>
              <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {formatDateTime(mission.uploadDate)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { generatePDF({ ...mission, totalDefects: filteredDefects.length }, filteredDefects); }}
              className="btn-primary"
            >
              <Download className="w-4 h-4" /> Download Report
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <LogOut className="w-5 h-5 text-gray-500 rotate-180" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 bg-blue-50 border-blue-100">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Total Defects</span>
              <p className="text-3xl font-bold text-gray-900 mt-1">{filteredDefects.length}</p>
            </div>
            <div className="card p-4 bg-red-50 border-red-100">
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Critical</span>
              <p className="text-3xl font-bold text-gray-900 mt-1">{filteredDefects.filter(d => d.severity === 'critical').length}</p>
            </div>
            <div className="card p-4 bg-yellow-50 border-yellow-100">
              <span className="text-xs font-semibold text-yellow-600 uppercase tracking-wider">High Severity</span>
              <p className="text-3xl font-bold text-gray-900 mt-1">{filteredDefects.filter(d => d.severity === 'high').length}</p>
            </div>
            <div className="card p-4 bg-green-50 border-green-100">
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Avg Confidence</span>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {filteredDefects.length ? Math.round(filteredDefects.reduce((acc, d) => acc + d.confidence, 0) / filteredDefects.length) : 0}%
              </p>
            </div>
          </div>

          {/* Defect List */}
          <div className="card bg-white border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Defect Analysis Results</h3>
            </div>
            <table className="clean-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Frame</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Confidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDefects.map((d, i) => (
                  <tr key={d.id}>
                    <td className="font-mono text-xs text-gray-500">{d.id.slice(0, 8)}</td>
                    <td>#{d.frameNumber}</td>
                    <td className="font-medium">{d.typeLabel}</td>
                    <td><span className={`badge severity-${d.severity}`}>{d.severityLabel}</span></td>
                    <td>{d.confidence}%</td>
                    <td><span className="badge badge-gray">{d.reviewStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const UploadTab = memo(({ addVideo, startProcessing, videos, processingId, completedVideos, defects }) => {
  const toast = useToast();
  const [missionName, setMissionName] = useState('');
  const [location, setLocation] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleFiles = useCallback((files) => {
    const file = files[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }
    const video = addVideo(file, { missionName: missionName || file.name, location: location || 'Unknown' });
    toast.success(`Video "${file.name}" added`);
    startProcessing(video.id);
    setMissionName('');
    setLocation('');
  }, [addVideo, startProcessing, missionName, location, toast]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mission Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mission Name</label>
              <input
                className="input-clean"
                placeholder="e.g. Bridge Inspection Feb 2024"
                value={missionName}
                onChange={e => setMissionName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <input
                className="input-clean"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Video</h3>
          <div
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
                            ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}`}
          >
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">Drag and drop video file here</p>
            <p className="text-xs text-gray-400 mb-4">MP4, AVI, MOV up to 500MB</p>
            <label className="btn-primary cursor-pointer inline-flex">
              Browse Files
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={e => handleFiles(e.target.files)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Split Layout: Processing Queue | Analyzed Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Queue */}
        <div className="card p-6 h-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Queue</h3>
          {videos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No videos in queue</p>
          ) : (
            <div className="space-y-3">
              {videos.map(v => (
                <div key={v.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{v.name}</p>
                    <p className="text-xs text-gray-500">{v.missionName} • {formatFileSize(v.size)}</p>
                  </div>
                  <div className="w-32">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`badge text-xs ${v.status === PROCESSING_STATES.COMPLETED ? 'badge-green' : v.status === PROCESSING_STATES.PROCESSING || v.status === PROCESSING_STATES.ANALYZING ? 'badge-blue' : 'badge-gray'}`}>
                        {v.status}
                      </span>
                      <span className="text-xs text-gray-500">{v.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${v.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analyzed Videos Table */}
        <div className="card p-6 h-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyzed Missions</h3>
          {completedVideos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No analyzed missions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Mission</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {completedVideos.map(v => (
                    <tr key={v.id} onClick={() => navigate(`/mission/${v.id}`)} className="cursor-pointer hover:bg-gray-50">
                      <td className="font-medium text-primary">{v.missionName}</td>
                      <td className="text-gray-500">{v.location}</td>
                      <td className="text-gray-500 text-sm">{formatDateTime(v.uploadDate)}</td>
                      <td><ChevronRight className="w-4 h-4 text-gray-400" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Mission Detail Overlay Removed - Now handled by /mission/:id route */}
    </div>
  );
});

// ... DefectsTab ...

// ... DashboardPage ...




const ReportsTab = memo(({ reports, defects, completedVideos, user, generateReport, generating }) => {
  const toast = useToast();

  const handleGenerate = useCallback(async () => {
    try {
      const report = await generateReport(
        completedVideos[0]?.missionName || 'Inspection Report',
        defects,
        user?.username
      );
      generatePDF(report, defects);
      toast.success(`Report ${report.id} generated & downloaded!`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate report');
    }
  }, [generateReport, completedVideos, defects, user, toast]);

  const handleDownload = useCallback((report) => {
    generatePDF(report, defects);
    toast.success('Downloaded');
  }, [defects, toast]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Generate Section */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Generate Report</h3>
            <p className="text-sm text-gray-500 mt-1">Create a PDF report from current inspection data including all defects and statistics.</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary flex-shrink-0"
          >
            {generating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <><Download className="w-4 h-4" /> Generate PDF Report</>
            )}
          </button>
        </div>
      </div>

      {/* Report List */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report History</h3>
        {reports.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No reports yet. Generate your first report above.</p>
        ) : (
          <table className="clean-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mission</th>
                <th>Defects</th>
                <th>Confidence</th>
                <th>Generated By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td className="font-mono text-xs text-gray-500">{r.id}</td>
                  <td className="font-medium">{r.missionName}</td>
                  <td>
                    <span className="badge badge-blue">{r.totalDefects}</span>
                  </td>
                  <td>{r.avgConfidence}%</td>
                  <td className="text-gray-500">{r.generatedBy}</td>
                  <td className="text-gray-500 text-sm">{formatDateTime(r.generationDate)}</td>
                  <td>
                    <button
                      onClick={() => handleDownload(r)}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

const AdminTab = memo(({ user }) => {
  const toast = useToast();
  const [users, setUsers] = useState(() => {
    try {
      const s = localStorage.getItem('ariados_admin_users');
      return s ? JSON.parse(s) : [
        { id: 1, username: 'admin', email: 'admin@ariados.com', role: 'admin', status: 'active' },
        { id: 2, username: 'inspector', email: 'inspector@ariados.com', role: 'inspector', status: 'active' },
        { id: 3, username: 'john_doe', email: 'john@ariados.com', role: 'inspector', status: 'active' },
      ];
    } catch { return []; }
  });
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'inspector' });

  const saveUsers = (updated) => {
    setUsers(updated);
    try { localStorage.setItem('ariados_admin_users', JSON.stringify(updated)); } catch { }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) {
      toast.error('Username and password required');
      return;
    }
    const created = {
      id: Date.now(),
      username: newUser.username,
      email: `${newUser.username}@ariados.com`,
      role: newUser.role,
      status: 'active'
    };
    saveUsers([...users, created]);
    setNewUser({ username: '', password: '', role: 'inspector' });
    toast.success(`User "${created.username}" added`);
  };

  const handleToggleStatus = (id) => {
    const updated = users.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    );
    saveUsers(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User List */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Admin Management</h3>
          <p className="text-sm text-gray-500 mb-4">User List</p>

          <table className="clean-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="font-medium">{u.username}</td>
                  <td className="text-gray-500">{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-blue' : 'badge-gray'}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-red'}`}>{u.status}</span></td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className="btn-secondary text-xs py-1.5 px-3"
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New User */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New User</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <input
                className="input-clean"
                placeholder="Player Name"
                value={newUser.username}
                onChange={e => setNewUser(p => ({ ...p, username: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                className="input-clean"
                type="password"
                placeholder="Provide a Password"
                value={newUser.password}
                onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <select
                className="input-clean"
                value={newUser.role}
                onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
              >
                <option value="inspector">Inspector</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Add User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

// ====== MAIN DASHBOARD ======
const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'analytics', label: 'Analytics', icon: AlertTriangle },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'admin', label: 'Admin', icon: Users },
];

const DashboardPage = memo(() => {
  const [activeTab, setActiveTab] = useState('overview');
  const { defects, approveDefect, flagFalsePositive, requestReanalysis } = useDefects();
  const { reports, generateReport, generating } = useReports();
  const { user, logout } = useAuth();
  const { videos, completedVideos, processingId, addVideo, startProcessing } = useVideos();
  const metrics = useMetrics();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.info('Logged out');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0 z-30">
        {/* Logo Area */}
        <div className="h-20 flex items-center border-b border-gray-100 pl-6">
          <Link to="/">
            <Logo className="h-10" variant="dark" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {TABS.map(tab => {
            if (tab.id === 'admin' && user?.role !== 'admin') return null;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-blue-50 text-primary shadow-sm ring-1 ring-blue-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm text-sm font-semibold text-primary">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role || 'Inspector'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-red-500 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-4rem)] md:h-screen overflow-y-auto bg-gray-50/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
          {/* Page Title (Dynamic) */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'overview' && 'System overview and metrics dashboard'}
              {activeTab === 'upload' && 'Upload and process inspection footage'}
              {activeTab === 'analytics' && 'Analyze and visualize defect data'}
              {activeTab === 'reports' && 'Generate and download inspection reports'}
              {activeTab === 'admin' && 'System administration and user management'}
            </p>
          </div>

          {activeTab === 'overview' && (
            <OverviewTab
              metrics={metrics}
              defects={defects}
              reports={reports}
              completedVideos={completedVideos}
            />
          )}
          {activeTab === 'upload' && (
            <UploadTab
              addVideo={addVideo}
              startProcessing={startProcessing}
              videos={videos}
              processingId={processingId}
              completedVideos={completedVideos}
              defects={defects}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab defects={defects} />
          )}
          {activeTab === 'reports' && (
            <ReportsTab
              reports={reports}
              defects={defects}
              completedVideos={completedVideos}
              user={user}
              generateReport={generateReport}
              generating={generating}
            />
          )}
          {activeTab === 'admin' && user?.role === 'admin' && (
            <AdminTab user={user} />
          )}
        </div>
      </main>
    </div>
  );
});

OverviewTab.displayName = 'OverviewTab';
UploadTab.displayName = 'UploadTab';
ReportsTab.displayName = 'ReportsTab';
AdminTab.displayName = 'AdminTab';
DashboardPage.displayName = 'DashboardPage';
export default DashboardPage;