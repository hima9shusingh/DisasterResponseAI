import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, BrainCircuit, Activity, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AssessmentHistoryTable from '../../components/ai/AssessmentHistoryTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { aiAssessmentService } from '../../services/aiAssessmentService';

export default function AIHistory() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await aiAssessmentService.getAssessments();
        if (response.success) {
          // map backend format to the expected table format
          const mapped = response.data.assessments.map(a => ({
            id: a._id || a.assessmentId,
            assessmentId: a.assessmentId,
            createdAt: a.createdAt,
            disasterType: a.classification,
            location: a.incidentId?.location?.address || 'Unknown Location',
            severity: a.finalSeverity || a.severity,
            confidence: Math.round((a.confidence || 0) * 100),
            status: a.reviewStatus === 'needs_review' ? 'Analyzed' : 'Reviewed',
            reviewStatus: a.reviewStatus
          }));
          setAssessments(mapped);
        }
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCount = assessments.filter(a => new Date(a.createdAt).toISOString().split('T')[0] === today).length;
    
    const criticalCount = assessments.filter(a => (a.severity || '').toLowerCase() === 'critical').length;
    
    const avgConf = assessments.length > 0 
      ? Math.round(assessments.reduce((acc, curr) => acc + curr.confidence, 0) / assessments.length)
      : 0;

    const reviewed = assessments.filter(a => a.status === 'Reviewed').length;
    const pending = assessments.filter(a => a.status === 'Analyzed').length;

    const distribution = [
      { name: 'Low', count: 0, color: '#facc15' },
      { name: 'Medium', count: 0, color: '#fb923c' },
      { name: 'High', count: 0, color: '#ef4444' },
      { name: 'Critical', count: 0, color: '#b91c1c' }
    ];

    assessments.forEach(a => {
      const sev = (a.severity || '').toLowerCase();
      const target = distribution.find(d => d.name.toLowerCase() === sev);
      if (target) {
        target.count++;
      }
    });

    return { todayCount, criticalCount, avgConf, reviewed, pending, distribution };
  }, [assessments]);

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-6">
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <button 
          onClick={() => navigate('/government/ai-assessment')}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">AI Assessment History</h1>
          <p className="text-sm font-semibold text-neutral-500 mt-1">Review past automated damage assessments and confidence metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><BrainCircuit className="w-6 h-6" /></div>
          <div>
            <p className="text-2xl font-black text-neutral-900">{stats.todayCount}</p>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1">Assessments Today</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"><Activity className="w-6 h-6" /></div>
          <div>
            <p className="text-2xl font-black text-neutral-900">{stats.criticalCount}</p>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1">Critical Severity</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Average Confidence</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${stats.avgConf}%` }}></div></div>
            <span className="text-sm font-black text-indigo-700">{stats.avgConf}%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase">Reviewed</span>
            <span className="text-xs font-black text-green-600">{stats.reviewed}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-neutral-500 uppercase">Pending</span>
            <span className="text-xs font-black text-orange-600">{stats.pending}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-neutral-200 shadow-sm">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
              <p className="text-sm font-semibold text-neutral-500">Loading history...</p>
            </div>
          ) : (
            <AssessmentHistoryTable assessments={assessments} />
          )}
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-6">Severity Distribution</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#737373' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a3a3a3' }} />
                <RechartsTooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
