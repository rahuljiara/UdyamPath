import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import Card from '../common/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-border-color shadow-dropdown text-xs">
        <p className="font-semibold text-text-primary mb-1.5">{label} 2024-25</p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className="font-semibold text-text-primary">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PlacementOverviewChart = ({ monthlyTrend = [], departmentDistribution = [] }) => {
  const [viewType, setViewType] = useState('monthly'); // 'monthly' | 'dept'

  return (
    <Card
      title="Placement Velocity & Trends"
      subtitle={viewType === 'monthly' ? 'Cumulative offers & students placed over the season' : 'Department-wise placement distribution'}
      action={
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 text-xs">
          <button
            type="button"
            onClick={() => setViewType('monthly')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              viewType === 'monthly'
                ? 'bg-white text-primary shadow-xs font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Monthly Trend
          </button>
          <button
            type="button"
            onClick={() => setViewType('dept')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              viewType === 'dept'
                ? 'bg-white text-primary shadow-xs font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            By Department
          </button>
        </div>
      }
      className="h-full"
    >
      <div className="h-[280px] w-full pt-2">
        {viewType === 'monthly' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2F8F78" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2F8F78" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94D0BF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94D0BF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="placed"
                name="Placed Students"
                stroke="#2F8F78"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorPlaced)"
              />
              <Area
                type="monotone"
                dataKey="offers"
                name="Total Offers"
                stroke="#64748B"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorOffers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="placed" name="Placed Students" fill="#2F8F78" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar dataKey="total" name="Total Students" fill="#E2E8F0" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
            <span>Placed Students</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
            <span>{viewType === 'monthly' ? 'Total Offers Issued' : 'Total Department Intake'}</span>
          </div>
        </div>
        <span className="font-medium text-text-primary">86.1% Placement Conversion</span>
      </div>
    </Card>
  );
};

export default PlacementOverviewChart;
