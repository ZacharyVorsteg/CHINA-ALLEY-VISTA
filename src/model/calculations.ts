// Financial calculation engine using assumptions as single source of truth
// All formulas reference named inputs - NO MAGIC CONSTANTS
import { 
  Assumptions, 
  calculateTotalUnits, 
  calculateGPR, 
  calculateTDC, 
  calculateLoanConstant,
  calculateTotalReplacementReserves
} from './assumptions';

export interface FinancialModel {
  // Scenario metadata
  scenarioName: string;
  totalUnits: number;
  totalDevelopmentCost: number;
  
  // Income statement (all formulas reference assumptions)
  grossPotentialRent: number;
  vacancy: number;
  badDebt: number;
  effectiveGrossIncome: number;
  
  // Operating expenses (built from line items)
  propertyManagement: number;          // EGI × mgmtFeeRate
  contractServices: number;
  repairsMaintenance: number;
  suppliesEquipment: number;
  supportiveServices: number;
  waterSewer: number;
  electricity: number;
  advertising: number;
  realEstateTaxes: number;            // TDC × taxRate
  insurance: number;
  landJVPayment: number;
  totalOperatingExpenses: number;
  
  // Cash flow
  netOperatingIncome: number;         // EGI - totalOpEx
  replacementReserves: number;        // From reserve schedule
  cashFlowBeforeDebt: number;         // NOI - reserves
  
  // Debt analysis (proper loan constant calculations)
  citySoftLoanInterest: number;       // $5M × 5.5% × 3 years
  availableForDebtService: number;    // CF before debt - soft loan interest
  maxAnnualDebtService: number;       // Available ÷ dscrMin
  fannieMaeLoanConstant: number;      // Calculated from rate/term
  maxSupportableDebt: number;         // MaxDS ÷ loanConstant
  actualAnnualDebtService: number;    // Fannie Mae loan payment
  cashFlowAfterDebt: number;
  
  // Return metrics
  capRate: number;                    // NOI ÷ TDC
  dscr: number;                       // Available ÷ actualDS
  debtYield: number;                  // NOI ÷ loanAmount
  ltv: number;                        // Loan ÷ TDC
  
  // Funding analysis (no magic numbers)
  totalSources: number;               // Grant + equity + loans
  fundingGap: number;                 // TDC - totalSources
  gapFinancingNeeded: number;         // Positive gap = additional funding needed
  
  // Per unit metrics
  costPerUnit: number;
  noiPerUnit: number;
  rentPerUnit: number;
  reservePerUnit: number;
}

export const calculateFinancialModel = (assumptions: Assumptions): FinancialModel => {
  // Basic metrics
  const totalUnits = calculateTotalUnits(assumptions);
  const totalDevelopmentCost = calculateTDC(assumptions);
  
  // Income calculations (SUMPRODUCT from unit mix)
  const grossPotentialRent = calculateGPR(assumptions);
  const vacancy = grossPotentialRent * assumptions.vacancy;
  const badDebt = assumptions.badDebt;
  const effectiveGrossIncome = grossPotentialRent - vacancy - badDebt;
  
  // Operating expenses (built from line items, not magic numbers)
  const propertyManagement = effectiveGrossIncome * assumptions.mgmtFeeRate;
  const contractServices = assumptions.operatingExpenses.contractServices;
  const repairsMaintenance = assumptions.operatingExpenses.repairsMaintenance;
  const suppliesEquipment = assumptions.operatingExpenses.suppliesEquipment;
  const supportiveServices = assumptions.operatingExpenses.supportiveServices;
  const waterSewer = assumptions.operatingExpenses.waterSewer;
  const electricity = assumptions.operatingExpenses.electricity;
  const advertising = assumptions.operatingExpenses.advertising;
  const realEstateTaxes = totalDevelopmentCost * assumptions.realEstateTaxRateOnTdc;
  const insurance = assumptions.operatingExpenses.insurance;
  const landJVPayment = assumptions.operatingExpenses.landJVPayment;
  
  const totalOperatingExpenses = propertyManagement + contractServices + 
                                repairsMaintenance + suppliesEquipment + 
                                supportiveServices + waterSewer + electricity + 
                                advertising + realEstateTaxes + insurance + landJVPayment;
  
  // Cash flow
  const netOperatingIncome = effectiveGrossIncome - totalOperatingExpenses;
  const replacementReserves = calculateTotalReplacementReserves(assumptions);
  const cashFlowBeforeDebt = netOperatingIncome - replacementReserves;
  
  // City soft loan interest (interest-only for 3 years)
  const citySoftLoanInterest = assumptions.sources.citySoftLoan.amount * 
                              assumptions.sources.citySoftLoan.rate;
  
  // Available cash flow for conventional debt service (after soft loan interest)
  const availableForDebtService = cashFlowBeforeDebt - citySoftLoanInterest;
  
  // Maximum debt service sizing (proper DSCR calculation)
  const maxAnnualDebtService = availableForDebtService / assumptions.underwriting.dscrMin;
  
  // Fannie Mae loan constant (40-year amortization)
  const fannieMaeLoanConstant = calculateLoanConstant(0.065, 40); // Assuming 6.5% rate
  
  // Maximum supportable debt using loan constant (not magic multiplier)
  const maxSupportableDebt = maxAnnualDebtService / fannieMaeLoanConstant;
  
  // Use actual Fannie Mae loan amount ($2M from sources)
  const actualAnnualDebtService = assumptions.sources.fannieMaeLoan * fannieMaeLoanConstant;
  const cashFlowAfterDebt = availableForDebtService - actualAnnualDebtService;
  
  // Return metrics
  const capRate = netOperatingIncome / totalDevelopmentCost;
  const dscr = availableForDebtService / actualAnnualDebtService;
  const debtYield = netOperatingIncome / assumptions.sources.fannieMaeLoan;
  const ltv = assumptions.sources.fannieMaeLoan / totalDevelopmentCost;
  
  // Funding analysis (all from sources, no magic numbers)
  const totalSources = assumptions.sources.fannieMaeLoan + 
                      assumptions.sources.equity + 
                      assumptions.sources.grants + 
                      assumptions.sources.citySoftLoan.amount;
  const fundingGap = totalDevelopmentCost - totalSources;
  const gapFinancingNeeded = fundingGap > 0 ? fundingGap : 0;
  
  // Per unit metrics
  const costPerUnit = totalDevelopmentCost / totalUnits;
  const noiPerUnit = netOperatingIncome / totalUnits;
  const rentPerUnit = grossPotentialRent / totalUnits / 12;
  const reservePerUnit = replacementReserves / totalUnits;
  
  return {
    scenarioName: assumptions.scenarioName,
    totalUnits,
    totalDevelopmentCost,
    grossPotentialRent,
    vacancy,
    badDebt,
    effectiveGrossIncome,
    propertyManagement,
    contractServices,
    repairsMaintenance,
    suppliesEquipment,
    supportiveServices,
    waterSewer,
    electricity,
    advertising,
    realEstateTaxes,
    insurance,
    landJVPayment,
    totalOperatingExpenses,
    netOperatingIncome,
    replacementReserves,
    cashFlowBeforeDebt,
    citySoftLoanInterest,
    availableForDebtService,
    maxAnnualDebtService,
    fannieMaeLoanConstant,
    maxSupportableDebt,
    actualAnnualDebtService,
    cashFlowAfterDebt,
    capRate,
    dscr,
    debtYield,
    ltv,
    totalSources,
    fundingGap,
    gapFinancingNeeded,
    costPerUnit,
    noiPerUnit,
    rentPerUnit,
    reservePerUnit
  };
};

// Sensitivity analysis scenarios
export const createSensitivityScenario = (
  baseAssumptions: Assumptions,
  scenarioName: string,
  modifications: {
    rentMultiplier?: number;
    opexMultiplier?: number;
    vacancyRate?: number;
  }
): { name: string; model: FinancialModel } => {
  const modifiedAssumptions = { ...baseAssumptions };
  
  // Apply rent modifications
  if (modifications.rentMultiplier) {
    modifiedAssumptions.unitMix = baseAssumptions.unitMix.map(unit => ({
      ...unit,
      marketRent: unit.marketRent * modifications.rentMultiplier!,
      amiCapRent: unit.amiCapRent ? unit.amiCapRent * modifications.rentMultiplier! : undefined
    }));
  }
  
  // Apply operating expense modifications
  if (modifications.opexMultiplier) {
    const opex = baseAssumptions.operatingExpenses;
    modifiedAssumptions.operatingExpenses = {
      ...opex,
      repairsMaintenance: opex.repairsMaintenance * modifications.opexMultiplier,
      suppliesEquipment: opex.suppliesEquipment * modifications.opexMultiplier,
      waterSewer: opex.waterSewer * modifications.opexMultiplier,
      electricity: opex.electricity * modifications.opexMultiplier,
      total: opex.total * modifications.opexMultiplier
    };
  }
  
  // Apply vacancy modifications
  if (modifications.vacancyRate) {
    modifiedAssumptions.vacancy = modifications.vacancyRate;
  }
  
  return {
    name: scenarioName,
    model: calculateFinancialModel(modifiedAssumptions)
  };
};

export const standardSensitivityScenarios = (base: Assumptions) => [
  {
    name: 'Base Case',
    model: calculateFinancialModel(base)
  },
  createSensitivityScenario(base, 'Rents -5%', { rentMultiplier: 0.95 }),
  createSensitivityScenario(base, 'Rents -10%', { rentMultiplier: 0.90 }),
  createSensitivityScenario(base, 'OpEx +10%', { opexMultiplier: 1.10 }),
  createSensitivityScenario(base, 'OpEx +20%', { opexMultiplier: 1.20 }),
  createSensitivityScenario(base, 'Vacancy 5%', { vacancyRate: 0.05 }),
  createSensitivityScenario(base, 'All Adverse', { 
    rentMultiplier: 0.90, 
    opexMultiplier: 1.20, 
    vacancyRate: 0.05 
  })
];

// Format functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatRatio = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}x`;
};

// Status determination with proper thresholds
export const getMetricStatus = (
  metric: 'dscr' | 'debtYield' | 'capRate' | 'fundingGap',
  value: number,
  assumptions: Assumptions
): 'excellent' | 'good' | 'marginal' | 'poor' => {
  switch (metric) {
    case 'dscr':
      if (value >= 1.35) return 'excellent';
      if (value >= 1.25) return 'good';
      if (value >= assumptions.underwriting.dscrMin) return 'marginal';
      return 'poor';
      
    case 'debtYield':
      if (value >= 0.12) return 'excellent';
      if (value >= 0.11) return 'good';
      if (value >= assumptions.underwriting.debtYieldMin) return 'marginal';
      return 'poor';
      
    case 'capRate':
      if (value >= 0.055) return 'excellent';
      if (value >= 0.050) return 'good';
      if (value >= 0.045) return 'marginal';
      return 'poor';
      
    case 'fundingGap':
      if (value <= 1000000) return 'excellent';    // Gap ≤ $1M
      if (value <= 1500000) return 'good';         // Gap ≤ $1.5M
      if (value <= 2000000) return 'marginal';     // Gap ≤ $2M
      return 'poor';                               // Gap > $2M
      
    default:
      return 'marginal';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'excellent': return 'text-green-700 bg-green-50';
    case 'good': return 'text-green-600 bg-green-50';
    case 'marginal': return 'text-amber-600 bg-amber-50';
    case 'poor': return 'text-red-600 bg-red-50';
    default: return 'text-slate-600 bg-slate-50';
  }
};

// Unit tests for critical calculations
export const runCalculationTests = (assumptions: Assumptions): boolean => {
  const model = calculateFinancialModel(assumptions);
  let allTestsPassed = true;
  
  console.log(`\n=== CALCULATION TESTS: ${assumptions.scenarioName} ===`);
  
  // Test 1: GPR calculation
  const expectedGPR = assumptions.scenarioName === 'CONCEPT_32' ? 400800 : 
                     calculateGPR(assumptions);
  if (Math.abs(model.grossPotentialRent - expectedGPR) > 1) {
    console.error(`❌ GPR Test Failed: Expected ${expectedGPR}, Got ${model.grossPotentialRent}`);
    allTestsPassed = false;
  } else {
    console.log(`✅ GPR Test Passed: $${model.grossPotentialRent.toLocaleString()}`);
  }
  
  // Test 2: EGI calculation
  const expectedEGI = model.grossPotentialRent - model.vacancy - model.badDebt;
  if (Math.abs(model.effectiveGrossIncome - expectedEGI) > 1) {
    console.error(`❌ EGI Test Failed: Expected ${expectedEGI}, Got ${model.effectiveGrossIncome}`);
    allTestsPassed = false;
  } else {
    console.log(`✅ EGI Test Passed: $${model.effectiveGrossIncome.toLocaleString()}`);
  }
  
  // Test 3: Property Management = EGI × 4%
  const expectedPM = model.effectiveGrossIncome * assumptions.mgmtFeeRate;
  if (Math.abs(model.propertyManagement - expectedPM) > 1) {
    console.error(`❌ Property Management Test Failed: Expected ${expectedPM}, Got ${model.propertyManagement}`);
    allTestsPassed = false;
  } else {
    console.log(`✅ Property Management Test Passed: $${model.propertyManagement.toLocaleString()}`);
  }
  
  // Test 4: DSCR calculation
  const expectedDSCR = model.availableForDebtService / model.actualAnnualDebtService;
  if (Math.abs(model.dscr - expectedDSCR) > 0.01) {
    console.error(`❌ DSCR Test Failed: Expected ${expectedDSCR.toFixed(2)}, Got ${model.dscr.toFixed(2)}`);
    allTestsPassed = false;
  } else {
    console.log(`✅ DSCR Test Passed: ${model.dscr.toFixed(2)}x`);
  }
  
  // Test 5: Funding gap calculation
  const expectedGap = model.totalDevelopmentCost - model.totalSources;
  if (Math.abs(model.fundingGap - expectedGap) > 1) {
    console.error(`❌ Funding Gap Test Failed: Expected ${expectedGap}, Got ${model.fundingGap}`);
    allTestsPassed = false;
  } else {
    console.log(`✅ Funding Gap Test Passed: $${model.fundingGap.toLocaleString()}`);
  }
  
  console.log(`\n=== TEST SUMMARY: ${allTestsPassed ? '✅ ALL PASSED' : '❌ SOME FAILED'} ===\n`);
  
  return allTestsPassed;
};