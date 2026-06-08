import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ResultsViewer({ result, originalUrl, onReset }) {
  const [viewMode, setViewMode] = useState('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const isVideo = result.fileType === 'video';

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(x, 0), 100));
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Processing Complete</h2>
              <p className="text-slate-400">{result.message}</p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'side-by-side'
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('slider')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'slider'
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Slider Compare
              </button>
              <button
                onClick={() => setViewMode('processed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'processed'
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Processed Only
              </button>
            </div>
          </div>
        </div>

        {/* Media Viewer */}
        <div className="p-6">
          {viewMode === 'side-by-side' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Original</h3>
                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                  {isVideo ? (
                    <video src={originalUrl} controls className="w-full h-full object-contain" />
                  ) : (
                    <img src={originalUrl} alt="Original" className="w-full h-full object-contain" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Processed</h3>
                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                  {isVideo ? (
                    <video src={result.outputUrl} controls className="w-full h-full object-contain" />
                  ) : (
                    <img src={result.outputUrl} alt="Processed" className="w-full h-full object-contain" />
                  )}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'slider' && !isVideo && (
            <div
              ref={containerRef}
              className="relative rounded-xl overflow-hidden bg-black aspect-video cursor-ew-resize"
              onMouseDown={handleMouseDown}
            >
              {/* Original Image (Full) */}
              <img src={originalUrl} alt="Original" className="absolute inset-0 w-full h-full object-contain" />

              {/* Processed Image (Clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={result.outputUrl}
                  alt="Processed"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
                />
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 rounded-lg text-white text-sm">
                Processed
              </div>
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 rounded-lg text-white text-sm">
                Original
              </div>
            </div>
          )}

          {viewMode === 'slider' && isVideo && (
            <div className="text-center py-12 text-slate-400">
              <p>Slider comparison not available for videos.</p>
              <p className="text-sm">Please use Side by Side view.</p>
            </div>
          )}

          {viewMode === 'processed' && (
            <div className="rounded-xl overflow-hidden bg-black aspect-video">
              {isVideo ? (
                <video src={result.outputUrl} controls className="w-full h-full object-contain" />
              ) : (
                <img src={result.outputUrl} alt="Processed" className="w-full h-full object-contain" />
              )}
            </div>
          )}
        </div>

        {/* Stats & Detections */}
        <div className="p-6 border-t border-white/10">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Stats */}
            {result.stats && (
              <div className="glass-dark rounded-xl p-4">
                <h4 className="text-sm font-medium text-slate-400 mb-3">Processing Stats</h4>
                <div className="space-y-2">
                  {Object.entries(result.stats).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-slate-400">{key.replace(/_/g, ' ')}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detections */}
            {result.detections && result.detections.length > 0 && (
              <div className="glass-dark rounded-xl p-4 md:col-span-2">
                <h4 className="text-sm font-medium text-slate-400 mb-3">Detections ({result.detections.length})</h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {result.detections.slice(0, 10).map((det, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${
                          det.label === 'Potholes' ? 'bg-red-500' :
                          det.label.includes('Longitudinal') ? 'bg-yellow-500' :
                          det.label.includes('Transverse') ? 'bg-orange-500' :
                          'bg-purple-500'
                        }`}></span>
                        <span className="text-white text-sm">{det.label}</span>
                      </div>
                      <span className="text-slate-400 text-sm">{(det.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                  {result.detections.length > 10 && (
                    <p className="text-center text-slate-500 text-sm pt-2">
                      +{result.detections.length - 10} more detections
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-white/10 flex gap-4">
          <a
            href={result.outputUrl}
            download
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-center hover:shadow-lg hover:shadow-orange-500/25 transition-all"
          >
            Download Processed File
          </a>
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-all"
          >
            Process Another
          </button>
        </div>
      </motion.div>
    </div>
  );
}
