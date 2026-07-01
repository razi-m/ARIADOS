import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Shield, FileText, ChevronRight, Cpu, Eye, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
};

const LandingPage = memo(() => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const features = [
        { icon: Camera, title: 'Drone AI Vision', desc: 'Autonomous drone surveillance with real-time corrimet detection' },
        { icon: Shield, title: 'Secure Backend', desc: 'Authority-only access with role-based authentication' },
        { icon: FileText, title: 'Audit Logs', desc: 'Complete inspection history with PDF report generation' },
    ];

    const stats = [
        { value: '99.2%', label: 'Detection Accuracy' },
        { value: '500+', label: 'Inspections Done' },
        { value: '< 2min', label: 'Analysis Time' },
        { value: '4', label: 'Defect Categories' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section - Dark Navy */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-navy">
                {/* Background Image with Zoom Effect */}
                <div className="absolute inset-0 z-0">
                    <motion.img
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        src="/drone_hero.jpg"
                        alt="Drone Infrastructure Inspection"
                        className="w-full h-full object-cover contrast-125 brightness-110 saturate-110"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {/* Dark Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/40 to-transparent" />
                </div>

                {/* Nav Bar */}
                <nav className="absolute top-0 left-0 right-0 z-20 px-6 lg:px-12 py-5 flex items-center justify-between">
                    <Link to="/">
                        <Logo className="h-12" variant="light" />
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
                        <a href="#how" className="hover:text-white transition">How It Works</a>
                        <a href="#stats" className="hover:text-white transition">Statistics</a>
                    </div>
                    <Link
                        to={isAuthenticated ? '/dashboard' : '/login'}
                        className="btn-primary text-sm"
                    >
                        {isAuthenticated ? 'Dashboard' : 'Request Authority Access'}
                    </Link>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-20">
                    <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl">
                        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                            AI-Powered<br />
                            <span className="text-primary-light">Infrastructure Inspection</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-lg text-gray-300 mb-8 max-w-lg">
                            Autonomous drone surveillance with real-time defect detection
                            and comprehensive reporting for infrastructure safety.
                        </motion.p>
                        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                                className="btn-primary text-base px-8 py-3"
                            >
                                Enter Secure System <ChevronRight className="w-5 h-5" />
                            </button>
                            <a href="#how" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 text-base px-8 py-3">
                                Learn More
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how" className="bg-navy-light py-20 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
                        <p className="text-gray-400">Three simple steps to comprehensive inspection</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="bg-navy/50 border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all"
                            >
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-10 flex justify-center"
                    >
                        <button
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                            className="btn-primary text-base px-10 py-3"
                        >
                            Request Authority Access <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section id="stats" className="bg-navy py-16 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center py-6"
                        >
                            <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-navy border-t border-white/5 py-8 px-6 text-center">
                <p className="text-sm text-gray-500">© 2024 ARIADOS — AI Infrastructure Inspection Platform</p>
            </footer>
        </div>
    );
});

LandingPage.displayName = 'LandingPage';
export default LandingPage;
