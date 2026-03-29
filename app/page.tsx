'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('./worker/converter.ts', import.meta.url));
    workerRef.current.onmessage = (e) => {
      const { type, progress, blob, error } = e.data;
      if (type === 'progress') setProgress(progress);
      else if (type === 'result') {
        setResultBlob(blob);
        setIsProcessing(false);
        setProgress(100);
      } else if (type === 'error') {
        setError(error);
        setIsProcessing(false);
      }
    };
    return () => workerRef.current?.terminate();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResultBlob(null);
      setError(null);
      setProgress(0);
    }
  };

  const startConversion = () => {
    if (!file || !workerRef.current) return;
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    workerRef.current.postMessage({ file });
  };

  const downloadResult = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.split('.')[0] || 'sky_logo'}.schem`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scrollToGuide = () => {
    guideRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#050505] bg-mesh selection:bg-gold selection:text-black overflow-x-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

      {/* Hero Section Container */}
      <div className="relative min-h-screen flex items-center">
        {/* Background Text Overlay - Perfectly Centered */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-black text-gold/[0.03] select-none pointer-events-none tracking-tighter uppercase z-0 w-full text-center">
          GABAUS
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
          
          {/* Left Side: Branding */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-block px-4 py-1.5 border border-gold/20 bg-gold/5 rounded-full">
              <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">Official GaBaus Utility</span>
            </div>            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9]">
              <span className="gold-text-gradient block">GABAUS</span>
              <span className="text-white block">SKY-LOGO</span>
              <span className="gold-text-gradient block">CONVERTER</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-md font-light leading-relaxed">
              High-performance image to Sky-Logo engine.
            </p>            <div className="flex flex-wrap gap-4 pt-6">
              <a 
                href="https://github.com/RealGaBaus/GaBaus-Sky-Logo-Builder" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 border border-gold/40 rounded-2xl hover:bg-gold hover:text-black transition-all group"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold/60 group-hover:text-black/60 transition-colors">Related Project</p>
                  <p className="text-sm font-black">Sky-Logo Builder</p>
                </div>
              </a>

              <button 
                onClick={scrollToGuide}
                className="flex items-center gap-3 px-6 py-3 border border-gold/40 rounded-2xl hover:bg-gold hover:text-black transition-all group"
              >
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gold/60 group-hover:text-black/60 transition-colors">Quick Tutorial</p>
                  <p className="text-sm font-black">Technical Guide</p>
                </div>
              </button>
            </div>
          </div>

          {/* Right Side: UI Panel */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="glass-card p-1 rounded-[2.5rem] shadow-2xl relative">
              <div className="bg-black/80 rounded-[2.2rem] p-8 md:p-12 space-y-8 border border-white/5">
                
                {/* Uploader */}
                <label className="block group cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-gold/20 group-hover:border-gold/50 transition-all duration-500 bg-white/[0.02] p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {file ? (
                      <div>
                        <h3 className="text-white text-xl font-bold truncate max-w-[250px] mx-auto">{file.name}</h3>
                        <p className="text-gold/40 text-xs mt-1 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-white/80 text-lg font-medium">Select your blueprint</h3>
                        <p className="text-gold/20 text-xs mt-1 uppercase tracking-widest">DRAG & DROP OR BROWSE</p>
                      </div>
                    )}
                  </div>
                </label>

                {/* Progress & Controls */}
                <div className="space-y-6">
                  {isProcessing && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gold/60">
                        <span>Analyzing Pixels</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold shadow-[0_0_15px_#d4af37] transition-all duration-300" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center">
                      {error}
                    </div>
                  )}

                  {!isProcessing && !resultBlob && (
                    <button
                      onClick={startConversion}
                      disabled={!file}
                      className="w-full group relative overflow-hidden py-5 bg-gold disabled:bg-gray-800 disabled:opacity-50 text-black font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] hover:-translate-y-1"
                    >
                      <span className="relative z-10">Initialize Process</span>
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </button>
                  )}

                  {resultBlob && (
                    <button
                      onClick={downloadResult}
                      className="w-full py-5 border-2 border-gold text-gold font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 hover:bg-gold hover:text-black hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)]"
                    >
                      Download Schematic
                    </button>
                  )}
                </div>

                {/* Legend */}
                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-black border border-gold/40 rounded-full" />
                    <span className="text-[10px] font-bold uppercase text-gold/40 tracking-wider">Obsidian</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#9F81D6] border border-gold/40 rounded-full" />
                    <span className="text-[10px] font-bold uppercase text-gold/40 tracking-wider">Crying</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <section ref={guideRef} className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10 border-t border-white/5">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight gold-text-gradient uppercase">Technical Guide</h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-light">The essential steps for a perfect conversion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              step: '01',
              title: 'Blueprint Colors',
              desc: 'Image must use Pure Black (#000000) for Obsidian and Purple (#9F81D6) for Crying Obsidian. Use transparency for empty areas.'
            },
            {
              step: '02',
              title: 'The Process',
              desc: 'Upload your image and click Initialize. Once finished, download the .schem file. Works with any resolution.'
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-8 rounded-3xl space-y-4 border-gold/20 hover:border-gold transition-all duration-500">
              <span className="text-5xl font-black gold-text-gradient block">{item.step}</span>
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
