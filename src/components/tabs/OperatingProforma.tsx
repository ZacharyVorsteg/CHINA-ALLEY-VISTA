import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/calculations';
import { originalProforma, correctedOperatingExpenses } from '@/data/projectData';
import type { FinancialResults, FinancialScenario } from '@/utils/calculations';

interface OperatingProformaProps {
  results: FinancialResults;
  scenario: FinancialScenario;
}

const OperatingProforma: React.FC<OperatingProformaProps> = ({ results, scenario }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Operating Pro Forma</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(results.netOperatingIncome)}
          </div>
          <div className="text-sm text-gray-500">Net Operating Income</div>
        </div>
      </div>

      {/* Income Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
          Income Analysis
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Gross Potential Rent</span>
              <span className="text-lg font-semibold">{formatCurrency(results.grossPotentialRent)}</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>Less: Vacancy ({formatPercentage(scenario.vacancyRate * 100)})</span>
              <span>({formatCurrency(results.vacancy)})</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>Less: Concessions</span>
              <span>({formatCurrency(10020)})</span>
            </div>
            <div className="flex justify-between items-center font-semibold border-t pt-2">
              <span>Effective Gross Income</span>
              <span className="text-green-600">{formatCurrency(results.effectiveGrossIncome)}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded p-4">
            <h4 className="font-medium mb-2">Per Unit Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Avg Monthly Rent/Unit</span>
                <span>{formatCurrency(results.grossPotentialRent / 32 / 12)}</span>
              </div>
              <div className="flex justify-between">
                <span>Annual Income/Unit</span>
                <span>{formatCurrency(results.effectiveGrossIncome / 32)}</span>
              </div>
              <div className="flex justify-between">
                <span>Income/Sq Ft</span>
                <span>{formatCurrency(results.effectiveGrossIncome / (32 * 750))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operating Expenses Comparison */}
      <div className="bg-white border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Operating Expenses - Fantasy vs Reality
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Fantasy */}
          <div>
            <h4 className="font-medium mb-3 text-red-600">Original &ldquo;Fantasy&rdquo; Budget</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Repairs & Maintenance</span>
                <span className="text-red-600">{formatCurrency(originalProforma.operatingExpenses.repairsMaintenance)}</span>
              </div>
              <div className="flex justify-between">
                <span>Utilities</span>
                <span className="text-red-600">{formatCurrency(originalProforma.operatingExpenses.waterSewer + originalProforma.operatingExpenses.electricity)}</span>
              </div>
              <div className="flex justify-between">
                <span>Property Management</span>
                <span className="text-red-600">{formatCurrency(originalProforma.operatingExpenses.propertyManagement)}</span>
              </div>
              <div className="flex justify-between">
                <span>Real Estate Taxes</span>
                <span className="text-red-600">{formatCurrency(originalProforma.operatingExpenses.realEstateTaxes)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance</span>
                <span className="text-red-600">{formatCurrency(originalProforma.operatingExpenses.insurance)}</span>
              </div>
              <div className="flex justify-between">
                <span>Other</span>
                <span className="text-red-600">{formatCurrency(originalProforma.operatingExpenses.suppliesEquipment)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 text-red-600">
                <span>Total (UNREALISTIC)</span>
                <span>{formatCurrency(originalProforma.operatingExpenses.total)}</span>
              </div>
            </div>
          </div>

          {/* Market Reality */}
          <div>
            <h4 className="font-medium mb-3 text-green-600">Market Reality</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Property Management (4% EGI)</span>
                <span>{formatCurrency(correctedOperatingExpenses.propertyManagement(results.effectiveGrossIncome))}</span>
              </div>
              <div className="flex justify-between">
                <span>Repairs & Maintenance</span>
                <span>{formatCurrency(correctedOperatingExpenses.repairsMaintenance)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insurance</span>
                <span>{formatCurrency(correctedOperatingExpenses.insurance)}</span>
              </div>
              <div className="flex justify-between">
                <span>Utilities (Common Areas)</span>
                <span>{formatCurrency(correctedOperatingExpenses.utilitiesCommon)}</span>
              </div>
              <div className="flex justify-between">
                <span>Real Estate Taxes</span>
                <span>{formatCurrency(correctedOperatingExpenses.realEstateTaxes)}</span>
              </div>
              <div className="flex justify-between">
                <span>Admin & Marketing</span>
                <span>{formatCurrency(correctedOperatingExpenses.adminMarketing)}</span>
              </div>
              <div className="flex justify-between">
                <span>Landscaping & Trash</span>
                <span>{formatCurrency(correctedOperatingExpenses.trashLandscaping)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 text-green-600">
                <span>Total (REALISTIC)</span>
                <span>{formatCurrency(results.operatingExpenses)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-800">Critical Understatement</h4>
              <p className="text-red-700 mt-1">
                Operating expenses understated by {formatCurrency(results.operatingExpenses - originalProforma.operatingExpenses.total)} 
                ({formatPercentage((results.operatingExpenses / originalProforma.operatingExpenses.total - 1) * 100)} increase)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NOI and Cash Flow */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingDown className="h-5 w-5 mr-2 text-blue-500" />
          Cash Flow Waterfall
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Effective Gross Income</span>
            <span className="font-semibold text-green-600">{formatCurrency(results.effectiveGrossIncome)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Less: Operating Expenses</span>
            <span className="font-semibold text-red-600">({formatCurrency(results.operatingExpenses)})</span>
          </div>
          <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
            <span>Net Operating Income</span>
            <span className="text-blue-600">{formatCurrency(results.netOperatingIncome)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Less: Reserves ({formatCurrency(300)}/unit)</span>
            <span className="text-red-600">({formatCurrency(results.reserves)})</span>
          </div>
          <div className="flex justify-between items-center font-semibold">
            <span>Cash Flow Before Debt</span>
            <span className="text-green-600">{formatCurrency(results.cashFlowBeforeDebt)}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{formatPercentage((results.operatingExpenses / results.effectiveGrossIncome) * 100)}</div>
            <div className="text-sm text-gray-500">Operating Ratio</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{formatCurrency(results.operatingExpenses / 32)}</div>
            <div className="text-sm text-gray-500">OpEx/Unit</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{formatCurrency(results.netOperatingIncome / 32)}</div>
            <div className="text-sm text-gray-500">NOI/Unit</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{formatPercentage(results.capRate)}</div>
            <div className="text-sm text-gray-500">Cap Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatingProforma;
