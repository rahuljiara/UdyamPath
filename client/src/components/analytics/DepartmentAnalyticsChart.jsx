import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-elevation border border-border-color text-xs space-y-1">
        <p className="font-bold text-text-primary">{label} Department</p>
        <p className="text-primary font-semibold">
          Placement Rate: {payload[0]?.value}%
        </p>
        {payload[1] && (
          <p className="text-amber-600 font-semibold">
            Avg CTC: {payload[1]?.value} LPA
          </p>
        )}
      </div>
    );
  }
  return null;
};

const DepartmentAnalyticsChart = ({ data = [] }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="dept"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 11 }}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
          />
          <Bar
            name="Placement Rate (%)"
            dataKey="rate"
            fill="#2F8F78"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            name="Average CTC (LPA)"
            dataKey="avgCtc"
            fill="#F59E0B"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentAnalyticsChart;
