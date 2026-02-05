'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Folder, Image as ImageIcon, Video, Play,
  Settings, Terminal, Upload, X, Check,
  FileText, Clock, ChevronRight
} from 'lucide-react';

export default function Home() {
  // Animation State
  const [activeStep, setActiveStep] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [prompts, setPrompts] = useState(['', '', '']);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  return (
    <div className="min-h-screen relative text-white selection:bg-primary selection:text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[#030014] -z-20"></div>
      <div className="fixed inset-0 bg-grid opacity-20 -z-10"></div>
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent -z-10 blur-3xl"></div>

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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-primary/30">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-sm font-medium text-gray-300">v2.0 Now Available</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Automate Your <br />
                <span className="text-gradient">Creative Workflow</span>
              </h1>

              <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Generate thousands of professional product images in minutes.
                Select files, apply templates, and let Whisk handle the rest.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register">
                  <button className="btn text-lg px-8 py-4 flex items-center justify-center gap-2">
                    <Upload size={20} />
                    Get Extension
                  </button>
                </Link>
                <Link href="#demo">
                  <button className="btn btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2">
                    <Play size={20} />
                    Watch Demo
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Live Simulation */}
            <motion.div
              className="lg:w-1/2 w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative glass rounded-xl border border-white/10 shadow-2xl overflow-hidden bg-[#0a0a0a]">
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
                  <div className={`transition-opacity duration-500 ${activeStep === 1 ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                        <ImageIcon size={16} /> Select Subject Images
                      </h3>
                      {selectedFolder && <span className="text-xs text-green-400">✓ {selectedFolder}</span>}
                    </div>
                    <div className="flex gap-3">
                      <button className={`flex-1 py-3 rounded-lg border border-dashed border-white/20 flex items-center justify-center gap-2 text-sm transition-colors ${activeStep === 1 ? 'bg-primary/20 border-primary' : 'bg-white/5'}`}>
                        <Folder size={16} /> Choose Folder
                      </button>
                      <button className="flex-1 py-3 rounded-lg border border-dashed border-white/20 flex items-center justify-center gap-2 text-sm bg-white/5">
                        <ImageIcon size={16} /> Choose Images
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Prompts */}
                  <div className={`transition-opacity duration-500 ${activeStep === 2 ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                        <FileText size={16} /> Prompts & Templates
                      </h3>
                      <button className={`text-xs px-2 py-1 rounded bg-white/10 flex items-center gap-1 ${activeStep === 2 ? 'text-primary' : ''}`}>
                        <Settings size={12} /> Manage Templates
                      </button>
                    </div>
                    <div className="space-y-2">
                      {prompts.map((p, i) => (
                        <div key={i} className="h-8 bg-white/5 rounded border border-white/10 px-3 flex items-center text-xs text-gray-400 truncate">
                          {p || "Enter prompt or select template..."}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Controls */}
                  <div className={`transition-opacity duration-500 ${activeStep === 3 ? 'opacity-100' : 'opacity-50'}`}>
                    <button className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isGenerating ? 'bg-red-500/20 text-red-400 border border-red-500' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                      {isGenerating ? <><Video size={18} /> Stop Generation</> : <><Play size={18} /> Start Generation</>}
                    </button>
                  </div>

                  {/* Step 4: Console */}
                  <div className="bg-black/50 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto border border-white/5 custom-scrollbar">
                    <div className="text-gray-500 mb-2 border-b border-white/10 pb-1 flex items-center gap-2">
                      <Terminal size={12} /> Progress Console
                    </div>
                    {consoleLogs.map((log, i) => (
                      <div key={i} className="mb-1 text-gray-300">
                        <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
                      </div>
                    ))}
                    {consoleLogs.length === 0 && <span className="text-gray-600">Waiting for input...</span>}
                  </div>

                </div>
              </div>

              {/* Steps Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStep >= step ? 'bg-primary w-6' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black/20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Whisk?</h2>
            <p className="text-gray-400">Built for high-volume, high-quality production.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 hover:bg-white/5 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Folder size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Batch Processing</h3>
              <p className="text-gray-400 leading-relaxed">
                Connect a local folder and process hundreds of images automatically. No manual uploading required.
              </p>
            </div>
            <div className="glass p-8 hover:bg-white/5 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Settings size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Templates</h3>
              <p className="text-gray-400 leading-relaxed">
                Save your best prompts as templates. Apply them to different product lines with a single click.
              </p>
            </div>
            <div className="glass p-8 hover:bg-white/5 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Terminal size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Live Monitoring</h3>
              <p className="text-gray-400 leading-relaxed">
                Watch the progress in real-time with our detailed console. Detects errors and retries automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"></div>
        <div className="container relative z-10">
          <h2 className="text-5xl font-bold mb-8">Ready to Scale?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join professional studios using Whisk to automate their product photography pipeline.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/plans">
              <button className="btn text-xl px-10 py-5 shadow-2xl shadow-primary/40 hover:shadow-primary/60">
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer is handled by layout/component, but adding simple copyright here if needed or relying on layout */}
      <footer className="py-10 border-t border-white/5 text-center text-gray-500 text-sm">
        <div className="container">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">W</div>
            <span className="text-white font-bold text-lg">Whisk</span>
          </div>
          <p>© {new Date().getFullYear()} Whisk Image Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
