import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DEMO_DATA = {
  road_damage: {
    title: "Road Damage Detection Demo",
    description: "YOLOv8 detecting potholes and cracks on Indian roads",
    originalVideo: "/samples/sample_dashcam.mp4",
    type: "video",
    stats: {
      "Frames Analyzed": 747,
      "Potholes Detected": 23,
      "Cracks Detected": 41,
      "Processing Time": "24.8s",
      "Model": "YOLOv8-Small"
    },
    detections: [
      { label: "Potholes", count: 23, color: "bg-red-500" },
      { label: "Longitudinal Crack", count: 18, color: "bg-yellow-500" },
      { label: "Transverse Crack", count: 15, color: "bg-orange-500" },
      { label: "Alligator Crack", count: 8, color: "bg-purple-500" }
    ]
  },
  privacy_blur: {
    title: "Privacy Blur Demo",
    description: "Automatic face and license plate blurring for GDPR compliance",
    type: "images",
    originalImages: [
      "/demos/privacy_original_1.jpg",
      "/demos/privacy_original_2.jpg",
      "/demos/privacy_original_3.jpg",
      "/demos/privacy_original_4.jpg"
    ],
    processedImages: [
      "/demos/privacy_processed_1.jpg",
      "/demos/privacy_processed_2.jpg",
      "/demos/privacy_processed_3.jpg",
      "/demos/privacy_processed_4.jpg"
    ],
    stats: {
      "Frames Processed": 3600,
      "Faces Blurred": 12,
      "Plates Blurred": 24,
      "Processing Time": "45.2s",
      "Detection Rate": "94%"
    },
    detections: [
      { label: "Faces Detected", count: 12, color: "bg-blue-500" },
      { label: "License Plates", count: 24, color: "bg-cyan-500" }
    ]
  },
  combined: {
    title: "Combined Analysis Demo",
    description: "Privacy protection + Road damage detection in one pipeline",
    originalVideo: "/samples/sample_dashcam.mp4",
    type: "video",
    stats: {
      "Frames Processed": 747,
      "Privacy Items Blurred": 15,
      "Road Damages Found": 64,
      "Processing Time": "42.3s",
      "Pipeline": "Privacy -> Detection"
    },
    detections: [
      { label: "Potholes", count: 23, color: "bg-red-500" },
      { label: "Cracks (All Types)", count: 41, color: "bg-orange-500" },
      { label: "Faces Blurred", count: 9, color: "bg-blue-500" },
      { label: "Plates Blurred", count: 6, color: "bg-cyan-500" }
    ]
  }
};

function ImageSlideshow({ images, label }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
      <img
        src={images[currentIndex]}
        alt={`${label} frame ${currentIndex + 1}`}
        className="w-full h-full object-contain"
      />
      {/* Frame indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
      {/* Label */}
      <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 rounded text-xs text-white">
        Frame {currentIndex + 1}/{images.length}
      </div>
    </div>
  );
}

export default function DemoResults({ moduleId, onBack }) {
  const demo = DEMO_DATA[moduleId];

  const getResultSummary = () => {
    if (moduleId === 'road_damage') {
      return { text: '64 road damages detected', subtext: '23 potholes, 41 cracks' };
    }
    if (moduleId === 'privacy_blur') {
      return { text: '36 privacy items blurred', subtext: '12 faces, 24 license plates' };
    }
    return { text: 'Full pipeline complete', subtext: 'Privacy + 64 damages detected' };
  };

  const summary = getResultSummary();

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
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                  DEMO MODE - Pre-processed Results
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{demo.title}</h2>
              <p className="text-slate-400">{demo.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Original */}
            <div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Original Input
              </h3>
              {demo.type === 'video' ? (
                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                  <video
                    src={demo.originalVideo}
                    controls
                    muted
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <ImageSlideshow images={demo.originalImages} label="Original" />
              )}
            </div>

            {/* Processed */}
            <div>
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Processed Output
              </h3>
              {demo.type === 'video' ? (
                <div className="rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 aspect-video flex items-center justify-center border border-slate-700">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1">{summary.text}</h4>
                    <p className="text-slate-400 text-sm">{summary.subtext}</p>
                  </div>
                </div>
              ) : (
                <ImageSlideshow images={demo.processedImages} label="Processed" />
              )}
            </div>
          </div>

          {/* Notice for Privacy Blur */}
          {demo.type === 'images' && (
            <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <p className="text-blue-400 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Compare the license plates - blurred in processed output (right side)
              </p>
            </div>
          )}
        </div>

        {/* Stats Panel */}
        <div className="p-6 border-t border-white/10">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Stats */}
            <div className="glass-dark rounded-xl p-5">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Processing Stats
              </h4>
              <div className="space-y-3">
                {Object.entries(demo.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-slate-400">{key}</span>
                    <span className="text-white font-semibold text-lg">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detection Breakdown */}
            <div className="glass-dark rounded-xl p-5">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Detection Breakdown
              </h4>
              <div className="space-y-3">
                {demo.detections.map((det, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`w-4 h-4 rounded-full ${det.color}`}></span>
                      <span className="text-white">{det.label}</span>
                    </div>
                    <span className="text-2xl font-bold text-white">{det.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-white/10 flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all"
          >
            Try With Your Own File
          </button>
          <button
            onClick={onBack}
            className="px-6 py-4 rounded-xl bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-all"
          >
            Back to Modules
          </button>
        </div>
      </motion.div>
    </div>
  );
}
