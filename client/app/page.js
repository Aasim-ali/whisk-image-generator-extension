'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Folder, Image as ImageIcon, Video, Play,
  Settings, Terminal, Upload, X, Check,
  FileText, Clock, ChevronRight, Sparkles,
  Zap, Shield, Users, Star
} from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import { fadeInUp, staggerContainer, staggerItem, cardHover } from '../utils/animations';

export default function Home() {
  // Animation State
  const [activeStep, setActiveStep] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [prompts, setPrompts] = useState(['', '', '']);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Typing animation for headline
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Automate Your Creative Workflow';

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  // Simulation Sequence
  useEffect(() => {
    const sequence = async () => {
      while (true) {
        // Reset
        setActiveStep(0);
        setConsoleLogs([]);
        setPrompts(['', '', '']);
        setSelectedFolder(null);
        setIsGenerating(false);
        await new Promise(r => setTimeout(r, 1000));

        // Step 1: Select Images
        setActiveStep(1);
        await new Promise(r => setTimeout(r, 1500));
        setSelectedFolder("Jewelry_Collection_Summer");

        // Step 2: Templates
        setActiveStep(2);
        await new Promise(r => setTimeout(r, 1500));
        setPrompts([
          "Ultra-realistic luxury jewelry photography...",
          "Side view with dramatic lighting...",
          "Top-down perspective flat lay..."
        ]);

        // Step 3: Start
        setActiveStep(3);
        await new Promise(r => setTimeout(r, 1000));
        setIsGenerating(true);

        // Step 4: Console Logs
        const logs = [
          "✨ Whisk Image Generator Bot Ready",
          "📌 Step 1: Select images (folder or files)",
          "📝 Loaded 3 prompts",
          "▶ STARTING WHISK IMAGE GENERATION BOT",
          "✓ Processing Image 1/5...",
          "✓ Generated: Ring_Front_View.jpg",
          "✓ Processing Image 2/5...",
          "✓ Generated: Ring_Side_View.jpg"
        ];

        for (const log of logs) {
          setConsoleLogs(prev => [...prev, log]);
          await new Promise(r => setTimeout(r, 800));
        }

        await new Promise(r => setTimeout(r, 3000));
      }
    };
    sequence();
  }, []);

  const features = [
    {
      icon: <Folder size={24} />,
      title: "Batch Processing",
      description: "Connect a local folder and process hundreds of images automatically. No manual uploading required.",
      color: "from-blue-500/20 to-blue-500/5",
      borderColor: "border-blue-500/30"
    },
    {
      icon: <Settings size={24} />,
      title: "Smart Templates",
      description: "Save your best prompts as templates. Apply them to different product lines with a single click.",
      color: "from-purple-500/20 to-purple-500/5",
      borderColor: "border-purple-500/30"
    },
    {
      icon: <Terminal size={24} />,
      title: "Live Monitoring",
      description: "Watch the progress in real-time with our detailed console. Detects errors and retries automatically.",
      color: "from-pink-500/20 to-pink-500/5",
      borderColor: "border-pink-500/30"
    }
  ];

  const stats = [
    { label: "Active Users", value: 10000, suffix: "+" },
    { label: "Images Generated", value: 1000000, suffix: "+" },
    { label: "Time Saved (hrs)", value: 50000, suffix: "+" },
    { label: "Customer Rating", value: 4.9, decimals: 1, suffix: "/5" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "E-commerce Manager",
      company: "Fashion Forward",
      content: "Whisk has completely transformed our product photography workflow. What used to take days now takes hours!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Creative Director",
      company: "Tech Innovations",
      content: "The batch processing feature is a game-changer. We've increased our output by 300% while maintaining quality.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emma Rodriguez",
      role: "Marketing Lead",
      company: "Lifestyle Brands",
      content: "Best investment we've made this year. The ROI is incredible and the results are consistently stunning.",
      rating: 5,
      avatar: "ER"
    }
  ];

  return (
    <div className="min-h-screen relative text-white selection:bg-primary selection:text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[#030014] -z-20"></div>
      <div className="fixed inset-0 bg-grid opacity-20 -z-10"></div>
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10 blur-3xl"></div>
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-t from-accent/10 to-transparent -z-10 blur-3xl"></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left Content */}
            <motion.div
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-primary/30"
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-sm font-medium text-gray-300">v2.0 Now Available</span>
                <Sparkles size={16} className="text-primary" />
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1 h-16 ml-1 bg-primary align-middle"
                />
                <br />
                <span className="text-gradient">with AI Power</span>
              </h1>

              <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Generate thousands of professional product images in minutes.
                Select files, apply templates, and let Whisk handle the rest.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <motion.button
                    className="btn text-lg px-8 py-4 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(138, 43, 226, 0.6)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Upload size={20} />
                    Get Extension
                  </motion.button>
                </Link>
                <Link href="#demo">
                  <motion.button
                    className="btn btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={20} />
                    Watch Demo
                  </motion.button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start mt-12 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Check size={18} className="text-success" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Check size={18} className="text-success" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Check size={18} className="text-success" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Live Simulation */}
            <motion.div
              className="lg:w-1/2 w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative glass-strong rounded-xl border border-white/10 shadow-2xl overflow-hidden bg-[#0a0a0a]">
                {/* Simulation Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">Whisk Bot Dashboard</div>
                </div>

                {/* Simulation Body */}
                <div className="p-6 space-y-6">

                  {/* Step 1: Image Selection */}
                  <motion.div
                    className={`transition-all duration-500 ${activeStep === 1 ? 'opacity-100' : 'opacity-50'}`}
                    animate={activeStep === 1 ? { scale: [1, 1.02, 1] } : {}}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                        <ImageIcon size={16} className={activeStep === 1 ? "text-primary" : ""} />
                        Select Subject Images
                      </h3>
                      {selectedFolder && <span className="text-xs text-success flex items-center gap-1"><Check size={12} /> {selectedFolder}</span>}
                    </div>
                    <div className="flex gap-3">
                      <button className={`flex-1 py-3 rounded-lg border border-dashed border-white/20 flex items-center justify-center gap-2 text-sm transition-all ${activeStep === 1 ? 'bg-primary/20 border-primary scale-105' : 'bg-white/5 hover:bg-white/10'}`}>
                        <Folder size={16} /> Choose Folder
                      </button>
                      <button className="flex-1 py-3 rounded-lg border border-dashed border-white/20 flex items-center justify-center gap-2 text-sm bg-white/5 hover:bg-white/10 transition-all">
                        <ImageIcon size={16} /> Choose Images
                      </button>
                    </div>
                  </motion.div>

                  {/* Step 2: Prompts */}
                  <motion.div
                    className={`transition-all duration-500 ${activeStep === 2 ? 'opacity-100' : 'opacity-50'}`}
                    animate={activeStep === 2 ? { scale: [1, 1.02, 1] } : {}}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                        <FileText size={16} className={activeStep === 2 ? "text-primary" : ""} />
                        Prompts & Templates
                      </h3>
                      <button className={`text-xs px-2 py-1 rounded bg-white/10 flex items-center gap-1 ${activeStep === 2 ? 'text-primary' : ''} hover:bg-white/20 transition-all`}>
                        <Settings size={12} /> Manage Templates
                      </button>
                    </div>
                    <div className="space-y-2">
                      {prompts.map((p, i) => (
                        <motion.div
                          key={i}
                          className="h-10 bg-white/5 rounded border border-white/10 px-3 flex items-center text-xs text-gray-400 truncate"
                          initial={{ width: 0, opacity: 0 }}
                          animate={activeStep >= 2 ? { width: "100%", opacity: 1 } : {}}
                          transition={{ delay: i * 0.1 }}
                        >
                          {p || "Enter prompt or select template..."}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Step 3: Controls */}
                  <div className={`transition-opacity duration-500 ${activeStep === 3 ? 'opacity-100' : 'opacity-50'}`}>
                    <motion.button
                      className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isGenerating ? 'bg-red-500/20 text-red-400 border-2 border-red-500' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isGenerating ? <><Video size={18} className="animate-pulse" /> Stop Generation</> : <><Play size={18} /> Start Generation</>}
                    </motion.button>
                  </div>

                  {/* Step 4: Console */}
                  <div className="bg-black/50 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto border border-white/5 custom-scrollbar">
                    <div className="text-gray-500 mb-2 border-b border-white/10 pb-1 flex items-center gap-2">
                      <Terminal size={12} /> Progress Console
                    </div>
                    <AnimatePresence>
                      {consoleLogs.map((log, i) => (
                        <motion.div
                          key={i}
                          className="mb-1 text-gray-300"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {consoleLogs.length === 0 && <span className="text-gray-600">Waiting for input...</span>}
                  </div>

                </div>
              </div>

              {/* Steps Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {[1, 2, 3, 4].map((step) => (
                  <motion.div
                    key={step}
                    className={`h-2 rounded-full transition-all duration-300 ${activeStep >= step ? 'bg-gradient-to-r from-primary to-accent w-8' : 'bg-white/20 w-2'}`}
                    animate={activeStep >= step ? { scale: [1, 1.2, 1] } : {}}
                  />
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5 border-y border-white/5">
        <motion.div
          className="container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={staggerItem} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-gradient">
                  <AnimatedCounter
                    end={stat.value}
                    duration={2000}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-gray-400 text-sm md:text-base">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20" id="features">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Whisk?</h2>
            <p className="text-gray-400 text-lg">Built for high-volume, high-quality production.</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className={`glass-hover p-8 group border-2 ${feature.borderColor} relative overflow-hidden`}
                whileHover="hover"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <motion.div
                    className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 text-white"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                  <motion.div
                    className="mt-4 flex items-center gap-2 text-primary group-hover:gap-3 transition-all"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm font-medium">Learn more</span>
                    <ChevronRight size={16} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black/20">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Creators</h2>
            <p className="text-gray-400 text-lg">Join thousands of professionals who trust Whisk</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="glass-hover p-6 relative"
                whileHover="hover"
              >
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-accent/10 to-transparent pointer-events-none"></div>
        <motion.div
          className="container relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block mb-6"
          >
            <Zap size={48} className="text-primary" />
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8">Ready to Scale?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join professional studios using Whisk to automate their product photography pipeline.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/plans">
              <motion.button
                className="btn text-xl px-12 py-6 shadow-2xl shadow-primary/40 hover:shadow-primary/60"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                View Pricing
              </motion.button>
            </Link>
            <Link href="/register">
              <motion.button
                className="btn btn-outline text-xl px-12 py-6"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
