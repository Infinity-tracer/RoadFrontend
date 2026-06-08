import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  {
    label: 'Detection Accuracy',
    value: '85%+',
    description: 'YOLOv8 trained on RDD dataset',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    label: 'Privacy Protection',
    value: '94%',
    description: 'Face & plate detection recall',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    label: 'Processing Speed',
    value: '30+ FPS',
    description: 'Real-time with GPU acceleration',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    label: 'Damage Classes',
    value: '4',
    description: 'Cracks & potholes detection',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  }
];

export default function Stats() {
  return (
    <section id="stats" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Performance Metrics</h2>
        <p className="text-slate-400">Built for accuracy, speed, and reliability</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-6 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
              {stat.icon}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-slate-300 mb-1">{stat.label}</p>
            <p className="text-xs text-slate-500">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h3 className="text-center text-xl font-semibold text-white mb-8">Powered By</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {['YOLOv8', 'PyTorch', 'FastAPI', 'OpenCV', 'React', 'TailwindCSS'].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
