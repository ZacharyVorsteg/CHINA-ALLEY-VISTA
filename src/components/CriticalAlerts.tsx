import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CriticalAlertsProps {
  issues: string[];
}

const CriticalAlerts: React.FC<CriticalAlertsProps> = ({ issues }) => {
  if (issues.length === 0) return null;

  return (
    <div className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Critical Issues Identified</h3>
            <div className="text-sm space-y-1">
              {issues.slice(0, 3).map((issue, index) => (
                <div key={index}>⚠️ {issue}</div>
              ))}
              {issues.length > 3 && (
                <div className="text-red-200">
                  +{issues.length - 3} more issues identified
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
