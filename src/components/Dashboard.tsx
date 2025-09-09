'use client';

import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, DollarSign, FileText, Download } from 'lucide-react';
import { 
  calculateFinancials, 
  scenarios, 
  getMetricColor, 
  formatCurrency, 
  formatPercentage, 
  formatRatio,
  getCriticalIssues,
  getComplianceIssues
} from '@/utils/calculations';
// import type { FinancialResults } from '@/utils/calculations';

// Components
import MetricCard from './MetricCard';
import CriticalAlerts from './CriticalAlerts';
import TabNavigation from './TabNavigation';
import DevelopmentBudget from './tabs/DevelopmentBudget';
import OperatingProforma from './tabs/OperatingProforma';
import SourcesUses from './tabs/SourcesUses';
import ReturnMetrics from './tabs/ReturnMetrics';
import SensitivityAnalysis from './tabs/SensitivityAnalysis';
import ComplianceCheck from './tabs/ComplianceCheck';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('budget');
  const [activeScenario, setActiveScenario] = useState('reality');
  
  // Calculate results for current scenario
  const currentResults = calculateFinancials(scenarios[activeScenario]);
  const fantasyResults = calculateFinancials(scenarios.fantasy);
  
  // Get critical issues
  const criticalIssues = getCriticalIssues(currentResults);
  const complianceIssues = getComplianceIssues();
  
  const tabs = [
    { id: 'budget', label: 'Development Budget', icon: DollarSign },
    { id: 'proforma', label: 'Operating Pro Forma', icon: TrendingUp },
    { id: 'sources', label: 'Sources & Uses', icon: FileText },
    { id: 'returns', label: 'Return Metrics', icon: TrendingUp },
    { id: 'sensitivity', label: 'Sensitivity Analysis', icon: TrendingDown },
    { id: 'compliance', label: 'Compliance Check', icon: AlertTriangle }
  ];

  const handleExportPDF = async () => {
    try {
      const { exportToPDF } = await import('@/utils/exports');
      await exportToPDF(currentResults);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    }
  };

  const handleExportExcel = async () => {
    try {
      const { exportToExcel } = await import('@/utils/exports');
      exportToExcel(currentResults);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Error exporting Excel. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">CHINA ALLEY VISTA</h1>
            <p className="text-xl mb-4">Financial Analysis by Zachary Vorsteg | September 10, 2025</p>
            <div className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${
              currentResults.fundingGap > 2000000 || currentResults.dscr < 1.20 
                ? 'bg-red-600' 
                : currentResults.fundingGap > 1500000 
                  ? 'bg-yellow-600' 
                  : 'bg-green-600'
            }`}>
              {currentResults.fundingGap > 2000000 || currentResults.dscr < 1.20 
                ? '⚠️ PROCEED WITH CONDITIONS' 
                : '✅ FEASIBLE WITH LIHTC'}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts Bar */}
      <CriticalAlerts issues={[...criticalIssues, ...complianceIssues]} />

      {/* Key Metrics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Development Cost"
            value={formatCurrency(6361829)}
            subtitle="$198,807 per unit"
            color="text-blue-600"
            icon={<DollarSign className="h-6 w-6" />}
          />
          <MetricCard
            title="Funding Gap"
            value={formatCurrency(currentResults.fundingGap)}
            subtitle={`vs ${formatCurrency(fantasyResults.fundingGap)} fantasy`}
            color={getMetricColor('fundingGap', currentResults.fundingGap)}
            icon={<AlertTriangle className="h-6 w-6" />}
          />
          <MetricCard
            title="DSCR"
            value={formatRatio(currentResults.dscr)}
            subtitle={`Min 1.20x required`}
            color={getMetricColor('dscr', currentResults.dscr)}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <MetricCard
            title="Return on Cost"
            value={formatPercentage(currentResults.returnOnCost)}
            subtitle="Below 10% target"
            color={getMetricColor('returnOnCost', currentResults.returnOnCost)}
            icon={<TrendingDown className="h-6 w-6" />}
          />
        </div>

        {/* Scenario Toggle */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Analysis Scenario</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(scenarios).map(([key, scenario]) => (
                <button
                  key={key}
                  onClick={() => setActiveScenario(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeScenario === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {scenario.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="mb-8 flex justify-end gap-4">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF Report
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel Model
          </button>
        </div>

        {/* Tabbed Interface */}
        <div className="bg-white rounded-lg shadow">
          <TabNavigation 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <div className="p-6">
            {activeTab === 'budget' && <DevelopmentBudget results={currentResults} />}
            {activeTab === 'proforma' && <OperatingProforma results={currentResults} scenario={scenarios[activeScenario]} />}
            {activeTab === 'sources' && <SourcesUses results={currentResults} />}
            {activeTab === 'returns' && <ReturnMetrics results={currentResults} />}
            {activeTab === 'sensitivity' && <SensitivityAnalysis baseResults={currentResults} />}
            {activeTab === 'compliance' && <ComplianceCheck />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
