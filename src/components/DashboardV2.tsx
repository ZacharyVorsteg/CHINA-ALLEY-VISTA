'use client';

import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, DollarSign, FileText, Download, Info, ToggleRight } from 'lucide-react';

const DashboardV2: React.FC = () => {
  const [activeTab, setActiveTab] = useState('budget');
  const [activeScenario, setActiveScenario] = useState<'EXHIBIT_E_30' | 'CONCEPT_32'>('EXHIBIT_E_30');
  
  // Mock data for demonstration (would be replaced with actual model)
  const currentModel = {
    totalUnits: activeScenario === 'EXHIBIT_E_30' ? 30 : 32,
    totalDevelopmentCost: 6361829,
    grossPotentialRent: activeScenario === 'EXHIBIT_E_30' ? 303804 : 400800,
    netOperatingIncome: activeScenario === 'EXHIBIT_E_30' ? 183741 : 273368,
    dscr: activeScenario === 'EXHIBIT_E_30' ? 1.15 : 1.28,
    fundingGap: activeScenario === 'EXHIBIT_E_30' ? -2393870 : -2393870,
    costPerUnit: activeScenario === 'EXHIBIT_E_30' ? 212061 : 198807
  };
  
  const tabs = [
    { id: 'budget', label: 'Development Budget', icon: DollarSign },
    { id: 'proforma', label: 'Operating Pro Forma', icon: TrendingUp },
    { id: 'sources', label: 'Sources & Uses', icon: FileText },
    { id: 'returns', label: 'Return Metrics', icon: TrendingUp },
    { id: 'sensitivity', label: 'Sensitivity Analysis', icon: TrendingDown },
    { id: 'compliance', label: 'Compliance Check', icon: AlertTriangle }
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRatio = (value: number, decimals = 2): string => {
    return `${value.toFixed(decimals)}x`;
  };

  const getStatusColor = (metric: string, value: number): string => {
    switch (metric) {
      case 'dscr':
        if (value >= 1.35) return 'text-green-800';
        if (value >= 1.25) return 'text-green-700';
        if (value >= 1.20) return 'text-amber-700';
        return 'text-red-800';
      default:
        return 'text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-3 tracking-tight">CHINA ALLEY VISTA</h1>
            <p className="text-xl mb-6 text-slate-200 font-medium">Financial Analysis by Zachary Vorsteg | September 10, 2025</p>
            <div className={`inline-flex items-center px-8 py-4 rounded-lg font-bold text-lg shadow-2xl ${
              currentModel.dscr < 1.20 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : currentModel.fundingGap > 1500000 
                  ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
            } transition-all duration-200`}>
              {currentModel.dscr < 1.20 
                ? '⚠️ PROCEED WITH CONDITIONS' 
                : '✅ FEASIBLE'}
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Toggle */}
      <div className="bg-white border-b-2 border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Info className="h-6 w-6 text-slate-600" />
              <span className="text-lg font-bold text-slate-900">
                Analysis Scenario:
              </span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveScenario('EXHIBIT_E_30')}
                  className={`flex items-center px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
                    activeScenario === 'EXHIBIT_E_30'
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'bg-white text-slate-800 border-2 border-slate-300 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  <ToggleRight className="h-5 w-5 mr-2" />
                  Exhibit E (30 Units)
                </button>
                <button
                  onClick={() => setActiveScenario('CONCEPT_32')}
                  className={`flex items-center px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
                    activeScenario === 'CONCEPT_32'
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'bg-white text-slate-800 border-2 border-slate-300 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  <ToggleRight className="h-5 w-5 mr-2" />
                  Concept (32 Units)
                </button>
              </div>
            </div>
            
            <div className="text-lg font-bold text-slate-800">
              Current: {currentModel.totalUnits} units | GPR: {formatCurrency(currentModel.grossPotentialRent)}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="bg-white border-2 border-slate-300 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Total Development Cost</h3>
              <DollarSign className="h-8 w-8 text-slate-700" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">
              {formatCurrency(currentModel.totalDevelopmentCost)}
            </div>
            <p className="text-sm font-medium text-slate-700">{formatCurrency(currentModel.costPerUnit)} per unit</p>
          </div>

          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-green-900">Net Operating Income</h3>
              <TrendingUp className="h-8 w-8 text-green-700" />
            </div>
            <div className="text-3xl font-bold text-green-900 mb-2">
              {formatCurrency(currentModel.netOperatingIncome)}
            </div>
            <p className="text-sm font-medium text-green-800">
              {formatCurrency(currentModel.netOperatingIncome / currentModel.totalUnits)} per unit
            </p>
          </div>

          <div className={`border-2 rounded-lg p-6 shadow-lg ${
            currentModel.dscr >= 1.20 
              ? 'bg-green-50 border-green-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${
                currentModel.dscr >= 1.20 ? 'text-green-900' : 'text-red-900'
              }`}>
                DSCR
              </h3>
              <TrendingUp className={`h-8 w-8 ${
                currentModel.dscr >= 1.20 ? 'text-green-700' : 'text-red-700'
              }`} />
            </div>
            <div className={`text-3xl font-bold mb-2 ${getStatusColor('dscr', currentModel.dscr)}`}>
              {formatRatio(currentModel.dscr)}
            </div>
            <p className={`text-sm font-medium ${
              currentModel.dscr >= 1.20 ? 'text-green-800' : 'text-red-800'
            }`}>
              Min 1.20x required
            </p>
          </div>

          <div className={`border-2 rounded-lg p-6 shadow-lg ${
            Math.abs(currentModel.fundingGap) <= 1500000 
              ? 'bg-green-50 border-green-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${
                Math.abs(currentModel.fundingGap) <= 1500000 ? 'text-green-900' : 'text-red-900'
              }`}>
                Funding Status
              </h3>
              <AlertTriangle className={`h-8 w-8 ${
                Math.abs(currentModel.fundingGap) <= 1500000 ? 'text-green-700' : 'text-red-700'
              }`} />
            </div>
            <div className={`text-3xl font-bold mb-2 ${
              Math.abs(currentModel.fundingGap) <= 1500000 ? 'text-green-900' : 'text-red-900'
            }`}>
              {currentModel.fundingGap > 0 ? formatCurrency(currentModel.fundingGap) : 'FUNDED'}
            </div>
            <p className={`text-sm font-medium ${
              Math.abs(currentModel.fundingGap) <= 1500000 ? 'text-green-800' : 'text-red-800'
            }`}>
              {currentModel.fundingGap > 0 ? 'Gap to close' : 'Fully funded'}
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="mb-8 flex justify-center gap-6">
          <button
            onClick={() => alert('PDF Report: China_Alley_Vista_Feasibility_Report.pdf\nCheck project directory')}
            className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl text-lg"
          >
            <Download className="h-5 w-5 mr-3" />
            PDF Feasibility Report
          </button>
          <button
            onClick={() => alert('Excel Pro Formas Generated:\n• 30 Units (Exhibit E): China_Alley_Vista_Pro_Forma_30_Units_EXHIBIT_E.xlsx\n• 32 Units (Concept): China_Alley_Vista_Pro_Forma_32_Units_CONCEPT.xlsx')}
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl text-lg"
          >
            <Download className="h-5 w-5 mr-3" />
            Excel Pro Forma Models
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-xl border-2 border-slate-200">
          {/* Tab Navigation */}
          <div className="border-b-2 border-slate-200 bg-slate-100">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-2 border-b-2 font-bold text-base transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'border-slate-900 text-slate-900 bg-white shadow-md'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-400'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'
                    }`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-8">
            <div className="text-center py-16">
              <div className="text-slate-400 mb-6">
                <FileText className="h-24 w-24 mx-auto" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Excel Pro Forma Models Generated
              </h3>
              <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
                Complete financial analysis available in interactive Excel format. 
                Both 30-unit (Exhibit E) and 32-unit (Concept) scenarios included with full formulas.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-blue-900 mb-3">Exhibit E Scenario</h4>
                  <ul className="text-blue-800 space-y-2 text-left">
                    <li className="font-medium">• 30 total units (29 restricted + 1 manager)</li>
                    <li className="font-medium">• AMI-compliant rents</li>
                    <li className="font-medium">• GPR: {formatCurrency(303804)}</li>
                    <li className="font-medium">• Conservative underwriting</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-purple-900 mb-3">Concept Scenario</h4>
                  <ul className="text-purple-800 space-y-2 text-left">
                    <li className="font-medium">• 32 total units (4 floors × 8 units)</li>
                    <li className="font-medium">• Original rent assumptions</li>
                    <li className="font-medium">• GPR: {formatCurrency(400800)}</li>
                    <li className="font-medium">• Higher income potential</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-slate-100 border-2 border-slate-300 rounded-lg p-6 max-w-3xl mx-auto">
                <h4 className="text-xl font-bold text-slate-900 mb-3">Files Generated</h4>
                <div className="space-y-2 text-slate-800">
                  <p className="font-medium">📊 China_Alley_Vista_Pro_Forma_30_Units_EXHIBIT_E.xlsx</p>
                  <p className="font-medium">📊 China_Alley_Vista_Pro_Forma_32_Units_CONCEPT.xlsx</p>
                  <p className="font-medium">📄 China_Alley_Vista_Feasibility_Report.pdf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardV2;
