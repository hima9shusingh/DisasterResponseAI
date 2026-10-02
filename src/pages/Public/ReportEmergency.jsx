import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Waves, Flame, Activity, Wind, Mountain, Car, Building2, FlaskConical, HeartPulse, Factory,
  MapPin, Map, AlertTriangle, Users, Image as ImageIcon, Video, UploadCloud, CheckCircle2, ChevronRight,
  ChevronLeft, CloudRain, Phone, ShieldAlert, ArrowLeft, Send, Loader2
} from 'lucide-react';
import { incidentService } from '../../services/incidentService';
import { getApiErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { weatherService } from '../../services/weatherService';

const disasterTypes = [
  { id: 'flood', label: 'Flood', icon: Waves, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/50' },
  { id: 'fire', label: 'Fire', icon: Flame, color: 'text-red-400', bg: 'bg-red-500/10', border: 'hover:border-red-500/50' },
  { id: 'earthquake', label: 'Earthquake', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'hover:border-amber-500/50' },
  { id: 'cyclone', label: 'Cyclone', icon: Wind, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'hover:border-teal-500/50' },
  { id: 'landslide', label: 'Landslide', icon: Mountain, color: 'text-orange-600', bg: 'bg-orange-600/10', border: 'hover:border-orange-600/50' },
  { id: 'accident', label: 'Road Accident', icon: Car, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500/50' },
  { id: 'collapse', label: 'Building Collapse', icon: Building2, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'hover:border-slate-500/50' },
  { id: 'chemical', label: 'Chemical Leak', icon: FlaskConical, color: 'text-green-400', bg: 'bg-green-500/10', border: 'hover:border-green-500/50' },
  { id: 'medical', label: 'Medical Emergency', icon: HeartPulse, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'hover:border-pink-500/50' },
  { id: 'industrial', label: 'Industrial Accident', icon: Factory, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/50' },
];

const severityLevels = [
  { id: 'low', label: 'Low', color: 'bg-green-500/20 text-green-400 border-green-500/30 hover:border-green-500/60' },
  { id: 'medium', label: 'Medium', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:border-amber-500/60' },
  { id: 'high', label: 'High', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:border-orange-500/60' },
  { id: 'critical', label: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/30 hover:border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]' },
];

const peopleAffectedRanges = ['1-5', '5-20', '20-100', '100+'];

const ReportEmergency = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: null,
    location: { address: '', state: '', district: '', city: '', pincode: '', landmark: '' },
    details: { severity: '', peopleAffected: '', description: '', contact: '', name: '' },
    files: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submittedIncidentId, setSubmittedIncidentId] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await weatherService.getWeatherByCity('Delhi');
        if (response.success) {
          setWeatherData(response.data);
        } else {
          setWeatherData(null);
        }
      } catch (err) {
        setWeatherData(null);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData({
          ...formData,
          location: {
            ...formData.location,
            latitude,
            longitude,
            address: formData.location.address || `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          }
        });
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please enter it manually.');
        setIsGettingLocation(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    setApiError('');
    setIsSubmitting(true);
    try {
      const typeMapper = {
        accident: 'road_accident',
        collapse: 'building_collapse',
        chemical: 'chemical_leak',
        medical: 'medical_emergency',
        industrial: 'industrial_accident'
      };
      
      const peopleMapper = {
        '1-5': 5,
        '5-20': 20,
        '20-100': 100,
        '100+': 200
      };

      const payload = {
        disasterType: typeMapper[formData.type] || formData.type,
        description: formData.details.description,
        severity: formData.details.severity,
        location: {
          address: formData.location.address,
          city: formData.location.city || '',
          district: formData.location.district || '',
          state: formData.location.state || '',
          pincode: formData.location.pincode || '',
          latitude: formData.location.latitude,
          longitude: formData.location.longitude
        },
        peopleAffected: peopleMapper[formData.details.peopleAffected] || 0,
        contactNumber: formData.details.contact || ''
      };

      let response;
      if (isAuthenticated) {
        response = await incidentService.createIncident(payload);
      } else {
        // Fallback to direct api call since incidentService might not have it
        const { default: api } = await import('../../services/api.js');
        const res = await api.post('/incidents/public', payload);
        response = res.data;
      }

      if (response.success) {
        const newIncidentId = response.data.incident._id; // Need mongo ID for evidence upload
        
        // Upload evidence if files exist
        if (formData.files.length > 0) {
          try {
            const evidenceData = new FormData();
            formData.files.forEach(file => {
              evidenceData.append('files', file);
            });
            
            if (isAuthenticated) {
              await incidentService.uploadEvidence(newIncidentId, evidenceData);
            } else {
              const { default: api } = await import('../../services/api.js');
              await api.post(`/incidents/${newIncidentId}/evidence`, evidenceData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            }
          } catch (uploadError) {
            console.error('Evidence upload failed:', uploadError);
            // We don't block success screen, just log it. Incident is already created.
          }
        }

        setSubmittedIncidentId(response.data.incident.incidentId); // Use friendly ID for display
        setStep(6);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setApiError('Your session has expired or you need to be logged in to report. Please login again.');
      } else if (!error.response) {
        setApiError('Unable to connect to ADRRAS server. Please try again.');
      } else {
        setApiError(getApiErrorMessage(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.type !== null;
      case 2: return formData.location.address.length > 5;
      case 3: return formData.details.severity && formData.details.peopleAffected && formData.details.description.length > 10;
      case 4: return true; // Optional
      default: return true;
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFormData(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
    }
  };
  
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
    }
  };

  const steps = [
    { num: 1, title: 'Disaster Type' },
    { num: 2, title: 'Location' },
    { num: 3, title: 'Emergency Details' },
    { num: 4, title: 'Evidence' },
    { num: 5, title: 'Review' }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-50 font-sans pb-24 relative overflow-hidden selection:bg-primary/30">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[500px] rounded-full bg-red-900/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-medium">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        
        {step < 6 && (
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">Report Emergency</h1>
            <p className="text-slate-400 text-lg">Help emergency response teams by providing accurate information.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Wizard Area */}
          <div className="col-span-1 lg:col-span-8">
            
            {step < 6 && (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative z-10">
                {/* Progress Indicator */}
                <div className="mb-10">
                  <div className="flex justify-between mb-3 relative">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full"></div>
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                      style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>
                    
                    {steps.map((s) => (
                      <div key={s.num} className="relative z-10 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s.num ? 'bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'bg-slate-800 text-slate-400 border-2 border-slate-700'}`}>
                          {step > s.num ? <CheckCircle2 size={20} /> : s.num}
                        </div>
                        <span className={`absolute top-12 text-[10px] md:text-xs font-semibold whitespace-nowrap uppercase tracking-wider ${step >= s.num ? 'text-primary' : 'text-slate-500'}`}>
                          {s.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="min-h-[400px] mt-16">
                  <AnimatePresence mode="wait">
                    {/* STEP 1: DISASTER TYPE */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-2xl font-bold mb-6">Choose Disaster Type</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {disasterTypes.map((type) => {
                            const isSelected = formData.type === type.id;
                            return (
                              <div 
                                key={type.id}
                                onClick={() => {
                                  setFormData({...formData, type: type.id});
                                  setTimeout(() => setStep(2), 200);
                                }}
                                className={`cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 border ${isSelected ? `border-${type.color.split('-')[1]}-500 bg-${type.color.split('-')[1]}-500/20 shadow-[0_0_20px_rgba(0,0,0,0)] transform scale-[1.02] bg-slate-800/80 ring-1 ring-${type.color.split('-')[1]}-500` : `bg-slate-800/30 border-slate-700/50 ${type.border} hover:bg-slate-800/50`}`}
                                style={isSelected ? { boxShadow: `0 0 20px var(--${type.color.split('-')[1]})` } : {}}
                              >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isSelected ? type.color : 'text-slate-400'} ${type.bg} transition-colors`}>
                                  <type.icon size={28} className={isSelected ? 'animate-pulse' : ''} />
                                </div>
                                <span className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>{type.label}</span>
                              </div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: LOCATION */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-2xl font-bold mb-6">Location Information</h2>
                        
                        <button 
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                          className="w-full py-4 mb-8 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                          {isGettingLocation ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
                          {isGettingLocation ? 'Detecting Location...' : 'Use Current Location'}
                        </button>
                        
                        {locationError && (
                          <div className="text-red-400 text-sm mb-4 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                            {locationError}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 mb-8">
                          <div className="h-px bg-slate-800 flex-1"></div>
                          <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Or enter manually</span>
                          <div className="h-px bg-slate-800 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-slate-400">Complete Address *</label>
                            <input 
                              type="text" 
                              value={formData.location.address}
                              onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                              placeholder="e.g. 123 Main Street, Near City Mall"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">City</label>
                            <input type="text" value={formData.location.city} onChange={(e) => setFormData({...formData, location: {...formData.location, city: e.target.value}})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">District</label>
                            <input type="text" value={formData.location.district} onChange={(e) => setFormData({...formData, location: {...formData.location, district: e.target.value}})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">State</label>
                            <input type="text" value={formData.location.state} onChange={(e) => setFormData({...formData, location: {...formData.location, state: e.target.value}})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Pincode</label>
                            <input type="text" value={formData.location.pincode} onChange={(e) => setFormData({...formData, location: {...formData.location, pincode: e.target.value}})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" />
                          </div>
                          <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-slate-400">Landmark (Optional)</label>
                            <input type="text" value={formData.location.landmark} onChange={(e) => setFormData({...formData, location: {...formData.location, landmark: e.target.value}})} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" />
                          </div>
                        </div>

                        {/* Location Preview Card dummy */}
                        {formData.location.address.length > 5 && (
                          <div className="mt-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center">
                              <Map size={24} className="text-slate-400" />
                            </div>
                            <div>
                              <div className="text-sm text-slate-400">Location Preview</div>
                              <div className="font-semibold">{formData.location.address}</div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* STEP 3: EMERGENCY DETAILS */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-2xl font-bold mb-8">Emergency Details</h2>
                        
                        <div className="mb-8">
                          <label className="text-sm font-medium text-slate-400 block mb-3">Severity Level *</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {severityLevels.map((sev) => (
                              <div 
                                key={sev.id}
                                onClick={() => setFormData({...formData, details: {...formData.details, severity: sev.id}})}
                                className={`cursor-pointer rounded-xl p-3 text-center border font-semibold transition-all ${formData.details.severity === sev.id ? sev.color : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                              >
                                {sev.label}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-8">
                          <label className="text-sm font-medium text-slate-400 block mb-3">Estimated People Affected *</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {peopleAffectedRanges.map((range) => (
                              <div 
                                key={range}
                                onClick={() => setFormData({...formData, details: {...formData.details, peopleAffected: range}})}
                                className={`cursor-pointer rounded-xl p-3 text-center border font-semibold transition-all ${formData.details.peopleAffected === range ? 'bg-primary/20 border-primary text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                              >
                                {range}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-8 space-y-2 relative">
                          <label className="text-sm font-medium text-slate-400">Description of Emergency *</label>
                          <textarea 
                            value={formData.details.description}
                            onChange={(e) => setFormData({...formData, details: {...formData.details, description: e.target.value}})}
                            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600 resize-none"
                            placeholder="Please describe the current situation, structural damage, immediate needs, etc."
                            maxLength={500}
                          ></textarea>
                          <div className="absolute bottom-3 right-4 text-xs text-slate-500">
                            {formData.details.description.length} / 500
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Emergency Contact Number (Optional)</label>
                            <input 
                              type="tel" 
                              value={formData.details.contact}
                              onChange={(e) => setFormData({...formData, details: {...formData.details, contact: e.target.value}})}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">Your Name (Optional)</label>
                            <input 
                              type="text" 
                              value={formData.details.name}
                              onChange={(e) => setFormData({...formData, details: {...formData.details, name: e.target.value}})}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all" 
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: EVIDENCE */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-2xl font-bold mb-2">Evidence Upload</h2>
                        <p className="text-slate-400 mb-8">Upload images or videos of the incident to help responders assess the situation. (Optional)</p>
                        
                        <div 
                          className="w-full h-48 border-2 border-dashed border-slate-700 rounded-3xl bg-slate-900/50 flex flex-col items-center justify-center transition-all hover:border-primary hover:bg-slate-900 cursor-pointer relative"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <input 
                            type="file" 
                            multiple 
                            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileInput}
                          />
                          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                            <UploadCloud size={32} />
                          </div>
                          <div className="font-semibold text-lg mb-1">Drag & Drop files here</div>
                          <div className="text-sm text-slate-500">or click to browse from your device</div>
                        </div>

                        <div className="flex gap-4 mt-4 text-xs font-medium text-slate-500 justify-center">
                          <span className="flex items-center gap-1"><ImageIcon size={14} /> JPG, PNG, WEBP</span>
                          <span className="flex items-center gap-1"><Video size={14} /> MP4, MOV</span>
                          <span>Max 20MB per file</span>
                        </div>

                        {formData.files.length > 0 && (
                          <div className="mt-8">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Uploaded Files ({formData.files.length})</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              {formData.files.map((file, i) => (
                                <div key={i} className="relative group rounded-xl bg-slate-800 border border-slate-700 p-3 flex items-center gap-3">
                                  <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center shrink-0">
                                    {file.type?.includes('video') ? <Video size={20} className="text-indigo-400" /> : <ImageIcon size={20} className="text-blue-400" />}
                                  </div>
                                  <div className="overflow-hidden">
                                    <div className="text-sm font-medium text-white truncate">{file.name || `file_image_${i}.jpg`}</div>
                                    <div className="text-xs text-slate-500">{(file.size ? file.size / 1024 / 1024 : 1.2).toFixed(2)} MB</div>
                                  </div>
                                  <button 
                                    onClick={() => setFormData(prev => ({ ...prev, files: prev.files.filter((_, index) => index !== i) }))}
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {formData.files.length === 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 opacity-50">
                             {/* Dummy preview cards when empty */}
                             {[1,2].map(i => (
                               <div key={i} className="rounded-xl border border-dashed border-slate-700 h-16 flex items-center justify-center">
                                 <ImageIcon size={20} className="text-slate-600" />
                               </div>
                             ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* STEP 5: REVIEW */}
                    {step === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h2 className="text-2xl font-bold mb-8">Review & Submit</h2>
                        
                        <div className="space-y-6">
                          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700/50">
                              <h3 className="font-semibold text-lg text-white">Disaster Type</h3>
                              <button onClick={() => setStep(1)} className="text-sm text-primary hover:underline font-medium">Edit</button>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                                <AlertTriangle size={20} />
                              </div>
                              <div className="text-lg font-bold capitalize">{formData.type || 'Not Selected'}</div>
                            </div>
                          </div>

                          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700/50">
                              <h3 className="font-semibold text-lg text-white">Location</h3>
                              <button onClick={() => setStep(2)} className="text-sm text-primary hover:underline font-medium">Edit</button>
                            </div>
                            <div className="text-slate-300 leading-relaxed">
                              {formData.location.address || 'Address not provided'}
                            </div>
                          </div>

                          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700/50">
                              <h3 className="font-semibold text-lg text-white">Details</h3>
                              <button onClick={() => setStep(3)} className="text-sm text-primary hover:underline font-medium">Edit</button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <div className="text-sm text-slate-500 mb-1">Severity</div>
                                <div className="font-semibold capitalize text-white">{formData.details.severity || 'N/A'}</div>
                              </div>
                              <div>
                                <div className="text-sm text-slate-500 mb-1">People Affected</div>
                                <div className="font-semibold text-white">{formData.details.peopleAffected || 'N/A'}</div>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-slate-500 mb-1">Description</div>
                              <div className="text-sm text-slate-300 bg-slate-900 p-4 rounded-xl border border-slate-800">
                                {formData.details.description || 'No description provided.'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex gap-3 text-red-200 text-sm">
                            <ShieldAlert size={20} className="text-red-400 shrink-0" />
                            <p>By submitting this form, you confirm that the information provided is accurate to the best of your knowledge. False reporting may lead to penalties.</p>
                          </div>

                          {apiError && (
                            <div className="bg-red-900/40 border border-red-500 rounded-xl p-4 text-red-400 flex gap-2">
                              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-bold">Submission Failed</h4>
                                <p className="text-sm">{apiError}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 pt-8 border-t border-slate-800 flex justify-between">
                  <button 
                    onClick={prevStep}
                    disabled={step === 1}
                    className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                  
                  {step < 5 ? (
                    <button 
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${isStepValid() ? 'bg-primary hover:bg-blue-600 text-white shadow-blue-500/30' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                    >
                      Next Step
                      <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                        isSubmitting ? 'bg-red-800 text-slate-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/30 ring-2 ring-offset-2 ring-offset-slate-900 ring-red-500/50'
                      }`}
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      {isSubmitting ? 'Submitting...' : 'Submit Emergency'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 6: SUCCESS */}
            {step === 6 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl text-center relative z-10 overflow-hidden"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-green-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                  className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                >
                  <CheckCircle2 size={48} className="text-green-500" />
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Emergency Submitted Successfully</h2>
                <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">Your report has been broadcasted to the nearest active command centers and response teams.</p>
                
                <div className="inline-block bg-slate-800/80 border border-slate-700 rounded-2xl p-6 mb-10 w-full max-w-sm mx-auto">
                  <div className="text-sm text-slate-400 mb-1 uppercase tracking-widest font-semibold">Incident ID</div>
                  <div className="text-3xl font-mono font-bold text-white mb-6 tracking-wider">{submittedIncidentId || 'INC-PENDING'}</div>
                  
                  <div className="flex items-center justify-between py-3 border-t border-slate-700">
                    <span className="text-sm text-slate-400">Status</span>
                    <span className="text-sm font-semibold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                      Pending Verification
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-slate-700">
                    <span className="text-sm text-slate-400">Est. Response</span>
                    <span className="text-sm font-bold text-white">10 - 15 Minutes</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {isAuthenticated && (
                    <Link to={`/citizen/reports`} className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-primary hover:bg-blue-600 text-white transition-all shadow-lg shadow-blue-500/30">
                      Track Incident
                    </Link>
                  )}
                  <button className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all border border-slate-700">
                    Download Report (PDF)
                  </button>
                  <Link to="/" className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-slate-400 hover:text-white transition-all">
                    Back Home
                  </Link>
                </div>
              </motion.div>
            )}

          </div>

          {/* Right Side Panel */}
          <div className="col-span-1 lg:col-span-4 hidden md:flex flex-col gap-6">
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                <ShieldAlert size={20} className="text-primary" />
                Emergency Tips
              </h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                  <p>Stay calm and ensure you are in a safe location before reporting.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                  <p>Provide landmarks to help responders find the exact location faster.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                  <p>Do not hang up if contacted by a dispatcher until instructed to do so.</p>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
                <CloudRain size={20} className="text-blue-400" />
                Current Weather
              </h3>
              {weatherLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-slate-500" />
                </div>
              ) : weatherData ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-3xl font-bold text-white">{weatherData.temperature}°C</div>
                      <div className="text-sm text-slate-400">{weatherData.condition}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <CloudRain size={24} />
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-2">Conditions</div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">Humidity {weatherData.humidity}%</span>
                    <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">Wind {weatherData.windSpeed}km/h</span>
                  </div>
                </>
              ) : (
                <div className="text-slate-400 text-sm">Weather data temporarily unavailable.</div>
              )}
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-400">
                <Phone size={20} />
                Quick Dial
              </h3>
              <div className="space-y-3">
                <a href="tel:112" className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 transition-all group">
                  <span className="font-medium text-slate-300 group-hover:text-white">National Emergency</span>
                  <span className="font-bold text-red-400 tracking-wider">112</span>
                </a>
                <a href="tel:108" className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-green-500/50 transition-all group">
                  <span className="font-medium text-slate-300 group-hover:text-white">Ambulance</span>
                  <span className="font-bold text-green-400 tracking-wider">108</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportEmergency;
