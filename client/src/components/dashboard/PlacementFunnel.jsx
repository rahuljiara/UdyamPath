import React from 'react';
import Card from '../common/Card';
import { formatNumber } from '../../utils/formatters';

const PlacementFunnel = ({ funnel = [] }) => {
  return (
    <Card
      title="Placement Funnel"
      subtitle="Candidate pipeline drop-off across key stages"
      className="h-full"
    >
      <div className="space-y-3.5 py-1">
        {funnel.map((item, index) => {
          // Calculate relative percentage width for funnel visualization
          const barWidth = `${Math.max(item.percentage, 12)}%`;

          return (
            <div key={item.stage} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center border border-slate-200">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-text-primary">{item.stage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary">{formatNumber(item.count)}</span>
                  <span className="text-[11px] text-text-muted">({item.percentage}%)</span>
                </div>
              </div>

              {/* Funnel Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out bg-primary"
                  style={{
                    width: barWidth,
                    opacity: 1 - index * 0.12
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-text-muted">
        <span>Highest conversion: Shortlist → Interview</span>
        <span className="font-semibold text-primary">21.2% Final Select</span>
      </div>
    </Card>
  );
};

export default PlacementFunnel;
