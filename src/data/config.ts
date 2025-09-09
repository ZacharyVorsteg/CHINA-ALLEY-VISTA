// Configuration constants for China Alley Vista Financial Analysis
// Single source of truth for all key assumptions

export const CONFIG = {
  // Unit count reconciliation
  TOTAL_UNITS_BUILD_PLAN: 32,
  TOTAL_UNITS_EXHIBIT_E: 30,
  DEFAULT_UNITS_MODE: 'BUILD_PLAN' as 'BUILD_PLAN' | 'EXHIBIT_E',
  
  // Operating assumptions
  RESERVE_PER_UNIT: 300,
  VACANCY_RATE: 0.025, // 2.5%
  PROPERTY_MGMT_RATE: 0.04, // 4% of EGI
  PROPERTY_TAX_RATE: 0.01, // 1% of TDC
  
  // Sources of funds
  sources: {
    equity: 1250000,
    grant: 1500000, // IIG Grant
    homeFunds: 250000, // HOME Funds  
    cityLoan: { 
      amount: 0, // Not used in this scenario
      rate: 0.055, 
      termYears: 3 
    }
  },
  
  // Debt assumptions
  debt: {
    interestRate: 0.0625, // 6.25%
    amortizationYears: 40,
    minDSCR: 1.20
  },
  
  // Project details
  project: {
    name: "China Alley Vista",
    address: "943 F Street, Fresno, CA 93721", // Consistent address
    alternateAddress: "935 China Alley, Fresno, CA 93706",
    totalDevelopmentCost: 6361829,
    commercialSF: 7500,
    concessions: 10020 // Annual concessions
  },
  
  // Methodology sources
  methodology: {
    propertyTaxBasis: "1% of Total Development Cost (Fresno County average)",
    managementFeeBasis: "4% of Effective Gross Income (industry standard)",
    reservesBasis: "$300 per unit annually (replacement reserve standard)",
    vacancyBasis: "2.5% (affordable housing market average)",
    amiTableYear: "FY 2021 HUD Income Limits",
    fmrTableYear: "FY 2021 HUD Fair Market Rents",
    opexBenchmarks: "Industry standards: R&M $500/unit, Insurance $300/unit, Utilities $450/unit"
  }
};

// Computed values
export const totalUnits = CONFIG.DEFAULT_UNITS_MODE === 'BUILD_PLAN' 
  ? CONFIG.TOTAL_UNITS_BUILD_PLAN 
  : CONFIG.TOTAL_UNITS_EXHIBIT_E;

export const reservesAnnual = CONFIG.RESERVE_PER_UNIT * totalUnits;

export const totalAvailableFunding = CONFIG.sources.equity + 
                                   CONFIG.sources.grant + 
                                   CONFIG.sources.homeFunds + 
                                   CONFIG.sources.cityLoan.amount;
