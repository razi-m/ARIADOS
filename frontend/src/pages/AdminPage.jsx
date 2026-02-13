import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Shield, Users, Plus, Edit3, Trash2, CheckCircle, XCircle,
    Mail, Key, UserCheck, AlertTriangle, BarChart3, HardDrive, Activity
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useToast } from '../components/common/Toast';
import { ROLES, DEFAULT_USERS } from '../utils/constants';
import { validateUserForm, getPasswordStrength } from '../utils/validation';
import { formatDateTime } from '../utils/formatters';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const AdminPage = memo(() => {
    const toast = useToast();
    const [users, setUsers] = useState(() => {
        try {
            const stored = localStorage.getItem('ariados_admin_users');
            return stored ? JSON.parse(stored) : DEFAULT_USERS.map(u => ({
                ...u,
                lastLogin: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
            }));
        } catch {
            return DEFAULT_USERS;
        }
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: ROLES.INSPECTOR });
    const [formErrors, setFormErrors] = useState({});

    const saveUsers = useCallback((updated) => {
        setUsers(updated);
        try { localStorage.setItem('ariados_admin_users', JSON.stringify(updated)); } catch { }
    }, []);

    const handleAddUser = useCallback(() => {
        const errors = validateUserForm(newUser);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        const user = {
            id: Date.now(),
            ...newUser,
            status: 'active',
            lastLogin: null,
        };
        const updated = [...users, user];
        saveUsers(updated);
        setNewUser({ username: '', email: '', password: '', role: ROLES.INSPECTOR });
        setFormErrors({});
        setShowAddModal(false);
        toast.success(`User "${user.username}" created successfully`);
    }, [newUser, users, saveUsers, toast]);

    const handleDeleteUser = useCallback((userId) => {
        const updated = users.filter(u => u.id !== userId);
        saveUsers(updated);
        setShowDeleteModal(null);
        toast.success('User deleted successfully');
    }, [users, saveUsers, toast]);

    const handleToggleStatus = useCallback((userId) => {
        const updated = users.map(u =>
            u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
        );
        saveUsers(updated);
        toast.info('User status updated');
    }, [users, saveUsers, toast]);

    const handleChangeRole = useCallback((userId, newRole) => {
        const updated = users.map(u =>
            u.id === userId ? { ...u, role: newRole } : u
        );
        saveUsers(updated);
        toast.info('User role updated');
    }, [users, saveUsers, toast]);

    const pwStrength = getPasswordStrength(newUser.password);

    const permissions = [
        { feature: 'View Dashboard', admin: true, inspector: true },
        { feature: 'Upload Videos', admin: true, inspector: true },
        { feature: 'Review Defects', admin: true, inspector: true },
        { feature: 'Generate Reports', admin: true, inspector: true },
        { feature: 'View Report History', admin: true, inspector: false },
        { feature: 'Manage Users', admin: true, inspector: false },
        { feature: 'System Settings', admin: true, inspector: false },
    ];

    const systemStats = [
        { label: 'Total Users', value: users.length, icon: Users, color: 'text-cyan-400' },
        { label: 'Active Sessions', value: users.filter(u => u.status === 'active').length, icon: Activity, color: 'text-green-400' },
        { label: 'Storage Used', value: '2.4 GB', icon: HardDrive, color: 'text-amber-400' },
        { label: 'System Health', value: '98.5%', icon: BarChart3, color: 'text-green-400' },
    ];

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                {/* Header */}
                <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Shield className="w-8 h-8 text-cyan-400" />
                            Admin Management
                        </h1>
                        <p className="text-gray-400 mt-2">Manage users, permissions, and system settings</p>
                    </div>
                    <Button icon={Plus} onClick={() => setShowAddModal(true)}>
                        Add User
                    </Button>
                </motion.div>

                {/* System Stats */}
                <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {systemStats.map((stat) => (
                        <div key={stat.label} className="glass-panel rounded-xl p-4">
                            <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                            <p className="text-xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* User Management */}
                <motion.div variants={item}>
                    <Card title="User Management" icon={Users} animate={false} noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Login</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-white/5 table-row-hover">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                                        {user.username[0]?.toUpperCase()}
                                                    </div>
                                                    <span className="text-white font-medium">{user.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                                    className="bg-transparent border border-white/10 text-white rounded-md px-2 py-1 text-xs focus:outline-none focus:border-cyan-400/50"
                                                >
                                                    <option value={ROLES.ADMIN} className="bg-dark-700">Admin</option>
                                                    <option value={ROLES.INSPECTOR} className="bg-dark-700">Inspector</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => handleToggleStatus(user.id)}>
                                                    <Badge
                                                        variant={user.status === 'active' ? 'success' : 'error'}
                                                        size="sm"
                                                        dot
                                                    >
                                                        {user.status}
                                                    </Badge>
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">
                                                {user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => setShowDeleteModal(user.id)}
                                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>

                {/* Permissions Matrix */}
                <motion.div variants={item}>
                    <Card title="Permissions Matrix" icon={Key} animate={false} noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Feature</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Inspector</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map((perm) => (
                                        <tr key={perm.feature} className="border-b border-white/5">
                                            <td className="px-4 py-3 text-white">{perm.feature}</td>
                                            <td className="px-4 py-3 text-center">
                                                {perm.admin ? (
                                                    <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {perm.inspector ? (
                                                    <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Add User Modal */}
            <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setFormErrors({}); }} title="Add New User">
                <div className="space-y-4">
                    <Input
                        label="Username"
                        placeholder="Enter username"
                        value={newUser.username}
                        onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                        error={formErrors.username}
                        icon={Users}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        error={formErrors.email}
                        icon={Mail}
                        required
                    />
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter password"
                            value={newUser.password}
                            onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                            error={formErrors.password}
                            icon={Key}
                            required
                        />
                        {newUser.password && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{
                                            width: `${(pwStrength.score / 5) * 100}%`,
                                            backgroundColor: pwStrength.color,
                                        }}
                                    />
                                </div>
                                <span className="text-xs" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-300">Role</label>
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                            className="input-field"
                        >
                            <option value={ROLES.ADMIN}>Admin</option>
                            <option value={ROLES.INSPECTOR}>Inspector</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="ghost" onClick={() => { setShowAddModal(false); setFormErrors({}); }} className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleAddUser} className="flex-1">
                            Create User
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Delete User">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-300">This action cannot be undone. The user will be permanently deleted.</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="ghost" onClick={() => setShowDeleteModal(null)} className="flex-1">
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteUser(showDeleteModal)} className="flex-1">
                            Delete User
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
});

AdminPage.displayName = 'AdminPage';
export default AdminPage;
