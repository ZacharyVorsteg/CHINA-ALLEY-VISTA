import React, { useState } from 'react';
import { TrendingDown, TrendingUp, BarChart3 } from 'lucide-react';
import { 
  calculateFinancials, 
  scenarios, 
  formatCurrency, 
  formatRatio,
  type FinancialScenario 
} from '@/utils/calculations';
import type { FinancialResults } from '@/utils/calculations';

interface SensitivityAnalysisProps {
  baseResults: FinancialResults;
}

const SensitivityAnalysis: React.FC<SensitivityAnalysisProps> = ({ baseResults }) => {
  const [selectedMetric, setSelectedMetric] = useState<'dscr' | 'noi' | 'gap'>('dscr');

  // Create sensitivity scenarios
  const createScenario = (name: string, adjustments: Partial<FinancialScenario>): { name: string; scenario: FinancialScenario; results: FinancialResults } => {
    const baseScenario = scenarios.reality;
    const scenario: FinancialScenario = {
      ...baseScenario,
      ...adjustments,
      name
    };
    return {
      name,
      scenario,
      results: calculateFinancials(scenario)
    };
  };

  const sensitivityScenarios = [
    createScenario('Base Case', {}),
    createScenario('Rents -5%', { grossRent: scenarios.reality.grossRent * 0.95 }),
    createScenario('Rents -10%', { grossRent: scenarios.reality.grossRent * 0.90 }),
    createScenario('OpEx +10%', { operatingExpenses: scenarios.reality.operatingExpenses * 1.10 }),
    createScenario('OpEx +20%', { operatingExpenses: scenarios.reality.operatingExpenses * 1.20 }),
    createScenario('Vacancy 5%', { vacancyRate: 0.05 }),
    createScenario('Vacancy 7.5%', { vacancyRate: 0.075 }),
    createScenario('Interest +50bp', { interestRate: scenarios.reality.interestRate + 0.005 }),
    createScenario('Interest +100bp', { interestRate: scenarios.reality.interestRate + 0.01 }),
    createScenario('All Adverse', { 
      grossRent: scenarios.reality.grossRent * 0.90,
      operatingExpenses: scenarios.reality.operatingExpenses * 1.20,
      vacancyRate: 0.075,
      interestRate: scenarios.reality.interestRate + 0.01
    })
  ];

  const getMetricValue = (results: FinancialResults) => {
    switch (selectedMetric) {
      case 'dscr': return results.dscr;
      case 'noi': return results.netOperatingIncome;
      case 'gap': return results.fundingGap;
      default: return results.dscr;
    }
  };

  const getMetricColor = (value: number, baseValue: number) => {
    const change = (value - baseValue) / baseValue;
    if (selectedMetric === 'gap') {
      // For funding gap, lower is better
      if (change < -0.1) return 'text-green-600';
      if (change < 0.1) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      // For DSCR and NOI, higher is better
      if (change > 0.1) return 'text-green-600';
      if (change > -0.1) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  // const formatMetricValue = (value: number) => {
  //   switch (selectedMetric) {
  //     case 'dscr': return formatRatio(value);
  //     case 'noi': return formatCurrency(value);
  //     case 'gap': return formatCurrency(value);
  //     default: return value.toString();
  //   }
  // };

  const baseValue = getMetricValue(baseResults);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sensitivity Analysis</h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Analyze:</label>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as 'dscr' | 'noi' | 'gap')}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="dscr">DSCR</option>
            <option value="noi">Net Operating Income</option>
            <option value="gap">Funding Gap</option>
          </select>
        </div>
      </div>

      {/* Sensitivity Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
          Scenario Analysis
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Scenario</th>
                <th className="text-right py-3 px-4 font-semibold">DSCR</th>
                <th className="text-right py-3 px-4 font-semibold">NOI</th>
                <th className="text-right py-3 px-4 font-semibold">Funding Gap</th>
                <th className="text-right py-3 px-4 font-semibold">Change</th>
              </tr>
            </thead>
            <tbody>
              {sensitivityScenarios.map((item, index) => {
                const metricValue = getMetricValue(item.results);
                const change = (metricValue - baseValue) / baseValue * 100;
                const isBase = index === 0;
                
                return (
                  <tr key={item.name} className={`border-b border-gray-100 ${isBase ? 'bg-blue-50' : ''}`}>
                    <td className="py-3 px-4 font-medium">
                      {item.name}
                      {isBase && <span className="ml-2 text-sm text-blue-600">(Base)</span>}
                    </td>
                    <td className={`text-right py-3 px-4 ${
                      item.results.dscr < 1.20 ? 'text-red-600 font-semibold' : 
                      item.results.dscr < 1.35 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {formatRatio(item.results.dscr)}
                    </td>
                    <td className="text-right py-3 px-4">
                      {formatCurrency(item.results.netOperatingIncome)}
                    </td>
                    <td className={`text-right py-3 px-4 ${
                      item.results.fundingGap > 2000000 ? 'text-red-600 font-semibold' :
                      item.results.fundingGap > 1500000 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(item.results.fundingGap)}
                    </td>
                    <td className={`text-right py-3 px-4 ${isBase ? 'text-gray-500' : getMetricColor(metricValue, baseValue)}`}>
                      {isBase ? '—' : `${change > 0 ? '+' : ''}${change.toFixed(1)}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Factors */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-red-800">
            <TrendingDown className="h-5 w-5 mr-2" />
            High Risk Scenarios
          </h3>
          
          <div className="space-y-3">
            {sensitivityScenarios
              .filter(item => item.results.dscr < 1.20)
              .map(item => (
                <div key={item.name} className="flex justify-between items-center">
                  <span className="font-medium text-red-700">{item.name}</span>
                  <span className="text-red-600 font-semibold">
                    DSCR: {formatRatio(item.results.dscr)}
                  </span>
                </div>
              ))
            }
          </div>
          
          <div className="mt-4 p-3 bg-red-100 rounded text-sm text-red-800">
            <strong>Critical Risk:</strong> Any scenario with DSCR below 1.20x will fail institutional underwriting requirements.
          </div>
        </div>

        {/* Upside Scenarios */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-green-800">
            <TrendingUp className="h-5 w-5 mr-2" />
            Feasible Scenarios
          </h3>
          
          <div className="space-y-3">
            {sensitivityScenarios
              .filter(item => item.results.dscr >= 1.20 && item.results.fundingGap < 2000000)
              .map(item => (
                <div key={item.name} className="flex justify-between items-center">
                  <span className="font-medium text-green-700">{item.name}</span>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold">
                      DSCR: {formatRatio(item.results.dscr)}
                    </div>
                    <div className="text-sm text-green-600">
                      Gap: {formatCurrency(item.results.fundingGap)}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          
          {sensitivityScenarios.filter(item => item.results.dscr >= 1.20 && item.results.fundingGap < 2000000).length === 0 && (
            <div className="text-green-700">
              No scenarios meet both DSCR ≥ 1.20x and gap &lt; $2M criteria without additional subsidies.
            </div>
          )}
        </div>
      </div>

      {/* Stress Testing */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Stress Testing Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-red-600">
              {sensitivityScenarios.filter(s => s.results.dscr < 1.20).length - 1}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Scenarios fail DSCR test
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Out of {sensitivityScenarios.length - 1} stress tests
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.min(...sensitivityScenarios.map(s => s.results.dscr)).toFixed(2)}x
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Worst-case DSCR
            </div>
            <div className="text-xs text-gray-500 mt-1">
              All adverse scenario
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(Math.max(...sensitivityScenarios.map(s => s.results.fundingGap)))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Maximum funding gap
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Worst-case scenario
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-yellow-800">Risk Mitigation Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3 text-yellow-800">Immediate Actions</h4>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                Secure 4% LIHTC allocation to close funding gap
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                Negotiate higher DSCR tolerance with lender (1.15x minimum)
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                Lock in construction pricing to avoid cost escalation
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 text-yellow-800">Contingency Planning</h4>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                Prepare value engineering options (10% cost reduction)
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                Identify backup funding sources for gap coverage
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                Consider phased development approach
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensitivityAnalysis;
