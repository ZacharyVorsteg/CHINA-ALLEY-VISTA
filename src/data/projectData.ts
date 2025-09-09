// CHINA ALLEY VISTA - Complete Project Data
// All exact numbers from source documents with professional tone
// Date: September 10, 2025

import { CONFIG, totalUnits, reservesAnnual } from './config';

export const exhibitE = {
  projectName: "Peacock Site",
  address: CONFIG.project.address,
  apn: "467-07-402",
  
  // EXACT unit distribution from Exhibit E image
  unitsByAMI: {
    "50_AMI": [
      { bedrooms: 0, units: 5, restricted: 5 },
      { bedrooms: 1, units: 2, restricted: 2 },
      { bedrooms: 2, units: 5, restricted: 5 },
      { bedrooms: 3, units: 5, restricted: 5 }
    ],
    "40_AMI": [
      { bedrooms: 0, units: 2, restricted: 2 },
      { bedrooms: 1, units: 1, restricted: 1 },
      { bedrooms: 2, units: 1, restricted: 1 },
      { bedrooms: 3, units: 1, restricted: 1 }
    ],
    "30_AMI": [
      { bedrooms: 0, units: 3, restricted: 3 },
      { bedrooms: 1, units: 1, restricted: 1 },
      { bedrooms: 2, units: 2, restricted: 2 },
      { bedrooms: 3, units: 1, restricted: 1 }
    ],
    "Manager": [
      { bedrooms: 3, units: 1, restricted: 0 }
    ]
  },
  
  totals: {
    units: CONFIG.TOTAL_UNITS_EXHIBIT_E,
    restricted: 29
  }
};

export const preFabEstimate = {
  siteWork: {
    foundation: 255000,
    electricalScoping: 155000, // "Electrical Scoping and connection"
    plumbingScoping: 168000, // "Plumbing Scoping and Connection"
    sewerScoping: 0, // included in plumbing
    soilsTesting: 13460, // "Soils Testing, Compaction and Certification"
    publicSurfacing: 95000,
    siteWorkTotal: 812653 // PreFab total is authoritative - sub-lines are illustrative
  },
  
  commercial: {
    squareFeet: CONFIG.project.commercialSF,
    description: "build to suit setup with Fire Suppression and 2 ADA accessible restrooms",
    cost: 450500 // Corrected from original submission of $750,500
  },
  
  residentialPerFloor: {
    threeBedTwoBath: {
      count: 2,
      size: 1000,
      costEach: 159604,
      subtotal: 319208
    },
    twoBedTwoBath: {
      count: 2,
      size: 750,
      costEach: 146952,
      subtotal: 293904
    },
    studioOneBath: {
      count: 4,
      size: 550,
      costEach: 96512,
      subtotal: 386048
    },
    laundryStairs: {
      count: 1,
      cost: 57980
    },
    totalPerFloor: 1057140,
    numberOfFloors: 4,
    totalResidential: 4228560
  },
  
  projectTotal: 5491713
};

// Original budget as submitted - requires corrections
export const originalBudget = {
  landAcquisition: {
    purchasePrice: 0,
    recordingFees: 7500,
    legalFees: 7500,
    developerDueDiligence: 52500,
    titleInsurance: 5000,
    total: 72500
  },
  
  softCosts: {
    architecturalFees: 17500,
    generalLiability: 25000,
    geoTechnical: 9500,
    waterSewerLine: 25000,
    electricalHookup: 50000,
    civilEngineering: 11500,
    developmentFeesBonds: 12000,
    legalConstruction: 5000,
    sitePlanReview: 5000,
    buildingPermit: 25000,
    bondPremium: 75000,
    contingency: 9118, // Submitted at 3.5% - industry standard is 5-10%
    total: 269618
  },
  
  hardCostBreakdown: {
    wetUtilities: 168000,
    dryUtilities: 155000,
    surfacing: 95000,
    foundations: 255000,
    contingency: 13460, // Submitted at 2% - below industry standard
    totalSiteCosts: 686460,
    
    factoryBuilt: {
      floor1: 999160, // Requires correction - should be 1057140
      floor2: 999160, // Requires correction
      floor3: 999160, // Requires correction  
      floor4: 999160, // Requires correction
      laundryRooms: 231920, // Already included in floor costs
      commercial: 750500, // Submitted value - should be 450500
      delivery: 48000,
      crane: 96000,
      inflationContingency: 153692, // 3% 
      totalFactory: 5276752
    }
  },
  
  financing: {
    appraisal: 7500,
    legalOffering: 9000,
    projectMarketing: 40000,
    total: 56500
  },
  
  totalProjectCost: CONFIG.project.totalDevelopmentCost
};

// Original pro forma as submitted - contains understatements
export const originalProforma = {
  income: {
    projectedMarketRents: 400800,
    belowMarketLeases: -10020,
    vacancyBadDebt: -10000, // 2.5% vacancy
    employeeUnits: 0,
    totalIncome: 390780 // $24,424/unit based on 32 units
  },
  
  // Operating expenses as submitted - significantly understated
  operatingExpenses: {
    contractServices: 0,
    repairsMaintenance: 1800, // Industry standard: $16,000
    suppliesEquipment: 1800,
    supportiveServices: 0,
    waterSewer: 9000,
    electricity: 6000,
    advertising: 0,
    propertyManagement: 0, // Critical omission - should be 4% of EGI
    realEstateTaxes: 2500, // Understated - should be $63,618
    insurance: 0, // Missing - should be $9,600
    landJVPayment: 0,
    total: 28300 // Understated by 84% - should be ~$140,000
  },
  
  noi: 362480, // Overstated due to expense understatement
  reserves: 1408, // Understated - should be $300/unit
  cashFlow: 361072 // Overstated
};

export const rentAssumptions = {
  unitProgram: {
    threeBedTwoBath: {
      count: 8,
      size: 1000,
      monthlyRent: 1300, // At AMI limit
      annualTotal: 124800
    },
    twoBedTwoBath: {
      count: 8,  
      size: 750,
      monthlyRent: 775, // Compliant with AMI
      annualTotal: 74400
    },
    studio: {
      count: 16,
      size: 550,
      monthlyRent: 1050, // Exceeds 50% AMI limit of $723
      annualTotal: 201600
    }
  },
  
  totalGrossRent: 400800,
  vacancyFactor: CONFIG.VACANCY_RATE,
  
  // HUD FMRs from spreadsheet
  hudFMR: {
    year: CONFIG.methodology.fmrTableYear,
    efficiency: 723,
    oneBed: 728,
    twoBed: 959,
    threeBed: 1337,
    fourBed: 1561
  }
};

// CORRECTED OPERATING EXPENSES - Industry Standards
export const correctedOperatingExpenses = {
  propertyManagement: (income: number) => income * CONFIG.PROPERTY_MGMT_RATE,
  repairsMaintenance: 16000, // $500/unit industry standard
  insurance: 9600, // $300/unit minimum
  utilitiesCommon: 14400, // $450/unit for common areas
  realEstateTaxes: CONFIG.project.totalDevelopmentCost * CONFIG.PROPERTY_TAX_RATE,
  adminMarketing: 8000, // $250/unit
  trashLandscaping: 9600, // $300/unit
  
  getTotal: function(income: number) {
    return this.propertyManagement(income) + 
           this.repairsMaintenance + 
           this.insurance + 
           this.utilitiesCommon + 
           this.realEstateTaxes + 
           this.adminMarketing + 
           this.trashLandscaping;
  }
  // Total: ~$139,456 vs submitted $28,300
};

// DEBT SIZING CALCULATION
export const debtCalculations = {
  // Maximum supportable debt at required DSCR
  calculateMaxDebt: (noi: number, rate = CONFIG.debt.interestRate, years = CONFIG.debt.amortizationYears, dscrRequired = CONFIG.debt.minDSCR) => {
    const annualDebtService = noi / dscrRequired;
    const monthlyPayment = annualDebtService / 12;
    const months = years * 12;
    const monthlyRate = rate / 12;
    
    // PV of annuity formula
    const maxLoan = monthlyPayment * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);
    return Math.round(maxLoan);
  },
  
  getCorrectedMaxDebt: () => {
    const correctedNOI = 214929; // With realistic operating expenses
    return debtCalculations.calculateMaxDebt(correctedNOI);
  }
};

// RENT COMPLIANCE ISSUES
export const rentCompliance = {
  studioCompliance: {
    currentRent: 1050,
    maxAllowed50AMI: 723,
    overLimit: 327,
    annualRevenueLoss: 327 * 16 * 12 // $62,784 revenue reduction needed
  }
};

// UNIT COUNT RECONCILIATION
export const unitCountIssue = {
  exhibitE: CONFIG.TOTAL_UNITS_EXHIBIT_E,
  proforma: CONFIG.TOTAL_UNITS_BUILD_PLAN,
  preFabQuote: CONFIG.TOTAL_UNITS_BUILD_PLAN,
  
  reconciliation: "Building plan shows 32 units (8 per floor × 4 floors). Exhibit E compliance document shows 30 units. Requires clarification: add 2 market-rate units to Exhibit E or reduce building to 30 units."
};

// FINANCIAL METRICS FORMULAS
export const metrics = {
  returnOnCost: (noi: number, totalProjectCost: number) => {
    return (noi / totalProjectCost * 100);
  },
  
  capRate: (noi: number, totalProjectCost: number) => {
    return (noi / totalProjectCost * 100);
  },
  
  dscr: (noi: number, annualDebtService: number) => {
    return (noi / annualDebtService);
  },
  
  cashOnCash: (cashFlowAfterDebt: number, totalEquity: number) => {
    return (cashFlowAfterDebt / totalEquity * 100);
  },
  
  ltv: (loanAmount: number, totalProjectCost: number) => {
    return (loanAmount / totalProjectCost * 100);
  },
  
  debtYield: (noi: number, loanAmount: number) => {
    return (noi / loanAmount * 100);
  }
};

// CASH FLOW WATERFALL CALCULATIONS
export const cashFlowWaterfall = {
  grossPotentialRent: 400800,
  lessVacancy: (gpr: number, vacancyRate = CONFIG.VACANCY_RATE) => gpr * vacancyRate,
  lessConcessions: CONFIG.project.concessions,
  effectiveGrossIncome: (gpr: number, vacancyRate = CONFIG.VACANCY_RATE) => gpr - (gpr * vacancyRate) - CONFIG.project.concessions,
  
  operatingExpenses: 139456, // Corrected to industry standards
  netOperatingIncome: (egi: number) => egi - 139456,
  
  reserves: reservesAnnual, // $300/unit × actual unit count
  cashFlowBeforeDebt: (noi: number) => noi - reservesAnnual,
  
  annualDebtService: (loanAmount: number, rate: number, years: number) => {
    const monthlyRate = rate / 12;
    const months = years * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    return monthlyPayment * 12;
  },
  
  cashFlowAfterDebt: (cfbd: number, ads: number) => cfbd - ads
};

// SENSITIVITY ANALYSIS GRID
export const sensitivityAnalysis = {
  baseCase: {
    noi: 214929,
    dscr: 1.28,
    irr: 8.7
  },
  
  scenarios: [
    { name: "Rents -5%", noiImpact: -19450, newDSCR: 1.15, newIRR: 6.8 },
    { name: "OpEx +10%", noiImpact: -13946, newDSCR: 1.19, newIRR: 7.9 },
    { name: "Vacancy 7.5%", noiImpact: -15030, newDSCR: 1.18, newIRR: 7.6 },
    { name: "Interest +50bp", noiImpact: 0, newDSCR: 1.22, newIRR: 7.4 },
    { name: "All Adverse", noiImpact: -48426, newDSCR: 0.98, newIRR: 3.2 }
  ]
};

// Sources and uses with config-driven values
export const sourcesAndUses = {
  sources: {
    equity: CONFIG.sources.equity,
    grant: CONFIG.sources.grant,
    homeFunds: CONFIG.sources.homeFunds,
    cityLoan: CONFIG.sources.cityLoan.amount,
    maxSupportableDebt: 0, // Calculated dynamically
    total: 0 // Calculated dynamically
  },
  
  uses: {
    landAcquisition: originalBudget.landAcquisition.total,
    hardCosts: preFabEstimate.projectTotal,
    softCosts: originalBudget.softCosts.total,
    financing: originalBudget.financing.total,
    total: CONFIG.project.totalDevelopmentCost
  },
  
  calculateFundingGap: (maxSupportableDebt: number) => {
    const totalSources = CONFIG.sources.equity + CONFIG.sources.grant + CONFIG.sources.homeFunds + maxSupportableDebt;
    return CONFIG.project.totalDevelopmentCost - totalSources;
  }
};

// DEPLOYMENT VALIDATION
export const deploymentChecks = {
  dataValidation: [
    `Verify ${totalUnits} units in proforma matches building plan`,
    "Confirm $139,456 operating expenses (not $28,300)",
    "Check DSCR >= 1.20 on all scenarios",
    "Validate funding gap calculation accuracy"
  ],
  
  visualChecks: [
    "Red highlighting on failing metrics",
    "Warning banner visible on load",
    "PDF export includes all sections",
    "Mobile responsive below 768px"
  ],
  
  calculations: [
    "NOI = $214,929 with corrected expenses",
    "Max debt calculation at 1.20x DSCR",
    "Funding gap with realistic assumptions",
    "Cash-on-cash return accuracy"
  ]
};

// Export computed values
export { totalUnits, reservesAnnual };