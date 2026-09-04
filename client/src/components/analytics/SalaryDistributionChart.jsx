import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

const colors = ['#94A3B8', '#2F8F78', '#38BDF8', '#F59E0B', '#A855F7'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-elevation border border-border-color text-xs space-y-0.5">
        <p className="font-bold text-text-primary">Bracket: {label}</p>
        <p className="text-primary font-semibold">
          {payload[0]?.value} Placed Students
        </p>
        <p className="text-text-muted text-[10px]">
          Category: {payload[0]?.payload?.label}
        </p>
      </div>
    );
  }
  return null;
};

const SalaryDistributionChart = ({ data = [] }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="range"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            name="Students Placed"
            dataKey="count"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryDistributionChart;
