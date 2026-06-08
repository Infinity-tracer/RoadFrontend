import React from 'react';
import { motion } from 'framer-motion';

const modules = [
  {
    id: 'road_damage',
    name: 'Road Damage Detection',
    description: 'Detect potholes, cracks, and road surface damage using YOLOv8',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    color: 'from-orange-500 to-red-600',
    features: ['Longitudinal Cracks', 'Transverse Cracks', 'Alligator Cracks', 'Potholes'],
    accuracy: '85%+'
  },
  {
    id: 'privacy_blur',
    name: 'Privacy Blur',
    description: 'Automatically blur faces and license plates for GDPR compliance',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    ),
    color: 'from-blue-500 to-cyan-600',
    features: ['Face Detection', 'License Plate Detection', 'Gaussian Blur', 'Pixelate'],
    accuracy: '94%'
  },
  {
    id: 'combined',
    name: 'Combined Analysis',
    description: 'Privacy protection + Road damage detection in a single pipeline',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    color: 'from-purple-500 to-pink-600',
    features: ['Full Pipeline', 'Privacy First', 'Damage Analysis', 'Cloud Ready'],
    accuracy: 'Best of Both'
  }
];

export default function ModuleSelector({ onSelect, onDemo }) {
  return (
    <section id="modules" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Choose Your Module</h2>
        <p className="text-slate-400">Select a processing mode based on your requirements</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(module)}
            className="glass rounded-2xl p-6 cursor-pointer group hover:border-white/40 transition-all duration-300"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
              {module.icon}
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">{module.name}</h3>
            <p className="text-slate-400 text-sm mb-4">{module.description}</p>

            <div className="space-y-2 mb-4">
              {module.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 mb-4">
              <span className="text-xs text-slate-500">Accuracy</span>
              <span className={`text-sm font-semibold bg-gradient-to-r ${module.color} bg-clip-text text-transparent`}>
                {module.accuracy}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onDemo(module.id); }}
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onSelect(module); }}
                className={`flex-1 py-2 px-3 rounded-lg bg-gradient-to-r ${module.color} text-white text-sm font-medium hover:shadow-lg transition-all`}
              >
                Try Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
