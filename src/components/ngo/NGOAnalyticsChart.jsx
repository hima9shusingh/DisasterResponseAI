import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function NGOAnalyticsChart({ data, dataKey1, dataKey2, color1, color2, label1, label2 }) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`color_${dataKey1}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color1} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color1} stopOpacity={0}/>
            </linearGradient>
            {dataKey2 && (
              <linearGradient id={`color_${dataKey2}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color2} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color2} stopOpacity={0}/>
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
          />
          <Area type="monotone" dataKey={dataKey1} name={label1} stroke={color1} strokeWidth={3} fillOpacity={1} fill={`url(#color_${dataKey1})`} />
          {dataKey2 && (
            <Area type="monotone" dataKey={dataKey2} name={label2} stroke={color2} strokeWidth={3} fillOpacity={1} fill={`url(#color_${dataKey2})`} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
