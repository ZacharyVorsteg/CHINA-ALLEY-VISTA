// Financial Calculations for China Alley Vista
// All formulas match industry standards and underwriting requirements

import { 
  debtCalculations, 
  cashFlowWaterfall,
  metrics,
  originalBudget,
  sourcesAndUses
} from '@/data/projectData';
import { CONFIG, totalUnits, reservesAnnual, totalAvailableFunding } from '@/data/config';

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
  totalUnits: number;
}

export const calculateFinancials = (scenario: FinancialScenario): FinancialResults => {
  // Step 1: Income Calculations
  const grossPotentialRent = scenario.grossRent;
  const vacancy = grossPotentialRent * scenario.vacancyRate;
  const effectiveGrossIncome = grossPotentialRent - vacancy - CONFIG.project.concessions;
  
  // Step 2: Operating Expenses (corrected with property management)
  const propertyManagement = effectiveGrossIncome * CONFIG.PROPERTY_MGMT_RATE;
  const totalOperatingExpenses = scenario.operatingExpenses + propertyManagement;
  
  // Step 3: NOI and Cash Flow
  const netOperatingIncome = effectiveGrossIncome - totalOperatingExpenses;
  const reserves = reservesAnnual; // Use config-driven reserves
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
  const capRate = metrics.capRate(netOperatingIncome, CONFIG.project.totalDevelopmentCost);
  const debtYield = metrics.debtYield(netOperatingIncome, maxSupportableDebt);
  const ltv = metrics.ltv(maxSupportableDebt, CONFIG.project.totalDevelopmentCost);
  
  // Step 6: Funding Analysis
  const availableFunding = totalAvailableFunding + maxSupportableDebt;
  const fundingGap = CONFIG.project.totalDevelopmentCost - availableFunding;
  const costPerUnit = CONFIG.project.totalDevelopmentCost / totalUnits;
  const returnOnCost = metrics.returnOnCost(netOperatingIncome, CONFIG.project.totalDevelopmentCost);
  
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
    returnOnCost,
    totalUnits
  };
};

// Predefined scenarios
export const scenarios: Record<string, FinancialScenario> = {
  submitted: {
    name: "As Submitted",
    grossRent: 400800,
    vacancyRate: CONFIG.VACANCY_RATE,
    operatingExpenses: 28300, // Original understated amount
    interestRate: CONFIG.debt.interestRate,
    loanTerm: CONFIG.debt.amortizationYears,
    dscrRequirement: CONFIG.debt.minDSCR
  },
  
  reality: {
    name: "Market Reality",
    grossRent: 400800,
    vacancyRate: CONFIG.VACANCY_RATE,
    operatingExpenses: 124056, // Corrected without property management (added separately)
    interestRate: CONFIG.debt.interestRate,
    loanTerm: CONFIG.debt.amortizationYears,
    dscrRequirement: CONFIG.debt.minDSCR
  },
  
  conservative: {
    name: "Conservative Case",
    grossRent: 380760, // 5% rent reduction
    vacancyRate: 0.075,
    operatingExpenses: 136462, // 10% higher OpEx
    interestRate: 0.0675, // 50bp higher
    loanTerm: CONFIG.debt.amortizationYears,
    dscrRequirement: 1.25
  },
  
  optimistic: {
    name: "With 4% LIHTC",
    grossRent: 400800,
    vacancyRate: CONFIG.VACANCY_RATE,
    operatingExpenses: 124056,
    interestRate: 0.0575, // 50bp lower with LIHTC
    loanTerm: CONFIG.debt.amortizationYears,
    dscrRequirement: 1.15 // More flexible with LIHTC
  }
};

// Color coding for metrics - improved contrast
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
  if (!t) return 'text-gray-700';
  
  if (metric === 'ltv' || metric === 'fundingGap') {
    // Reverse logic - lower is better
    if (value <= t.green) return 'text-green-700';
    if (value <= t.yellow) return 'text-amber-600';
    return 'text-red-700';
  } else {
    if (value >= t.green) return 'text-green-700';
    if (value >= t.yellow) return 'text-amber-600';
    return 'text-red-700';
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
  
  if (results.dscr < CONFIG.debt.minDSCR) {
    issues.push(`DSCR of ${formatRatio(results.dscr)} below ${formatRatio(CONFIG.debt.minDSCR)} minimum requirement`);
  }
  
  if (results.fundingGap > 2000000) {
    issues.push(`Funding gap of ${formatCurrency(results.fundingGap)} exceeds $2M threshold`);
  }
  
  if (results.operatingExpenses < 100000) {
    issues.push(`Operating expenses of ${formatCurrency(results.operatingExpenses)} below industry benchmarks`);
  }
  
  if (results.returnOnCost < 5.0) {
    issues.push(`Return on cost of ${formatPercentage(results.returnOnCost)} below 5% minimum target`);
  }
  
  return issues;
};

// Compliance checks
export const getComplianceIssues = (): string[] => {
  return [
    "Studio rents at $1,050 exceed 50% AMI limit of $723",
    "Property management fee omitted from operating expenses",
    `Unit count discrepancy: ${CONFIG.TOTAL_UNITS_EXHIBIT_E} in Exhibit E vs ${CONFIG.TOTAL_UNITS_BUILD_PLAN} in building plan`,
    "Operating expenses understated by 84% compared to industry standards"
  ];
};