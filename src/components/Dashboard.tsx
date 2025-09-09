'use client';

import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, DollarSign, FileText, Download, Info } from 'lucide-react';
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
import { CONFIG, totalUnits } from '@/data/config';

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
  const submittedResults = calculateFinancials(scenarios.submitted);
  
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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">CHINA ALLEY VISTA</h1>
            <p className="text-xl mb-4">Financial Analysis by Zachary Vorsteg | September 10, 2025</p>
            <div className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold text-sm ${
              currentResults.fundingGap > 2000000 || currentResults.dscr < 1.20 
                ? 'bg-red-600 hover:bg-red-700' 
                : currentResults.fundingGap > 1500000 
                  ? 'bg-amber-600 hover:bg-amber-700' 
                  : 'bg-green-600 hover:bg-green-700'
            } transition-colors`}>
              {currentResults.fundingGap > 2000000 || currentResults.dscr < 1.20 
                ? '⚠️ PROCEED WITH CONDITIONS' 
                : '✅ FEASIBLE WITH LIHTC'}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alerts Bar */}
      <CriticalAlerts issues={[...criticalIssues, ...complianceIssues]} />

      {/* Unit Count Indicator */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center">
            <Info className="h-4 w-4 mr-2 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Analysis Basis: {totalUnits} units ({CONFIG.DEFAULT_UNITS_MODE === 'BUILD_PLAN' ? 'Building Plan' : 'Exhibit E'})
              {CONFIG.TOTAL_UNITS_BUILD_PLAN !== CONFIG.TOTAL_UNITS_EXHIBIT_E && (
                <span className="ml-2 text-blue-600">
                  • Reconciliation required: {CONFIG.TOTAL_UNITS_EXHIBIT_E} (Exhibit E) vs {CONFIG.TOTAL_UNITS_BUILD_PLAN} (Plans)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Development Cost"
            value={formatCurrency(CONFIG.project.totalDevelopmentCost)}
            subtitle={`${formatCurrency(currentResults.costPerUnit)} per unit`}
            color="text-slate-700"
            icon={<DollarSign className="h-6 w-6" />}
          />
          <MetricCard
            title="Funding Gap"
            value={formatCurrency(currentResults.fundingGap)}
            subtitle={`vs ${formatCurrency(submittedResults.fundingGap)} as submitted`}
            color={getMetricColor('fundingGap', currentResults.fundingGap)}
            icon={<AlertTriangle className="h-6 w-6" />}
          />
          <MetricCard
            title="DSCR"
            value={formatRatio(currentResults.dscr)}
            subtitle={`Min ${formatRatio(CONFIG.debt.minDSCR)} required`}
            color={getMetricColor('dscr', currentResults.dscr)}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <MetricCard
            title="Return on Cost"
            value={formatPercentage(currentResults.returnOnCost)}
            subtitle="Industry target: 6-8%"
            color={getMetricColor('returnOnCost', currentResults.returnOnCost)}
            icon={<TrendingDown className="h-6 w-6" />}
          />
        </div>

        {/* Scenario Toggle */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-900">Analysis Scenario</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(scenarios).map(([key, scenario]) => (
                <button
                  key={key}
                  onClick={() => setActiveScenario(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeScenario === key
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
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
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF Report
          </button>
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel Model
          </button>
        </div>

        {/* Tabbed Interface */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
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