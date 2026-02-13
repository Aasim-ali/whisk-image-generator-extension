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
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

export default function HomeClient() {
  // Animation State
  const [activeStep, setActiveStep] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulation Sequence
  useEffect(() => {
    const sequence = async () => {
      while (true) {
        // Reset
        setActiveStep(0);
        setConsoleLogs([]);
        setIsGenerating(false);
        await new Promise(r => setTimeout(r, 1000));

        // Step 1: Select Images
        setActiveStep(1);
        await new Promise(r => setTimeout(r, 1500));
        setConsoleLogs(prev => [...prev, "📁 Connected to folder: Jewelry_Summer_2024"]);

        // Step 2: Templates
        setActiveStep(2);
        await new Promise(r => setTimeout(r, 1500));
        setConsoleLogs(prev => [...prev, "📝 Applied Photography Template: 'Luxury Cinematic'"]);

        // Step 3: Start
        setActiveStep(3);
        await new Promise(r => setTimeout(r, 1000));
        setIsGenerating(true);
        setConsoleLogs(prev => [...prev, "▶ STARTING WHISK AUTOMATION BOT..."]);

        // Console Logs
        const logs = [
          "✨ Processing Image 1/5...",
          "✓ Generated: Ring_Front_View.jpg",
          "✨ Processing Image 2/5...",
          "✓ Generated: Ring_Side_View.jpg",
          "✨ Processing Image 3/5...",
          "✓ Generated: Bracelet_Flatlay.jpg"
        ];

        for (const log of logs) {
          setConsoleLogs(prev => [...prev, log]);
          await new Promise(r => setTimeout(r, 800));
        }

        await new Promise(r => setTimeout(r, 4000));
      }
    };
    sequence();
  }, []);

  const features = [
    {
      icon: <Folder size={32} />,
      title: "Batch Processing",
      description: "Connect a local folder and process hundreds of images automatically. No manual uploading required."
    },
    {
      icon: <Settings size={32} />,
      title: "Smart Templates",
      description: "Save your best prompts as templates. Apply them to different product lines with a single click."
    },
    {
      icon: <Terminal size={32} />,
      title: "Live Monitoring",
      description: "Watch the progress in real-time with our detailed console. Detects errors and retries automatically."
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
      content: "WhiskAutomator has completely transformed our product photography workflow. What used to take days now takes hours!",
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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-bold text-gray-900">Live & 100% Free to Use</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-8xl font-black mb-6 leading-[1.1] tracking-tight text-gray-900 px-4 md:px-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              Generate with <br />
              <span className="bg-primary px-4 rounded-2xl md:rounded-3xl inline-block mt-2">WhiskAutomator</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              One-Click Bulk Google Whisk AI Image Generator.
              Automate your workflow and download hundreds of images instantly.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/register">
                <motion.button
                  className="px-12 py-5 rounded-3xl bg-primary text-black text-2xl font-black shadow-2xl shadow-primary/40 flex items-center gap-3 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  Try it now
                  <ChevronRight size={28} className="transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-8 justify-center mt-12 text-gray-500 font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-green" />
                <span>100% Free to Use</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-blue" />
                <span>Chrome Web Store</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-purple" />
                <span>Google Labs Compatible</span>
              </div>
            </motion.div>
          </div>

          {/* Simulation / Mockup Section */}
          <motion.div
            className="mt-20 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative bg-gray-50 border border-gray-200 rounded-[3rem] shadow-2xl shadow-black/5 overflow-hidden p-4">
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Whisk Automated Workflow - Active</div>
                  <div className="w-10" />
                </div>

                <div className="p-8 grid lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${activeStep === 1 ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5 scale-[1.02]' : 'bg-gray-50 border-gray-100 opacity-40'}`}>
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeStep === 1 ? 'bg-primary text-black' : 'bg-gray-200 text-gray-500'}`}>
                          <Folder size={20} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Select Images</h3>
                      </div>
                      <p className="text-sm text-gray-500 font-bold ml-14">Click to select your product folder</p>
                    </div>

                    <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${activeStep === 2 ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5 scale-[1.02]' : 'bg-gray-50 border-gray-100 opacity-40'}`}>
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeStep === 2 ? 'bg-primary text-black' : 'bg-gray-200 text-gray-500'}`}>
                          <FileText size={20} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Apply Templates</h3>
                      </div>
                      <p className="text-sm text-gray-500 font-bold ml-14">Choose your AI photography style</p>
                    </div>

                    <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${activeStep === 3 ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5 scale-[1.02]' : 'bg-gray-50 border-gray-100 opacity-40'}`}>
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeStep === 3 ? 'bg-primary text-black' : 'bg-gray-200 text-gray-500'}`}>
                          <Play size={20} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Bulk Generate</h3>
                      </div>
                      <p className="text-sm text-gray-500 font-bold ml-14">Sit back while we do the work</p>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-[2.5rem] p-8 font-mono text-sm shadow-2xl relative min-h-[400px] border border-gray-800">
                    <div className="flex items-center gap-2 text-gray-500 mb-6 border-b border-white/5 pb-4">
                      <Terminal size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Live Bot Console v2.0</span>
                    </div>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {consoleLogs.map((log, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-gray-300 flex gap-3"
                          >
                            <span className="text-primary font-bold">➜</span>
                            <span className="flex-1">{log}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {isGenerating && (
                        <motion.div
                          className="flex items-center gap-3 text-primary font-black mt-6 bg-primary/10 p-4 rounded-2xl border border-primary/20"
                          animate={{ opacity: [1, 0.6, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <Zap size={18} className="animate-pulse" />
                          Automating Generations...
                        </motion.div>
                      )}
                    </div>
                    <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest border-t border-white/5 pt-4">
                      <span>Status: Working</span>
                      <span>Tasks: ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 text-center">
            {stats.map((stat, index) => (
              <motion.div key={index} className="space-y-4">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter">
                  <AnimatedCounter
                    end={stat.value}
                    duration={2000}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32" id="features">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center mb-20 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-gray-900 tracking-tight">Powerful Automation.</h2>
            <p className="text-gray-500 text-xl font-bold">WhiskAutomator is built for high-volume production with efficiency at its core.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-12 rounded-[3.5rem] bg-gray-50 border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-3 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-20 h-20 rounded-3xl bg-white border border-gray-100 flex items-center justify-center mb-10 text-gray-900 shadow-sm group-hover:bg-primary group-hover:border-primary transition-all duration-500 group-hover:rotate-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-4xl font-black mb-6 text-gray-900">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-bold text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-32 bg-gray-50/50">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center mb-24 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-gray-900 tracking-tight text-center">Get Started.</h2>
            <p className="text-gray-500 text-xl font-bold">Launch your first bulk generation in less than 60 seconds.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 -translate-y-12" />

            {[
              {
                step: "01",
                title: "Install Extension",
                desc: "Add WhiskAutomator to your Chrome browser with one click from the Web Store.",
                icon: <Zap size={24} />
              },
              {
                step: "02",
                title: "Connect Folder",
                desc: "Select the local folder containing your product images. No uploads needed.",
                icon: <Folder size={24} />
              },
              {
                step: "03",
                title: "Run Automator",
                desc: "Sit back and watch as we generate and download hundreds of images instantly.",
                icon: <Play size={24} />
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                className="relative text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="w-24 h-24 rounded-[2rem] bg-white border-4 border-gray-50 flex items-center justify-center mx-auto mb-10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <div className="text-primary group-hover:rotate-12 transition-transform duration-500">
                    {step.icon}
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                  <span className="text-6xl font-black text-gray-100 group-hover:text-primary/10 transition-colors duration-500">{step.step}</span>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-6">{step.title}</h3>
                <p className="text-gray-500 font-bold leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-gray-900 text-white rounded-[5rem] mx-4 mb-4 overflow-hidden relative border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-center">Trusted by Experts.</h2>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={32} fill="#FFDD00" color="#FFDD00" />)}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-2xl font-bold leading-relaxed mb-10 italic text-gray-200">"{t.content}"</p>
                <div className="flex items-center gap-6 pt-6 border-t border-white/10">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary text-black font-black flex items-center justify-center text-2xl shadow-lg shadow-primary/20">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white">{t.name}</h4>
                    <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] mt-1">{t.role} @ {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center mb-20 max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-gray-900 tracking-tight text-center">Questions?</h2>
            <p className="text-gray-500 text-xl font-bold text-center">Everything you need to know about WhiskAutomator.</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                q: "Is WhiskAutomator really free?",
                a: "Yes! WhiskAutomator is 100% free to use for all basic features. We believe in providing the best automation tools for everyone."
              },
              {
                q: "Do I need to upload my images?",
                a: "No. WhiskAutomator works directly with your local files to ensure maximum speed and privacy. We never store or upload your product images."
              },
              {
                q: "Which browsers are supported?",
                a: "Currently, we focus on providing a premium experience for Google Chrome users via our dedicated extension."
              },
              {
                q: "Is it safe to use with Google Whisk?",
                a: "Absolutely. Our bot mimics human interactions and follows all Google Whisk safety protocols to ensure your account remains in good standing."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h4 className="text-2xl font-black text-gray-900 mb-4">{faq.q}</h4>
                <p className="text-gray-500 font-bold leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            className="max-w-5xl mx-auto p-20 rounded-[5rem] bg-primary text-black relative overflow-hidden shadow-2xl shadow-primary/30"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 blur-[80px] rounded-full" />
            <h2 className="text-6xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tight">Ready to <br />Automate?</h2>
            <p className="text-2xl font-black mb-16 max-w-xl mx-auto opacity-70 leading-relaxed uppercase tracking-tighter">Join 10,000+ creators and start generating product images at scale today.</p>
            <Link href="/register">
              <button className="px-16 py-8 rounded-[2rem] bg-black text-white text-3xl font-black shadow-2xl transition-all hover:scale-105 hover:-translate-y-2 active:scale-95">
                Start Generating Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
