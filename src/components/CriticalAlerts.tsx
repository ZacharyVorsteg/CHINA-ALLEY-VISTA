import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CriticalAlertsProps {
  issues: string[];
}

const CriticalAlerts: React.FC<CriticalAlertsProps> = ({ issues }) => {
  if (issues.length === 0) return null;

  return (
    <div className="bg-red-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Issues Requiring Attention</h3>
            <div className="text-sm space-y-2">
              {issues.slice(0, 4).map((issue, index) => (
                <div key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-red-300 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="text-red-50">{issue}</span>
                </div>
              ))}
              {issues.length > 4 && (
                <div className="text-red-200 font-medium mt-3">
                  +{issues.length - 4} additional issues identified in detailed analysis
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlerts;