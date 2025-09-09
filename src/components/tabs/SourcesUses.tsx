import React from 'react';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/calculations';
import type { FinancialResults } from '@/utils/calculations';

interface SourcesUsesProps {
  results: FinancialResults;
}

const SourcesUses: React.FC<SourcesUsesProps> = ({ results }) => {
  const totalProjectCost = 6361829;
  const grantFunding = 1250000; // $1.25M grant
  const cityLoan = 1750000; // $1.75M city soft loan
  const constructionLoan = results.maxSupportableDebt;
  const totalSources = grantFunding + cityLoan + constructionLoan;
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sources & Uses of Funds</h2>
        <div className="text-right">
          <div className={`text-2xl font-bold ${results.fundingGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {results.fundingGap > 0 ? formatCurrency(results.fundingGap) : 'FULLY FUNDED'}
          </div>
          <div className="text-sm text-gray-500">
            {results.fundingGap > 0 ? 'Funding Gap' : 'Surplus'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sources of Funds */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-500" />
            Sources of Funds
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Grant Funding</span>
                <div className="text-sm text-gray-500">State/Federal Grant</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">{formatCurrency(grantFunding)}</div>
                <div className="text-sm text-gray-500">{formatPercentage((grantFunding / totalProjectCost) * 100)}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">City Soft Loan</span>
                <div className="text-sm text-gray-500">5.5% Interest-Only, 3 Years</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-600">{formatCurrency(cityLoan)}</div>
                <div className="text-sm text-gray-500">{formatPercentage((cityLoan / totalProjectCost) * 100)}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Construction/Perm Loan</span>
                <div className="text-sm text-gray-500">Max Supportable at 1.20x DSCR</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-purple-600">{formatCurrency(constructionLoan)}</div>
                <div className="text-sm text-gray-500">{formatPercentage((constructionLoan / totalProjectCost) * 100)}</div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Available Sources</span>
                <span className="text-gray-900">{formatCurrency(totalSources)}</span>
              </div>
            </div>
            
            {results.fundingGap > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <div className="flex justify-between items-center font-semibold text-red-800">
                  <span>FUNDING GAP</span>
                  <span>{formatCurrency(results.fundingGap)}</span>
                </div>
                <div className="text-sm text-red-600 mt-1">
                  Additional equity or subordinate debt required
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Uses of Funds */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-red-500" />
            Uses of Funds
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Land Acquisition</span>
                <div className="text-sm text-gray-500">Including due diligence</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(72500)}</div>
                <div className="text-sm text-gray-500">{formatPercentage((72500 / totalProjectCost) * 100)}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Hard Costs</span>
                <div className="text-sm text-gray-500">Construction & site work</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(5491713)}</div>
                <div className="text-sm text-gray-500">{formatPercentage((5491713 / totalProjectCost) * 100)}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Soft Costs</span>
                <div className="text-sm text-gray-500">A&E, permits, legal</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(269618)}</div>
                <div className="text-sm text-gray-500">{formatPercentage((269618 / totalProjectCost) * 100)}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Financing Costs</span>
                <div className="text-sm text-gray-500">Appraisal, legal, marketing</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(56500)}</div>
                <div className="text-sm text-gray-500">{formatPercentage((56500 / totalProjectCost) * 100)}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Developer Fee</span>
                <div className="text-sm text-gray-500">Included in hard costs</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(0)}</div>
                <div className="text-sm text-gray-500">0.0%</div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Project Cost</span>
                <span className="text-gray-900">{formatCurrency(totalProjectCost)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Analysis */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Funding Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatPercentage(results.ltv)}</div>
            <div className="text-sm text-gray-500">Loan-to-Value</div>
            <div className="text-xs text-gray-400 mt-1">Max supportable debt</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatPercentage(((grantFunding + cityLoan) / totalProjectCost) * 100)}</div>
            <div className="text-sm text-gray-500">Subsidy %</div>
            <div className="text-xs text-gray-400 mt-1">Grant + soft loan</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${results.fundingGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatPercentage(Math.abs(results.fundingGap) / totalProjectCost * 100)}
            </div>
            <div className="text-sm text-gray-500">Gap %</div>
            <div className="text-xs text-gray-400 mt-1">Of total cost</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatPercentage(results.debtYield)}</div>
            <div className="text-sm text-gray-500">Debt Yield</div>
            <div className="text-xs text-gray-400 mt-1">NOI / Loan Amount</div>
          </div>
        </div>
      </div>

      {/* Gap Closing Strategies */}
      {results.fundingGap > 0 && (
        <div className="bg-white border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            Gap Closing Strategies
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Recommended Approaches</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Secure 4% LIHTC allocation (~$1.2M equity)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Additional city/county subsidy
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Value engineering to reduce costs
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Deferred developer fee
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Impact Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>With 4% LIHTC:</span>
                  <span className="text-green-600">{formatCurrency(Math.max(0, results.fundingGap - 1200000))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Value Engineering (10%):</span>
                  <span className="text-green-600">{formatCurrency(Math.max(0, results.fundingGap - 636183))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Combined Approach:</span>
                  <span className="text-green-600 font-semibold">FEASIBLE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourcesUses;
