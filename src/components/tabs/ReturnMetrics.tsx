import React from 'react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { formatCurrency, formatPercentage, formatRatio, getMetricColor } from '@/utils/calculations';
import type { FinancialResults } from '@/utils/calculations';

interface ReturnMetricsProps {
  results: FinancialResults;
}

const ReturnMetrics: React.FC<ReturnMetricsProps> = ({ results }) => {
  const totalEquity = 6361829 - results.maxSupportableDebt - 1250000 - 1750000; // Total cost - debt - grants
  const cashOnCashReturn = totalEquity > 0 ? (results.cashFlowAfterDebt / totalEquity) * 100 : 0;
  
  // Industry benchmarks
  const benchmarks = {
    capRate: { target: 5.5, acceptable: 4.5, minimum: 4.0 },
    dscr: { target: 1.35, acceptable: 1.25, minimum: 1.20 },
    debtYield: { target: 12.0, acceptable: 10.0, minimum: 8.0 },
    returnOnCost: { target: 6.5, acceptable: 5.5, minimum: 5.0 },
    cashOnCash: { target: 8.0, acceptable: 6.0, minimum: 4.0 }
  };

  const getMetricStatus = (value: number, benchmark: { target: number; acceptable: number; minimum: number }) => {
    if (value >= benchmark.target) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (value >= benchmark.acceptable) return { status: 'good', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (value >= benchmark.minimum) return { status: 'marginal', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { status: 'poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Return Metrics Analysis</h2>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getMetricColor('dscr', results.dscr)}`}>
            {formatRatio(results.dscr)}
          </div>
          <div className="text-sm text-gray-500">Debt Service Coverage</div>
        </div>
      </div>

      {/* Key Return Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cap Rate */}
        <div className={`rounded-lg p-6 border ${getMetricStatus(results.capRate, benchmarks.capRate).bg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Cap Rate</h3>
            <Target className={`h-5 w-5 ${getMetricStatus(results.capRate, benchmarks.capRate).color}`} />
          </div>
          <div className={`text-3xl font-bold mb-2 ${getMetricStatus(results.capRate, benchmarks.capRate).color}`}>
            {formatPercentage(results.capRate)}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            NOI / Total Project Cost
          </div>
          <div className="text-xs text-gray-500">
            Target: {formatPercentage(benchmarks.capRate.target)} | Min: {formatPercentage(benchmarks.capRate.minimum)}
          </div>
        </div>

        {/* DSCR */}
        <div className={`rounded-lg p-6 border ${getMetricStatus(results.dscr, benchmarks.dscr).bg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">DSCR</h3>
            <TrendingUp className={`h-5 w-5 ${getMetricStatus(results.dscr, benchmarks.dscr).color}`} />
          </div>
          <div className={`text-3xl font-bold mb-2 ${getMetricStatus(results.dscr, benchmarks.dscr).color}`}>
            {formatRatio(results.dscr)}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            NOI / Annual Debt Service
          </div>
          <div className="text-xs text-gray-500">
            Target: {formatRatio(benchmarks.dscr.target)} | Min: {formatRatio(benchmarks.dscr.minimum)}
          </div>
        </div>

        {/* Debt Yield */}
        <div className={`rounded-lg p-6 border ${getMetricStatus(results.debtYield, benchmarks.debtYield).bg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Debt Yield</h3>
            <TrendingUp className={`h-5 w-5 ${getMetricStatus(results.debtYield, benchmarks.debtYield).color}`} />
          </div>
          <div className={`text-3xl font-bold mb-2 ${getMetricStatus(results.debtYield, benchmarks.debtYield).color}`}>
            {formatPercentage(results.debtYield)}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            NOI / Loan Amount
          </div>
          <div className="text-xs text-gray-500">
            Target: {formatPercentage(benchmarks.debtYield.target)} | Min: {formatPercentage(benchmarks.debtYield.minimum)}
          </div>
        </div>

        {/* Return on Cost */}
        <div className={`rounded-lg p-6 border ${getMetricStatus(results.returnOnCost, benchmarks.returnOnCost).bg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Return on Cost</h3>
            <Target className={`h-5 w-5 ${getMetricStatus(results.returnOnCost, benchmarks.returnOnCost).color}`} />
          </div>
          <div className={`text-3xl font-bold mb-2 ${getMetricStatus(results.returnOnCost, benchmarks.returnOnCost).color}`}>
            {formatPercentage(results.returnOnCost)}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Same as Cap Rate for new development
          </div>
          <div className="text-xs text-gray-500">
            Target: {formatPercentage(benchmarks.returnOnCost.target)} | Min: {formatPercentage(benchmarks.returnOnCost.minimum)}
          </div>
        </div>

        {/* Cash on Cash */}
        <div className={`rounded-lg p-6 border ${totalEquity > 0 ? getMetricStatus(cashOnCashReturn, benchmarks.cashOnCash).bg : 'bg-red-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Cash on Cash</h3>
            <TrendingDown className={`h-5 w-5 ${totalEquity > 0 ? getMetricStatus(cashOnCashReturn, benchmarks.cashOnCash).color : 'text-red-600'}`} />
          </div>
          <div className={`text-3xl font-bold mb-2 ${totalEquity > 0 ? getMetricStatus(cashOnCashReturn, benchmarks.cashOnCash).color : 'text-red-600'}`}>
            {totalEquity > 0 ? formatPercentage(cashOnCashReturn) : 'N/A'}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            {totalEquity > 0 ? 'Cash Flow / Equity Investment' : 'Negative equity position'}
          </div>
          <div className="text-xs text-gray-500">
            {totalEquity > 0 ? `Target: ${formatPercentage(benchmarks.cashOnCash.target)} | Min: ${formatPercentage(benchmarks.cashOnCash.minimum)}` : 'Requires gap funding'}
          </div>
        </div>

        {/* LTV */}
        <div className="bg-blue-50 rounded-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Loan-to-Value</h3>
            <TrendingDown className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold mb-2 text-blue-600">
            {formatPercentage(results.ltv)}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Max Supportable Debt / TDC
          </div>
          <div className="text-xs text-gray-500">
            Conservative leverage profile
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Return Analysis</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium mb-4">Cash Flow Analysis</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Net Operating Income</span>
                <span className="font-semibold">{formatCurrency(results.netOperatingIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>Less: Reserves</span>
                <span className="text-red-600">({formatCurrency(results.reserves)})</span>
              </div>
              <div className="flex justify-between">
                <span>Cash Flow Before Debt</span>
                <span className="font-semibold">{formatCurrency(results.cashFlowBeforeDebt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Less: Annual Debt Service</span>
                <span className="text-red-600">({formatCurrency(results.annualDebtService)})</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Cash Flow After Debt</span>
                <span className={results.cashFlowAfterDebt > 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(results.cashFlowAfterDebt)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Investment Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Development Cost</span>
                <span className="font-semibold">{formatCurrency(6361829)}</span>
              </div>
              <div className="flex justify-between">
                <span>Max Supportable Debt</span>
                <span className="text-blue-600">{formatCurrency(results.maxSupportableDebt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Grant Funding</span>
                <span className="text-green-600">{formatCurrency(1250000)}</span>
              </div>
              <div className="flex justify-between">
                <span>City Soft Loan</span>
                <span className="text-blue-600">{formatCurrency(1750000)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Required Equity/Gap</span>
                <span className={totalEquity > 0 ? 'text-red-600' : 'text-green-600'}>
                  {formatCurrency(Math.max(totalEquity, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Benchmarking */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Performance vs. Benchmarks</h3>
        
        <div className="space-y-4">
          {Object.entries({
            'Cap Rate': { value: results.capRate, benchmark: benchmarks.capRate, format: 'percentage' },
            'DSCR': { value: results.dscr, benchmark: benchmarks.dscr, format: 'ratio' },
            'Debt Yield': { value: results.debtYield, benchmark: benchmarks.debtYield, format: 'percentage' },
            'Return on Cost': { value: results.returnOnCost, benchmark: benchmarks.returnOnCost, format: 'percentage' }
          }).map(([metric, data]) => {
            const status = getMetricStatus(data.value, data.benchmark);
            const formatValue = data.format === 'percentage' ? formatPercentage : formatRatio;
            
            return (
              <div key={metric} className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    status.status === 'excellent' ? 'bg-green-500' :
                    status.status === 'good' ? 'bg-yellow-500' :
                    status.status === 'marginal' ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium">{metric}</span>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${status.color}`}>
                    {formatValue(data.value)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Target: {formatValue(data.benchmark.target)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-red-600">High Risk</h4>
            <ul className="text-sm space-y-1">
              <li>• DSCR below 1.35x target</li>
              <li>• Large funding gap</li>
              <li>• Below-market returns</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-yellow-600">Medium Risk</h4>
            <ul className="text-sm space-y-1">
              <li>• Operating expense sensitivity</li>
              <li>• Interest rate exposure</li>
              <li>• Rent compliance issues</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-green-600">Mitigants</h4>
            <ul className="text-sm space-y-1">
              <li>• Strong subsidy base</li>
              <li>• Affordable housing demand</li>
              <li>• LIHTC opportunity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnMetrics;
