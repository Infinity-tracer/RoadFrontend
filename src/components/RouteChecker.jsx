import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_BASE = import.meta.env.PROD
  ? 'https://roadpulse-api.onrender.com'
  : 'http://localhost:8000';

const BANGALORE_LOCATIONS = [
  { key: "ArmyLayoutOldMadrasRoad", name: "Army Layout, Old Madras Road", lat: 13.0180, lng: 77.6500 },
  { key: "BangloreChikkabalburHighway", name: "Bangalore-Chikkaballpur Highway", lat: 13.1500, lng: 77.5500 },
  { key: "Banswadi", name: "Banaswadi", lat: 13.0150, lng: 77.6400 },
  { key: "BengalurToAnantpurRoad", name: "Bengaluru-Anantapur Road", lat: 12.9200, lng: 77.4500 },
  { key: "KRMarket", name: "KR Market", lat: 12.9622, lng: 77.5788 },
  { key: "Whitefield", name: "Whitefield", lat: 12.9698, lng: 77.7500 },
  { key: "ElectronicCity", name: "Electronic City", lat: 12.8399, lng: 77.6770 },
  { key: "Koramangala", name: "Koramangala", lat: 12.9352, lng: 77.6245 },
  { key: "Indiranagar", name: "Indiranagar", lat: 12.9784, lng: 77.6408 },
  { key: "MGRoad", name: "MG Road", lat: 12.9756, lng: 77.6062 },
  { key: "Jayanagar", name: "Jayanagar", lat: 12.9308, lng: 77.5838 },
  { key: "Malleshwaram", name: "Malleshwaram", lat: 13.0035, lng: 77.5710 },
  { key: "Hebbal", name: "Hebbal", lat: 13.0358, lng: 77.5970 },
  { key: "Yelahanka", name: "Yelahanka", lat: 13.1007, lng: 77.5963 },
  { key: "BTM", name: "BTM Layout", lat: 12.9166, lng: 77.6101 },
  { key: "HSRLayout", name: "HSR Layout", lat: 12.9116, lng: 77.6389 },
  { key: "Marathahalli", name: "Marathahalli", lat: 12.9591, lng: 77.6974 },
  { key: "KRPuram", name: "KR Puram", lat: 12.9988, lng: 77.6960 },
  { key: "Majestic", name: "Majestic", lat: 12.9772, lng: 77.5713 },
  { key: "Yeshwanthpur", name: "Yeshwanthpur", lat: 13.0280, lng: 77.5500 },
];

// Custom marker icons
const createIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    background: ${color};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const startIcon = createIcon('#22c55e');
const endIcon = createIcon('#ef4444');
const accidentIcon = L.divIcon({
  className: 'accident-marker',
  html: `<div style="
    background: #f97316;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 1.5s infinite;
  ">
    <span style="color: white; font-size: 16px; font-weight: bold;">!</span>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Component to fit map bounds
function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
}

export default function RouteChecker({ onBack }) {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [activeAccidents, setActiveAccidents] = useState([]);
  const [error, setError] = useState(null);

  // Fetch active accidents on mount
  useEffect(() => {
    fetchActiveAccidents();
    const interval = setInterval(fetchActiveAccidents, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveAccidents = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/accident/active`);
      if (response.ok) {
        const data = await response.json();
        setActiveAccidents(data.accidents || []);
      }
    } catch (err) {
      console.error('Failed to fetch accidents:', err);
    }
  };

  const handleCheckRoute = async () => {
    if (!startLocation || !endLocation) {
      setError('Please select both start and end locations');
      return;
    }

    if (startLocation === endLocation) {
      setError('Start and end locations must be different');
      return;
    }

    setChecking(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/route/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start_location: startLocation,
          end_location: endLocation,
        }),
      });

      if (!response.ok) throw new Error('Route check failed');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to check route');
    } finally {
      setChecking(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStartLocation("");
    setEndLocation("");
    setError(null);
  };

  const getLocationCoords = (key) => {
    const loc = BANGALORE_LOCATIONS.find(l => l.key === key);
    return loc ? [loc.lat, loc.lng] : null;
  };

  const startCoords = getLocationCoords(startLocation);
  const endCoords = getLocationCoords(endLocation);

  // Get all positions for map bounds
  const getAllPositions = () => {
    const positions = [];
    if (startCoords) positions.push(startCoords);
    if (endCoords) positions.push(endCoords);
    activeAccidents.forEach(acc => positions.push([acc.lat, acc.lng]));
    return positions;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .leaflet-container { background: #1e293b; }
      `}</style>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Route Input Panel */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Plan Your Route</h2>
              <p className="text-slate-400 text-sm">Check for accidents on your route</p>
            </div>
          </div>

          {!result ? (
            <div className="space-y-4">
              {/* Start Location */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs text-white">A</span>
                    Start Location
                  </span>
                </label>
                <select
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select start point</option>
                  {BANGALORE_LOCATIONS.map((loc) => (
                    <option key={loc.key} value={loc.key}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {/* Visual connector */}
              <div className="flex justify-center">
                <div className="w-0.5 h-8 bg-slate-600 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-500" />
                </div>
              </div>

              {/* End Location */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">B</span>
                    End Location
                  </span>
                </label>
                <select
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select destination</option>
                  {BANGALORE_LOCATIONS.map((loc) => (
                    <option key={loc.key} value={loc.key}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleCheckRoute}
                disabled={!startLocation || !endLocation || checking}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
                  !startLocation || !endLocation || checking
                    ? 'bg-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/25'
                }`}
              >
                {checking ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Checking Route...
                  </span>
                ) : 'Check Route Safety'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Result Display */}
              <div className={`p-4 rounded-xl ${
                result.has_accidents
                  ? 'bg-red-500/20 border border-red-500/50'
                  : 'bg-green-500/20 border border-green-500/50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    result.has_accidents ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                    {result.has_accidents ? (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${result.has_accidents ? 'text-red-400' : 'text-green-400'}`}>
                      {result.has_accidents ? 'Warning!' : 'Route Clear'}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {result.has_accidents
                        ? `${result.accidents.length} accident(s) on route`
                        : 'No accidents detected'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Accident Details */}
              {result.has_accidents && result.accidents.map((accident, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-white font-medium text-sm">{accident.location_name}</p>
                  <p className="text-slate-400 text-xs">Severity: <span className="text-orange-400 capitalize">{accident.severity}</span></p>
                </div>
              ))}

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-all"
              >
                Check Another Route
              </button>
            </div>
          )}

          {/* Active Accidents List */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Active Alerts ({activeAccidents.length})</h4>
              <button onClick={fetchActiveAccidents} className="text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {activeAccidents.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">No active accidents</p>
              ) : (
                activeAccidents.map((acc) => (
                  <div key={acc.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50">
                    <div className={`w-2 h-2 rounded-full ${
                      acc.severity === 'severe' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'
                    }`} />
                    <span className="text-slate-300 text-sm truncate">{acc.location_name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Map Panel */}
        <div className="lg:col-span-2 glass rounded-2xl p-4 h-[600px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Bangalore Live Map</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-slate-400">Start</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-slate-400">End</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-slate-400">Accident</span>
              </span>
            </div>
          </div>

          <div className="h-[calc(100%-40px)] rounded-xl overflow-hidden">
            <MapContainer
              center={[12.9716, 77.5946]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Fit bounds to show all markers */}
              {getAllPositions().length > 0 && (
                <FitBounds positions={getAllPositions()} />
              )}

              {/* Start Marker */}
              {startCoords && (
                <Marker position={startCoords} icon={startIcon}>
                  <Popup>
                    <strong>Start:</strong> {BANGALORE_LOCATIONS.find(l => l.key === startLocation)?.name}
                  </Popup>
                </Marker>
              )}

              {/* End Marker */}
              {endCoords && (
                <Marker position={endCoords} icon={endIcon}>
                  <Popup>
                    <strong>Destination:</strong> {BANGALORE_LOCATIONS.find(l => l.key === endLocation)?.name}
                  </Popup>
                </Marker>
              )}

              {/* Route Line */}
              {startCoords && endCoords && (
                <Polyline
                  positions={[startCoords, endCoords]}
                  color="#3b82f6"
                  weight={4}
                  opacity={0.8}
                  dashArray="10, 10"
                />
              )}

              {/* Accident Markers */}
              {activeAccidents.map((accident) => (
                <Marker
                  key={accident.id}
                  position={[accident.lat, accident.lng]}
                  icon={accidentIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <strong className="text-red-600">Accident Alert!</strong>
                      <p>{accident.location_name}</p>
                      <p className="text-sm text-gray-600">Severity: {accident.severity}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
