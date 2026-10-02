import React, { useState, useEffect } from 'react';
import SOSButton from '../../components/citizen/SOSButton';
import EmergencyContactCard from '../../components/citizen/EmergencyContactCard';
import { emergencyContacts } from '../../data/mock/citizenHelpMockData';
import { MapPin, AlertTriangle, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function CitizenSOS() {
  const [sosState, setSosState] = useState('idle'); // idle, prepared, sending, success, error
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('detecting');
  const [emergencyId, setEmergencyId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          setLocationStatus('detected');
        },
        (err) => {
          console.warn('GPS denied or unavailable', err);
          setLocationStatus('unavailable');
        },
        { timeout: 10000 }
      );
    } else {
      setLocationStatus('unsupported');
    }
  }, []);

  const handleSOSTrigger = () => {
    setSosState('prepared');
  };

  const confirmSOS = async () => {
    setSosState('sending');
    setErrorMsg('');
    
    try {
      const payload = {
        emergencyType: 'general_emergency',
        description: 'SOS Button Triggered',
      };
      
      if (location) {
        payload.location = location;
      }
      
      const response = await api.post('/sos', payload);
      if (response.data.success) {
        setEmergencyId(response.data.data.sos.emergencyId);
        setSosState('success');
      } else {
        throw new Error(response.data.message || 'Failed to send SOS');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Error communicating with emergency services.');
      setSosState('error');
    }
  };

  const cancelSOS = () => {
    setSosState('idle');
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 relative">
      
      {/* Demo Warning */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-center justify-center gap-2 text-yellow-800 text-sm font-bold mb-8">
        <AlertTriangle className="w-5 h-5" />
        Demo Mode — No real emergency request will be sent to authorities.
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-red-600 tracking-tight">Emergency SOS</h1>
        <p className="text-sm font-bold text-neutral-600 mt-2">Use SOS only when you need immediate life-saving assistance.</p>
      </div>

      {sosState === 'idle' && (
        <div className="space-y-12 bg-white p-8 rounded-3xl border border-red-100 shadow-sm">
          <SOSButton onTrigger={handleSOSTrigger} />

          {locationStatus === 'detecting' && (
            <div className="max-w-sm mx-auto bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-sm font-bold text-neutral-600">Detecting location...</span>
            </div>
          )}
          {locationStatus === 'detected' && location && (
            <div className="max-w-sm mx-auto bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Current Location
                </span>
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase tracking-wider">High Accuracy</span>
              </div>
              <p className="text-sm font-bold text-neutral-900">{location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E</p>
            </div>
          )}
          {(locationStatus === 'unavailable' || locationStatus === 'unsupported') && (
            <div className="max-w-sm mx-auto bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-yellow-700 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Location Unavailable
                </span>
              </div>
              <p className="text-xs font-semibold text-yellow-800">Your GPS is disabled or unsupported. SOS will still be sent, but dispatch may be delayed.</p>
            </div>
          )}
        </div>
      )}

      {(sosState === 'prepared' || sosState === 'sending') && (
        <div className="bg-white p-8 rounded-3xl border-2 border-red-500 shadow-xl max-w-lg mx-auto text-center animate-in fade-in zoom-in duration-200">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 mb-2">Confirm Emergency Request</h2>
          <p className="text-sm font-semibold text-neutral-600 mb-8">
            Your location and details will be immediately dispatched to the nearest emergency responders.
          </p>

          <div className="bg-neutral-50 p-4 rounded-xl text-left space-y-3 mb-8 border border-neutral-200">
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase">Location</span>
              <p className="text-sm font-bold text-neutral-900">
                {location ? `${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(4)}° E` : 'Unavailable (Will send without GPS)'}
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase">Timestamp</span>
              <p className="text-sm font-bold text-neutral-900">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={cancelSOS} 
              disabled={sosState === 'sending'}
              className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button 
              onClick={confirmSOS} 
              disabled={sosState === 'sending'}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
              {sosState === 'sending' ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {sosState === 'sending' ? 'Sending...' : 'Confirm SOS'}
            </button>
          </div>
        </div>
      )}

      {sosState === 'error' && (
        <div className="bg-white p-8 rounded-3xl border border-red-200 shadow-xl max-w-lg mx-auto text-center animate-in fade-in zoom-in duration-200">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 mb-2">SOS Failed</h2>
          <p className="text-sm font-semibold text-neutral-600 mb-8">{errorMsg}</p>
          <button onClick={cancelSOS} className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition-colors">
            Try Again
          </button>
        </div>
      )}

      {sosState === 'success' && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl max-w-lg mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50"></div>
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 mb-2">SOS Request Sent</h2>
          <p className="text-sm font-semibold text-neutral-600 mb-6">
            Emergency responders have been notified. Stay calm and keep your phone accessible.
          </p>

          <div className="inline-block bg-neutral-100 px-6 py-4 rounded-2xl mb-8 border border-neutral-200">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Emergency ID</p>
            <p className="text-lg font-black text-neutral-900 font-mono tracking-widest">{emergencyId}</p>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm font-bold text-blue-600">
              <ShieldCheck className="w-4 h-4" /> Awaiting Response
            </div>
          </div>

          <button onClick={() => navigate('/citizen/dashboard')} className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition-colors">
            Return to Dashboard
          </button>
        </div>
      )}

      {/* Official Contacts */}
      <div className="mt-16">
        <h3 className="text-lg font-bold text-neutral-900 mb-4 border-b border-neutral-200 pb-2">Official Emergency Contacts</h3>
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">
          For immediate real-world danger, contact the appropriate official service.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map(contact => (
            <EmergencyContactCard key={contact.number} contact={contact} />
          ))}
        </div>
      </div>

    </div>
  );
}
