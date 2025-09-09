import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/utils/calculations';
import { originalBudget, preFabEstimate } from '@/data/projectData';
import type { FinancialResults } from '@/utils/calculations';

interface DevelopmentBudgetProps {
  results: FinancialResults;
}

const DevelopmentBudget: React.FC<DevelopmentBudgetProps> = ({ results }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Development Budget Analysis</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(originalBudget.totalProjectCost)}
          </div>
          <div className="text-sm text-gray-500">Total Development Cost</div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Land Acquisition */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-slate-900">Land Acquisition</h3>
          <div className="space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span>Purchase Price</span>
              <span>{formatCurrency(originalBudget.landAcquisition.purchasePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Recording Fees</span>
              <span>{formatCurrency(originalBudget.landAcquisition.recordingFees)}</span>
            </div>
            <div className="flex justify-between">
              <span>Legal Fees</span>
              <span>{formatCurrency(originalBudget.landAcquisition.legalFees)}</span>
            </div>
            <div className="flex justify-between">
              <span>Due Diligence</span>
              <span>{formatCurrency(originalBudget.landAcquisition.developerDueDiligence)}</span>
            </div>
            <div className="flex justify-between">
              <span>Title Insurance</span>
              <span>{formatCurrency(originalBudget.landAcquisition.titleInsurance)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Land Total</span>
              <span>{formatCurrency(originalBudget.landAcquisition.total)}</span>
            </div>
          </div>
        </div>

        {/* Soft Costs */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-slate-900">Soft Costs</h3>
          <div className="space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span>Architectural Fees</span>
              <span>{formatCurrency(originalBudget.softCosts.architecturalFees)}</span>
            </div>
            <div className="flex justify-between">
              <span>General Liability</span>
              <span>{formatCurrency(originalBudget.softCosts.generalLiability)}</span>
            </div>
            <div className="flex justify-between">
              <span>Geo Technical</span>
              <span>{formatCurrency(originalBudget.softCosts.geoTechnical)}</span>
            </div>
            <div className="flex justify-between">
              <span>Utilities Hookup</span>
              <span>{formatCurrency(originalBudget.softCosts.waterSewerLine + originalBudget.softCosts.electricalHookup)}</span>
            </div>
            <div className="flex justify-between">
              <span>Engineering & Permits</span>
              <span>{formatCurrency(originalBudget.softCosts.civilEngineering + originalBudget.softCosts.buildingPermit)}</span>
            </div>
            <div className="flex justify-between">
              <span>Bond Premium</span>
              <span>{formatCurrency(originalBudget.softCosts.bondPremium)}</span>
            </div>
            <div className="flex justify-between text-red-700 font-medium">
              <span>Contingency (3.5% - Below Standard)</span>
              <span>{formatCurrency(originalBudget.softCosts.contingency)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Soft Costs Total</span>
              <span>{formatCurrency(originalBudget.softCosts.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hard Costs Comparison */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Hard Costs - Original vs PreFab Quote
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Budget (Wrong) */}
          <div>
            <h4 className="font-medium mb-3 text-red-600">Original Budget (Errors Identified)</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Site Work</span>
                <span>{formatCurrency(originalBudget.hardCostBreakdown.totalSiteCosts)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Floor 1-4 (Wrong Pricing)</span>
                <span>{formatCurrency(originalBudget.hardCostBreakdown.factoryBuilt.floor1 * 4)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Commercial (Overstated)</span>
                <span>{formatCurrency(originalBudget.hardCostBreakdown.factoryBuilt.commercial)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery & Crane</span>
                <span>{formatCurrency(originalBudget.hardCostBreakdown.factoryBuilt.delivery + originalBudget.hardCostBreakdown.factoryBuilt.crane)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Hard Costs Total</span>
                <span>{formatCurrency(originalBudget.hardCostBreakdown.factoryBuilt.totalFactory + originalBudget.hardCostBreakdown.totalSiteCosts)}</span>
              </div>
            </div>
          </div>

          {/* PreFab Quote (Correct) */}
          <div>
            <h4 className="font-medium mb-3 text-green-600">PreFab Innovations Quote (Correct)</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Site Work</span>
                <span>{formatCurrency(preFabEstimate.siteWork.siteWorkTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Residential (4 Floors)</span>
                <span>{formatCurrency(preFabEstimate.residentialPerFloor.totalResidential)}</span>
              </div>
              <div className="flex justify-between">
                <span>Commercial Build-Out</span>
                <span>{formatCurrency(preFabEstimate.commercial.cost)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 text-green-600">
                <span>Hard Costs Total</span>
                <span>{formatCurrency(preFabEstimate.projectTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
            <div>
              <h4 className="font-semibold text-yellow-800">Cost Discrepancy Identified</h4>
              <p className="text-yellow-700 mt-1">
                Difference: {formatCurrency(Math.abs(preFabEstimate.projectTotal - (originalBudget.hardCostBreakdown.factoryBuilt.totalFactory + originalBudget.hardCostBreakdown.totalSiteCosts)))}
                {preFabEstimate.projectTotal < (originalBudget.hardCostBreakdown.factoryBuilt.totalFactory + originalBudget.hardCostBreakdown.totalSiteCosts) 
                  ? ' savings identified' 
                  : ' cost increase identified'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Per Unit Analysis */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-slate-900">Cost Per Unit Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(results.costPerUnit)}</div>
            <div className="text-sm text-slate-600">Total Cost/Unit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(preFabEstimate.projectTotal / 32)}</div>
            <div className="text-sm text-slate-600">Hard Cost/Unit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{formatCurrency(originalBudget.softCosts.total / 32)}</div>
            <div className="text-sm text-slate-600">Soft Cost/Unit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">32</div>
            <div className="text-sm text-slate-600">Total Units</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentBudget;
