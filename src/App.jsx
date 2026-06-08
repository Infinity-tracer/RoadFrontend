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

const API_BASE = import.meta.env.PROD
  ? 'https://roadpulse-api.onrender.com'
  : '';

function App() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [demoModule, setDemoModule] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {demoModule ? (
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
