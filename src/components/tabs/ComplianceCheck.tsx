import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { formatCurrency } from '@/utils/calculations';
import { exhibitE, rentAssumptions, unitCountIssue, rentCompliance } from '@/data/projectData';

const ComplianceCheck: React.FC = () => {
  const complianceIssues = [
    {
      type: 'critical',
      title: 'Unit Count Mismatch',
      description: 'Exhibit E shows 30 units but financial proforma assumes 32 units',
      impact: 'Affects all financial projections and compliance calculations',
      recommendation: 'Reconcile unit count - either add 2 market-rate units to Exhibit E or reduce building to 30 units',
      status: 'fail'
    },
    {
      type: 'critical',
      title: 'Rent Compliance Violation',
      description: 'Studio units charging $1,050/month exceed 50% AMI limit of $723/month',
      impact: `Annual revenue loss of ${formatCurrency(rentCompliance.studioCompliance.annualRevenueLoss)}`,
      recommendation: 'Reduce studio rents to $723/month or secure higher AMI designation',
      status: 'fail'
    },
    {
      type: 'critical',
      title: 'Missing Property Management',
      description: 'Zero property management fee will fail institutional underwriting',
      impact: 'Lender will require 4% of EGI minimum (~$15,600 annually)',
      recommendation: 'Include 4% property management fee in operating expenses',
      status: 'fail'
    },
    {
      type: 'warning',
      title: 'Understated Operating Expenses',
      description: 'Operating expenses of $28,300 are 84% below market standards',
      impact: 'NOI overstated by approximately $111,156',
      recommendation: 'Use industry standard $4,358/unit operating expenses',
      status: 'warning'
    },
    {
      type: 'warning',
      title: 'Low Contingency Allowances',
      description: 'Construction contingency at 2% is below 5% industry standard',
      impact: 'Exposes project to cost overrun risk',
      recommendation: 'Increase contingency to 5% minimum',
      status: 'warning'
    },
    {
      type: 'info',
      title: 'LIHTC Opportunity',
      description: 'Project appears eligible for 4% Low-Income Housing Tax Credits',
      impact: 'Could provide ~$1.2M in equity to close funding gap',
      recommendation: 'Pursue LIHTC application immediately',
      status: 'opportunity'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'opportunity':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fail':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'opportunity':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Compliance Check</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">
            {complianceIssues.filter(i => i.status === 'fail').length}
          </div>
          <div className="text-sm text-gray-500">Critical Issues</div>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {complianceIssues.filter(i => i.status === 'fail').length}
          </div>
          <div className="text-sm text-red-700">Critical Failures</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {complianceIssues.filter(i => i.status === 'warning').length}
          </div>
          <div className="text-sm text-yellow-700">Warnings</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {complianceIssues.filter(i => i.status === 'opportunity').length}
          </div>
          <div className="text-sm text-green-700">Opportunities</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round((complianceIssues.filter(i => i.status !== 'fail').length / complianceIssues.length) * 100)}%
          </div>
          <div className="text-sm text-blue-700">Compliance Score</div>
        </div>
      </div>

      {/* Detailed Issues */}
      <div className="space-y-6">
        {complianceIssues.map((issue, index) => (
          <div key={index} className={`border rounded-lg p-6 ${getStatusColor(issue.status)}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {getStatusIcon(issue.status)}
                <h3 className="text-lg font-semibold ml-2">{issue.title}</h3>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                issue.status === 'fail' ? 'bg-red-100 text-red-800' :
                issue.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                issue.status === 'opportunity' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {issue.type.toUpperCase()}
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-700">{issue.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Financial Impact</h4>
                <p className="text-sm text-gray-700">{issue.impact}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Recommendation</h4>
                <p className="text-sm text-gray-700">{issue.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Unit Mix Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Unit Mix Compliance Analysis</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Exhibit E Official */}
          <div>
            <h4 className="font-medium mb-3 text-green-600">Exhibit E (Official)</h4>
            <div className="space-y-2">
              {Object.entries(exhibitE.unitsByAMI).map(([ami, units]) => (
                <div key={ami}>
                  <div className="font-medium text-sm mb-1">{ami.replace('_', '% ')} Units:</div>
                  {Array.isArray(units) && units.map((unit, idx) => (
                    <div key={idx} className="flex justify-between text-sm ml-4">
                      <span>{unit.bedrooms} bed</span>
                      <span>{unit.units} units</span>
                    </div>
                  ))}
                </div>
              ))}
              <div className="border-t pt-2 font-semibold">
                <div className="flex justify-between">
                  <span>Total Units:</span>
                  <span className="text-green-600">{exhibitE.totals.units}</span>
                </div>
                <div className="flex justify-between">
                  <span>Restricted:</span>
                  <span className="text-green-600">{exhibitE.totals.restricted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proforma Assumptions */}
          <div>
            <h4 className="font-medium mb-3 text-red-600">Proforma (Inconsistent)</h4>
            <div className="space-y-2">
              {Object.entries(rentAssumptions.unitProgram).map(([type, data]) => (
                <div key={type} className="flex justify-between text-sm">
                  <span>{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span>{data.count} units @ {formatCurrency(data.monthlyRent)}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-semibold">
                <div className="flex justify-between">
                  <span>Total Units:</span>
                  <span className="text-red-600">32</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-800">Unit Count Reconciliation Required</h4>
              <p className="text-red-700 mt-1">
                {unitCountIssue.reconciliation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rent Compliance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Rent Compliance Analysis</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Unit Type</th>
                <th className="text-right py-3 px-4">Count</th>
                <th className="text-right py-3 px-4">Current Rent</th>
                <th className="text-right py-3 px-4">AMI Limit</th>
                <th className="text-right py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">Studio</td>
                <td className="text-right py-3 px-4">16</td>
                <td className="text-right py-3 px-4 text-red-600 font-semibold">
                  {formatCurrency(rentCompliance.studioCompliance.currentRent)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(rentCompliance.studioCompliance.maxAllowed50AMI)}
                </td>
                <td className="text-right py-3 px-4">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                    OVER LIMIT
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">2 Bed</td>
                <td className="text-right py-3 px-4">8</td>
                <td className="text-right py-3 px-4 text-green-600">
                  {formatCurrency(775)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(rentAssumptions.hudFMR.twoBed)}
                </td>
                <td className="text-right py-3 px-4">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    COMPLIANT
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4">3 Bed</td>
                <td className="text-right py-3 px-4">8</td>
                <td className="text-right py-3 px-4 text-yellow-600">
                  {formatCurrency(1300)}
                </td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(rentAssumptions.hudFMR.threeBed)}
                </td>
                <td className="text-right py-3 px-4">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    AT LIMIT
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">Revenue Impact</h4>
          <p className="text-yellow-700 text-sm">
            Correcting studio rents to compliance level would reduce annual revenue by{' '}
            <span className="font-semibold">{formatCurrency(rentCompliance.studioCompliance.annualRevenueLoss)}</span>,
            further impacting project feasibility.
          </p>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">Required Actions Before Proceeding</h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
            <div>
              <h4 className="font-medium text-blue-800">Resolve Unit Count Discrepancy</h4>
              <p className="text-blue-700 text-sm">Reconcile 30 vs 32 unit count between Exhibit E and proforma</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
            <div>
              <h4 className="font-medium text-blue-800">Correct Rent Assumptions</h4>
              <p className="text-blue-700 text-sm">Reduce studio rents to $723/month or secure higher AMI designation</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
            <div>
              <h4 className="font-medium text-blue-800">Include Property Management</h4>
              <p className="text-blue-700 text-sm">Add 4% of EGI property management fee to operating expenses</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</div>
            <div>
              <h4 className="font-medium text-blue-800">Realistic Operating Budget</h4>
              <p className="text-blue-700 text-sm">Increase operating expenses to industry standard $139,456 annually</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCheck;
