import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import ModuleSelector from './components/ModuleSelector';
import UploadSection from './components/UploadSection';
import ResultsViewer from './components/ResultsViewer';
import DemoResults from './components/DemoResults';
import Stats from './components/Stats';
import Footer from './components/Footer';
import AccidentUpload from './components/AccidentUpload';
import RouteChecker from './components/RouteChecker';

const API_BASE = import.meta.env.PROD
  ? 'https://roadpulse-api.onrender.com'
  : 'http://localhost:8000';

function App() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [demoModule, setDemoModule] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'accident-upload', 'route-checker'

  const handleProcess = useCallback(async (file, options) => {
    setProcessing(true);
    setError(null);
    setOriginalFile(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', options.mode);
    formData.append('confidence', options.confidence);
    formData.append('blur_faces', options.blurFaces);
    formData.append('blur_plates', options.blurPlates);
    formData.append('blur_method', options.blurMethod);

    const endpoint = file.type.startsWith('video/')
      ? '/api/process/video'
      : '/api/process/image';

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const data = await response.json();
      setResult({
        ...data,
        outputUrl: `${API_BASE}${data.output_url}`,
        fileType: file.type.startsWith('video/') ? 'video' : 'image'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleReset = () => {
    setResult(null);
    setOriginalFile(null);
    setError(null);
  };

  const handleDemo = (moduleId) => {
    setDemoModule(moduleId);
  };

  const handleBackFromDemo = () => {
    setDemoModule(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedModule(null);
    setDemoModule(null);
    handleReset();
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Navigation Bar for Alert System */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            <button
              onClick={() => handlePageChange('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                currentPage === 'home'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Road Analysis
            </button>
            <button
              onClick={() => handlePageChange('accident-upload')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                currentPage === 'accident-upload'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Report Accident
            </button>
            <button
              onClick={() => handlePageChange('route-checker')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                currentPage === 'route-checker'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Check Route
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Accident Upload Page */}
          {currentPage === 'accident-upload' ? (
            <motion.div
              key="accident-upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AccidentUpload onBack={() => handlePageChange('home')} />
            </motion.div>
          ) : currentPage === 'route-checker' ? (
            <motion.div
              key="route-checker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RouteChecker onBack={() => handlePageChange('home')} />
            </motion.div>
          ) : demoModule ? (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button
                onClick={handleBackFromDemo}
                className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Modules
              </button>
              <DemoResults moduleId={demoModule} onBack={handleBackFromDemo} />
            </motion.div>
          ) : !selectedModule ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero />
              <ModuleSelector onSelect={setSelectedModule} onDemo={handleDemo} />
              <Stats />
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <button
                onClick={() => {
                  setSelectedModule(null);
                  handleReset();
                }}
                className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Modules
              </button>

              {!result ? (
                <UploadSection
                  module={selectedModule}
                  onProcess={handleProcess}
                  processing={processing}
                  error={error}
                />
              ) : (
                <ResultsViewer
                  result={result}
                  originalUrl={originalFile}
                  onReset={handleReset}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;
