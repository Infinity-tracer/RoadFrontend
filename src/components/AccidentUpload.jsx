import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.PROD
  ? 'https://roadbackend-krwk.onrender.com'
  : 'http://localhost:8000';

const BANGALORE_LOCATIONS = [
  { key: "ArmyLayoutOldMadrasRoad", name: "Army Layout, Old Madras Road" },
  { key: "BangloreChikkabalburHighway", name: "Bangalore-Chikkaballpur Highway" },
  { key: "Banswadi", name: "Banaswadi" },
  { key: "BengalurToAnantpurRoad", name: "Bengaluru-Anantapur Road" },
  { key: "KRMarket", name: "KR Market" },
  { key: "Whitefield", name: "Whitefield" },
  { key: "ElectronicCity", name: "Electronic City" },
  { key: "Koramangala", name: "Koramangala" },
  { key: "Indiranagar", name: "Indiranagar" },
  { key: "MGRoad", name: "MG Road" },
  { key: "Jayanagar", name: "Jayanagar" },
  { key: "Malleshwaram", name: "Malleshwaram" },
  { key: "Hebbal", name: "Hebbal" },
  { key: "Yelahanka", name: "Yelahanka" },
  { key: "BTM", name: "BTM Layout" },
  { key: "HSRLayout", name: "HSR Layout" },
  { key: "Marathahalli", name: "Marathahalli" },
  { key: "KRPuram", name: "KR Puram" },
  { key: "Majestic", name: "Majestic" },
  { key: "Yeshwanthpur", name: "Yeshwanthpur" },
];

export default function AccidentUpload({ onBack }) {
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Please upload a video file');
      }
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a video file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (location) {
      formData.append('location', location);
    }

    try {
      const response = await fetch(`${API_BASE}/api/accident/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setLocation("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Report Accident</h2>
            <p className="text-slate-400">Upload dashcam footage to alert other travelers</p>
          </div>
        </div>

        {!result ? (
          <>
            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-red-500 bg-red-500/10'
                  : file
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-slate-400 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-slate-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Drop your dashcam video here</p>
                    <p className="text-slate-400 text-sm">or click to browse</p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Location Selector */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Accident Location (Optional - will auto-detect from filename)
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-red-500 focus:outline-none"
              >
                <option value="">Auto-detect from filename</option>
                {BANGALORE_LOCATIONS.map((loc) => (
                  <option key={loc.key} value={loc.key}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`w-full mt-6 py-4 rounded-xl font-semibold text-white transition-all ${
                !file || uploading
                  ? 'bg-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-orange-600 hover:shadow-lg hover:shadow-red-500/25'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Video...
                </span>
              ) : (
                'Upload & Detect Accident'
              )}
            </button>
          </>
        ) : (
          /* Results */
          <div className="space-y-6">
            <div className={`p-6 rounded-xl ${
              result.accident_detected
                ? 'bg-red-500/20 border border-red-500/50'
                : 'bg-green-500/20 border border-green-500/50'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  result.accident_detected ? 'bg-red-500' : 'bg-green-500'
                }`}>
                  {result.accident_detected ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${result.accident_detected ? 'text-red-400' : 'text-green-400'}`}>
                    {result.accident_detected ? 'Accident Detected!' : 'No Accident Detected'}
                  </h3>
                  <p className="text-slate-300">{result.message}</p>
                </div>
              </div>
            </div>

            {result.accident && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Accident Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-800/50">
                    <p className="text-slate-400 text-sm">Location</p>
                    <p className="text-white font-medium">{result.accident.location_name}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50">
                    <p className="text-slate-400 text-sm">Severity</p>
                    <p className={`font-medium capitalize ${
                      result.accident.severity === 'severe' ? 'text-red-400' :
                      result.accident.severity === 'moderate' ? 'text-orange-400' :
                      'text-yellow-400'
                    }`}>{result.accident.severity}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50">
                    <p className="text-slate-400 text-sm">Coordinates</p>
                    <p className="text-white font-medium">{result.accident.lat.toFixed(4)}, {result.accident.lng.toFixed(4)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-800/50">
                    <p className="text-slate-400 text-sm">Confidence</p>
                    <p className="text-white font-medium">{(result.detection_info.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>

                {result.accident_detected && (
                  <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-500/50">
                    <p className="text-blue-400 text-sm">
                      <strong>Alert Active:</strong> Travelers passing through {result.accident.location_name} will be notified about this incident.
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-all"
            >
              Upload Another Video
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
