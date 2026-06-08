import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const SAMPLE_VIDEO_URL = '/samples/sample_dashcam.mp4';

export default function UploadSection({ module, onProcess, processing, error }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [options, setOptions] = useState({
    confidence: 0.5,
    blurFaces: true,
    blurPlates: true,
    blurMethod: 'gaussian'
  });

  const loadSampleVideo = async () => {
    setLoadingSample(true);
    try {
      const response = await fetch(SAMPLE_VIDEO_URL);
      const blob = await response.blob();
      const sampleFile = new File([blob], 'sample_dashcam.mp4', { type: 'video/mp4' });
      setFile(sampleFile);
    } catch (err) {
      console.error('Failed to load sample:', err);
    } finally {
      setLoadingSample(false);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.startsWith('image/') || droppedFile.type.startsWith('video/'))) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (file) {
      onProcess(file, { ...options, mode: module.id });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8"
      >
        {/* Module Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center text-white`}>
            {module.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{module.name}</h2>
            <p className="text-slate-400">{module.description}</p>
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-orange-500 bg-orange-500/10'
              : file
              ? 'border-green-500 bg-green-500/10'
              : 'border-slate-600 hover:border-slate-500'
          }`}
        >
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {file ? (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-slate-400 text-sm">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB | {file.type}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="text-slate-400 hover:text-white text-sm underline"
              >
                Change file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Drop your file here</p>
                <p className="text-slate-400 text-sm">or click to browse</p>
              </div>
              <p className="text-slate-500 text-xs">Supports: Images (PNG, JPG) and Videos (MP4)</p>
            </div>
          )}
        </div>

        {/* Try Sample Button */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm mb-3">Don't have a file? Try our sample dashcam video:</p>
          <button
            onClick={loadSampleVideo}
            disabled={loadingSample || processing}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingSample ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading Sample...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Try Sample Dashcam Video (7 MB)
              </>
            )}
          </button>
        </div>

        {/* Options */}
        <div className="mt-8 space-y-6">
          {/* Confidence Slider */}
          <div>
            <label className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Confidence Threshold</span>
              <span className="text-orange-400 font-medium">{options.confidence.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={options.confidence}
              onChange={(e) => setOptions({ ...options, confidence: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Privacy Options (for privacy_blur and combined) */}
          {(module.id === 'privacy_blur' || module.id === 'combined') && (
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.blurFaces}
                  onChange={(e) => setOptions({ ...options, blurFaces: e.target.checked })}
                  className="w-5 h-5 rounded accent-orange-500"
                />
                <span className="text-slate-300">Blur Faces</span>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.blurPlates}
                  onChange={(e) => setOptions({ ...options, blurPlates: e.target.checked })}
                  className="w-5 h-5 rounded accent-orange-500"
                />
                <span className="text-slate-300">Blur License Plates</span>
              </label>

              <div className="col-span-2">
                <label className="block text-sm text-slate-300 mb-2">Blur Method</label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-3 rounded-lg cursor-pointer text-center transition-all ${
                    options.blurMethod === 'gaussian'
                      ? 'bg-orange-500/20 border border-orange-500 text-orange-400'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                  }`}>
                    <input
                      type="radio"
                      name="blurMethod"
                      value="gaussian"
                      checked={options.blurMethod === 'gaussian'}
                      onChange={(e) => setOptions({ ...options, blurMethod: e.target.value })}
                      className="sr-only"
                    />
                    Gaussian Blur
                  </label>
                  <label className={`flex-1 p-3 rounded-lg cursor-pointer text-center transition-all ${
                    options.blurMethod === 'pixelate'
                      ? 'bg-orange-500/20 border border-orange-500 text-orange-400'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                  }`}>
                    <input
                      type="radio"
                      name="blurMethod"
                      value="pixelate"
                      checked={options.blurMethod === 'pixelate'}
                      onChange={(e) => setOptions({ ...options, blurMethod: e.target.value })}
                      className="sr-only"
                    />
                    Pixelate
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!file || processing}
          className={`mt-8 w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
            !file || processing
              ? 'bg-slate-700 cursor-not-allowed'
              : `bg-gradient-to-r ${module.color} hover:shadow-lg hover:shadow-orange-500/25`
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Process File'
          )}
        </button>
      </motion.div>
    </div>
  );
}
