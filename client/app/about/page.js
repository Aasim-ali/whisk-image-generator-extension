'use client';

import { motion } from 'framer-motion';

export default function About() {
    return (
        <main className="min-h-screen pt-[80px] pb-20 overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
            <div className="fixed top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        About <span className="text-gradient">Whisk</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Revolutionizing creative workflows with AI-powered image generation.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold">Our Mission</h2>
                        <p className="text-gray-300 leading-relaxed">
                            At Whisk, we believe that creativity shouldn't be limited by technical skills. Our mission is to democratize art creation by providing powerful, intuitive, and accessible AI tools that empower anyone to bring their imagination to life.
                        </p>
                        <p className="text-gray-300 leading-relaxed">
                            Whether you're a professional designer looking to speed up your workflow or a hobbyist exploring new visual styles, Whisk provides the generated imagery you need in seconds.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass p-8 relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="text-4xl font-bold text-white">10K+</div>
                                <div className="text-sm text-gray-400">Users Trust Us</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-4xl font-bold text-white">1M+</div>
                                <div className="text-sm text-gray-400">Images Generated</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-4xl font-bold text-white">99.9%</div>
                                <div className="text-sm text-gray-400">Uptime</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-4xl font-bold text-white">24/7</div>
                                <div className="text-sm text-gray-400">Support</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-sm"
                >
                    <h2 className="text-3xl font-bold mb-6">Ready to start creating?</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Join thousands of creators who are already using Whisk to transform their ideas into stunning visuals.
                    </p>
                    <button className="btn text-lg px-8 py-3">
                        Get Started for Free
                    </button>
                </motion.div>
            </div>
        </main>
    );
}
