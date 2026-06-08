import React from 'react';

export default function Header() {
  return (
    <header className="glass-dark sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">RoadPulse</h1>
              <p className="text-xs text-slate-400">The Living Safety Network</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors text-sm">Features</a>
            <a href="#modules" className="text-slate-300 hover:text-white transition-colors text-sm">Modules</a>
            <a href="#stats" className="text-slate-300 hover:text-white transition-colors text-sm">Performance</a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              API Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
