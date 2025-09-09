// Financial Calculations for China Alley Vista
// All formulas match industry standards and underwriting requirements

import { 
  debtCalculations, 
  cashFlowWaterfall,
  metrics,
  originalBudget
} from '@/data/projectData';

export interface FinancialScenario {
  name: string;
  grossRent: number;
  vacancyRate: number;
  operatingExpenses: number;
  interestRate: number;
  loanTerm: number;
  dscrRequirement: number;
}

export interface FinancialResults {
  grossPotentialRent: number;
  vacancy: number;
  effectiveGrossIncome: number;
  operatingExpenses: number;
  netOperatingIncome: number;
  reserves: number;
  cashFlowBeforeDebt: number;
  maxSupportableDebt: number;
  annualDebtService: number;
  cashFlowAfterDebt: number;
  dscr: number;
  capRate: number;
  debtYield: number;
  ltv: number;
  fundingGap: number;
  costPerUnit: number;
  returnOnCost: number;
}

export const calculateFinancials = (scenario: FinancialScenario): FinancialResults => {
  // Step 1: Income Calculations
  const grossPotentialRent = scenario.grossRent;
  const vacancy = grossPotentialRent * scenario.vacancyRate;
  const effectiveGrossIncome = grossPotentialRent - vacancy - 10020; // Less concessions
  
  // Step 2: Operating Expenses (corrected)
  const propertyManagement = effectiveGrossIncome * 0.04; // 4% of EGI
  const totalOperatingExpenses = scenario.operatingExpenses + propertyManagement;
  
  // Step 3: NOI and Cash Flow
  const netOperatingIncome = effectiveGrossIncome - totalOperatingExpenses;
  const reserves = 9600; // $300/unit for 32 units
  const cashFlowBeforeDebt = netOperatingIncome - reserves;
  
  // Step 4: Debt Sizing
  const maxSupportableDebt = debtCalculations.calculateMaxDebt(
    netOperatingIncome, 
    scenario.interestRate, 
    scenario.loanTerm, 
    scenario.dscrRequirement
  );
  
  const annualDebtService = cashFlowWaterfall.annualDebtService(
    maxSupportableDebt, 
    scenario.interestRate, 
    scenario.loanTerm
  );
  
  const cashFlowAfterDebt = cashFlowBeforeDebt - annualDebtService;
  
  // Step 5: Key Metrics
  const dscr = metrics.dscr(netOperatingIncome, annualDebtService);
  const capRate = metrics.capRate(netOperatingIncome, originalBudget.totalProjectCost);
  const debtYield = metrics.debtYield(netOperatingIncome, maxSupportableDebt);
  const ltv = metrics.ltv(maxSupportableDebt, originalBudget.totalProjectCost);
  
  // Step 6: Funding Analysis
  const availableFunding = 1250000 + 1750000; // Grant + City Loan
  const fundingGap = originalBudget.totalProjectCost - maxSupportableDebt - availableFunding;
  const costPerUnit = originalBudget.totalProjectCost / 32; // Using proforma unit count
  const returnOnCost = metrics.returnOnCost(netOperatingIncome, originalBudget.totalProjectCost);
  
  return {
    grossPotentialRent,
    vacancy,
    effectiveGrossIncome,
    operatingExpenses: totalOperatingExpenses,
    netOperatingIncome,
    reserves,
    cashFlowBeforeDebt,
    maxSupportableDebt,
    annualDebtService,
    cashFlowAfterDebt,
    dscr,
    capRate,
    debtYield,
    ltv,
    fundingGap,
    costPerUnit,
    returnOnCost
  };
};

// Predefined scenarios
export const scenarios: Record<string, FinancialScenario> = {
  fantasy: {
    name: "Original Fantasy",
    grossRent: 400800,
    vacancyRate: 0.025,
    operatingExpenses: 28300, // Original understated amount
    interestRate: 0.0625,
    loanTerm: 40,
    dscrRequirement: 1.20
  },
  
  reality: {
    name: "Market Reality",
    grossRent: 400800,
    vacancyRate: 0.025,
    operatingExpenses: 124056, // Corrected without property management (added separately)
    interestRate: 0.0625,
    loanTerm: 40,
    dscrRequirement: 1.20
  },
  
  conservative: {
    name: "Conservative Case",
    grossRent: 380760, // 5% rent reduction
    vacancyRate: 0.075,
    operatingExpenses: 136462, // 10% higher OpEx
    interestRate: 0.0675, // 50bp higher
    loanTerm: 40,
    dscrRequirement: 1.25
  },
  
  optimistic: {
    name: "With 4% LIHTC",
    grossRent: 400800,
    vacancyRate: 0.025,
    operatingExpenses: 124056,
    interestRate: 0.0575, // 50bp lower with LIHTC
    loanTerm: 40,
    dscrRequirement: 1.15 // More flexible with LIHTC
  }
};

// Color coding for metrics
export const getMetricColor = (metric: string, value: number): string => {
  const thresholds: Record<string, { red: number; yellow: number; green: number }> = {
    dscr: { red: 1.20, yellow: 1.35, green: 1.50 },
    capRate: { red: 4.0, yellow: 5.0, green: 6.0 },
    debtYield: { red: 8.0, yellow: 10.0, green: 12.0 },
    returnOnCost: { red: 5.0, yellow: 7.0, green: 9.0 },
    ltv: { red: 85, yellow: 75, green: 65 }, // Lower is better
    fundingGap: { green: 1000000, yellow: 1500000, red: 2000000 } // Lower is better
  };
  
  const t = thresholds[metric];
  if (!t) return 'text-gray-600';
  
  if (metric === 'ltv' || metric === 'fundingGap') {
    // Reverse logic - lower is better
    if (value <= t.green) return 'text-green-600';
    if (value <= t.yellow) return 'text-yellow-600';
    return 'text-red-600';
  } else {
    if (value >= t.green) return 'text-green-600';
    if (value >= t.yellow) return 'text-yellow-600';
    return 'text-red-600';
  }
};

// Format currency
export const formatCurrency = (amount: number, decimals = 0): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Format ratio
export const formatRatio = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}x`;
};

// Critical issues detection
export const getCriticalIssues = (results: FinancialResults): string[] => {
  const issues: string[] = [];
  
  if (results.dscr < 1.20) {
    issues.push(`DSCR of ${formatRatio(results.dscr)} below 1.20x minimum`);
  }
  
  if (results.fundingGap > 2000000) {
    issues.push(`Funding gap of ${formatCurrency(results.fundingGap)} exceeds $2M`);
  }
  
  if (results.operatingExpenses < 100000) {
    issues.push(`Operating expenses of ${formatCurrency(results.operatingExpenses)} unrealistically low`);
  }
  
  if (results.returnOnCost < 5.0) {
    issues.push(`Return on cost of ${formatPercentage(results.returnOnCost)} below 5% minimum`);
  }
  
  return issues;
};

// Compliance checks
export const getComplianceIssues = (): string[] => {
  return [
    "Studio rents at $1,050 exceed 50% AMI limit of $723",
    "Zero property management fee will fail underwriting",
    "Unit count mismatch: 30 in Exhibit E vs 32 in proforma",
    "Operating expenses understated by 84% ($28,300 vs $139,456)"
  ];
};
