import React, { memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Upload, FileText, Shield, LogOut, ChevronDown,
    Menu, X, Home
} from 'lucide-react';

const Header = memo(({ onToggleSidebar, sidebarOpen }) => {
    const { user, logout, isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home', icon: Home, public: true },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/upload', label: 'Upload', icon: Upload },
        { path: '/reports/history', label: 'Reports', icon: FileText, adminOnly: true },
        { path: '/admin', label: 'Admin', icon: Shield, adminOnly: true },
    ];

    const filteredNav = navItems.filter(item => {
        if (item.public) return true;
        if (!isAuthenticated) return false;
        if (item.adminOnly && !isAdmin) return false;
        return true;
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            ARI<span className="text-gradient">ADOS</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {filteredNav.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'text-cyan-400 bg-cyan-400/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right section */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-sm font-medium text-white">{user?.username}</span>
                                    <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                    {user?.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="glow-button text-white text-sm px-5 py-2 rounded-lg font-medium"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile menu toggle */}
                        <button
                            onClick={onToggleSidebar}
                            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {sidebarOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t border-white/5 bg-dark-900/95 backdrop-blur-xl"
                >
                    <div className="px-4 py-3 space-y-1">
                        {filteredNav.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={onToggleSidebar}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'text-cyan-400 bg-cyan-400/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </header>
    );
});

Header.displayName = 'Header';
export default Header;
