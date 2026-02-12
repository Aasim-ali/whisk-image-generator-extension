'use client';

import { motion } from 'framer-motion';
import { Target, Users, Zap, Shield, Globe, Award, TrendingUp } from 'lucide-react';

import { fadeInUp, staggerContainer, staggerItem } from '@/utils/animations';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function About() {
    const values = [
        {
            icon: <Zap size={32} />,
            title: "Innovation First",
            description: "We push the boundaries of what's possible with AI and automation.",
            color: "from-yellow-500/20 to-yellow-500/5"
        },
        {
            icon: <Users size={32} />,
            title: "User-Centric",
            description: "Every feature is designed with our users' workflows and needs in mind.",
            color: "from-blue-500/20 to-blue-500/5"
        },
        {
            icon: <Shield size={32} />,
            title: "Reliability",
            description: "Enterprise-grade infrastructure ensuring 99.9% uptime for your workflows.",
            color: "from-green-500/20 to-green-500/5"
        },
        {
            icon: <Globe size={32} />,
            title: "Accessibility",
            description: "Making professional tools accessible to creators of all skill levels.",
            color: "from-purple-500/20 to-purple-500/5"
        }
    ];

    const teamMembers = [
        {
            name: "Alex Chen",
            role: "CEO & Founder",
            avatar: "AC",
            color: "from-primary to-accent"
        },
        {
            name: "Sarah Williams",
            role: "CTO",
            avatar: "SW",
            color: "from-blue-500 to-cyan-500"
        },
        {
            name: "Marcus Johnson",
            role: "Head of Product",
            avatar: "MJ",
            color: "from-purple-500 to-pink-500"
        },
        {
            name: "Emily Rodriguez",
            role: "Lead Designer",
            avatar: "ER",
            color: "from-orange-500 to-red-500"
        }
    ];

    const milestones = [
        { year: "2023", event: "Whisk Founded", desc: "Started with a vision to automate creative workflows" },
        { year: "2024", event: "10K+ Users", desc: "Reached our first major user milestone" },
        { year: "2025", event: "Series A Funding", desc: "Secured funding to scale our platform" },
        { year: "2026", event: "Global Expansion", desc: "Serving creators worldwide" }
    ];

    return (
        <main className="min-h-screen pt-[80px] pb-20 overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none -z-10" />
            <div className="fixed top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="container relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <motion.div variants={staggerItem}>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            About <span className="text-gradient">Whisk</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            Revolutionizing creative workflows with AI-powered image generation.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                <Target size={24} className="text-primary" />
                            </div>
                            <h2 className="text-3xl font-bold">Our Mission</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            At Whisk, we believe that creativity shouldn't be limited by technical skills. Our mission is to democratize art creation by providing powerful, intuitive, and accessible AI tools that empower anyone to bring their imagination to life.
                        </p>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            Whether you're a professional designer looking to speed up your workflow or a hobbyist exploring new visual styles, Whisk provides the generated imagery you need in seconds.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass-hover p-8 relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="text-5xl font-bold text-gradient">
                                    <AnimatedCounter end={10000} suffix="+" />
                                </div>
                                <div className="text-sm text-gray-400">Users Trust Us</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-5xl font-bold text-gradient">
                                    <AnimatedCounter end={1000000} suffix="+" />
                                </div>
                                <div className="text-sm text-gray-400">Images Generated</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-5xl font-bold text-gradient">
                                    <AnimatedCounter end={99.9} decimals={1} suffix="%" />
                                </div>
                                <div className="text-sm text-gray-400">Uptime</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-5xl font-bold text-gradient">24/7</div>
                                <div className="text-sm text-gray-400">Support</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Core Values */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="mb-32"
                >
                    <motion.div variants={staggerItem} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Values</h2>
                        <p className="text-gray-400 text-lg">The principles that guide everything we do</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                className="glass-hover p-6 text-center group relative overflow-hidden"
                                whileHover={{ y: -8 }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative z-10">
                                    <motion.div
                                        className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-white"
                                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {value.icon}
                                    </motion.div>
                                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Team Section */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="mb-32"
                >
                    <motion.div variants={staggerItem} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet the Team</h2>
                        <p className="text-gray-400 text-lg">The talented people behind Whisk</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                className="glass-hover p-6 text-center group"
                                whileHover={{ y: -8 }}
                            >
                                <motion.div
                                    className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold`}
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {member.avatar}
                                </motion.div>
                                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                <p className="text-gray-400 text-sm">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Timeline/Milestones */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="mb-32"
                >
                    <motion.div variants={staggerItem} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Journey</h2>
                        <p className="text-gray-400 text-lg">Key milestones in our story</p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                className="flex gap-6 mb-8 group"
                            >
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg shadow-primary/30"
                                        whileHover={{ scale: 1.2 }}
                                    >
                                        <Award size={20} />
                                    </motion.div>
                                    {index < milestones.length - 1 && (
                                        <div className="w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent mt-2" />
                                    )}
                                </div>
                                <div className="flex-1 pb-8">
                                    <div className="glass-hover p-6 group-hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl font-bold text-gradient">{milestone.year}</span>
                                            <TrendingUp size={20} className="text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{milestone.event}</h3>
                                        <p className="text-gray-400">{milestone.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center glass-strong border-2 border-white/10 rounded-3xl p-12 backdrop-blur-sm"
                >
                    <h2 className="text-4xl font-bold mb-6">Ready to start creating?</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                        Join thousands of creators who are already using Whisk to transform their ideas into stunning visuals.
                    </p>
                    <motion.button
                        className="btn text-lg px-8 py-4"
                        whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(138, 43, 226, 0.6)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Started for Free
                    </motion.button>
                </motion.div>
            </div>
        </main>
    );
}
