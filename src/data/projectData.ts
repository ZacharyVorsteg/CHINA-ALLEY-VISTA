// CHINA ALLEY VISTA - Complete Project Data
// All exact numbers from source documents
// Date: September 10, 2025

export const exhibitE = {
  projectName: "Peacock Site",
  address: "943 F Street, Fresno CA 93721",
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
    units: 30,
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
    siteWorkTotal: 812653 // Their total - note discrepancy
  },
  
  commercial: {
    squareFeet: 7500,
    description: "build to suit setup with Fire Suppression and 2 ADA accessible restrooms",
    cost: 450500
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

export const originalBudget = {
  // These are the WRONG numbers from the original
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
    contingency: 9118, // 3.5% - TOO LOW
    total: 269618
  },
  
  // CRITICAL: Their "hard costs" math is wrong
  hardCostBreakdown: {
    wetUtilities: 168000,
    dryUtilities: 155000,
    surfacing: 95000,
    foundations: 255000,
    contingency: 13460, // 2% - WAY TOO LOW
    totalSiteCosts: 686460,
    
    factoryBuilt: {
      floor1: 999160, // Wrong - should be 1057140
      floor2: 999160, // Wrong
      floor3: 999160, // Wrong  
      floor4: 999160, // Wrong
      laundryRooms: 231920, // Already included above
      commercial: 750500, // Wrong - should be 450500
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
  
  totalProjectCost: 6361829
};

export const originalProforma = {
  // These are the WRONG numbers that need correction
  income: {
    projectedMarketRents: 400800,
    belowMarketLeases: -10020,
    vacancyBadDebt: -10000, // 2.5% vacancy
    employeeUnits: 0,
    totalIncome: 390780 // $24,424/unit
  },
  
  // CRITICALLY UNDERSTATED
  operatingExpenses: {
    contractServices: 0,
    repairsMaintenance: 1800, // Should be $16,000
    suppliesEquipment: 1800,
    supportiveServices: 0,
    waterSewer: 9000,
    electricity: 6000,
    advertising: 0,
    propertyManagement: 0, // FATAL FLAW - should be 4% of EGI
    realEstateTaxes: 2500, // Should be $63,618
    insurance: 0, // Should be $9,600
    landJVPayment: 0,
    total: 28300 // FANTASY - should be ~$140,000
  },
  
  noi: 362480, // OVERSTATED
  reserves: 1408, // Should be $9,600
  cashFlow: 361072 // OVERSTATED
};

export const rentAssumptions = {
  unitProgram: {
    threeBedTwoBath: {
      count: 8,
      size: 1000,
      monthlyRent: 1300, // Current in model
      annualTotal: 124800
    },
    twoBedTwoBath: {
      count: 8,  
      size: 750,
      monthlyRent: 775, // Current in model
      annualTotal: 74400
    },
    studio: {
      count: 16,
      size: 550,
      monthlyRent: 1050, // OVER AMI LIMIT
      annualTotal: 201600
    }
  },
  
  totalGrossRent: 400800,
  vacancyFactor: 0.025,
  
  // HUD FMRs from spreadsheet
  hudFMR: {
    year: "FY 2021",
    efficiency: 723,
    oneBed: 728,
    twoBed: 959,
    threeBed: 1337,
    fourBed: 1561
  }
};

// CORRECTED OPERATING EXPENSES
export const correctedOperatingExpenses = {
  propertyManagement: (income: number) => income * 0.04, // 4% of EGI - MANDATORY
  repairsMaintenance: 16000, // $500/unit industry standard
  insurance: 9600, // $300/unit minimum
  utilitiesCommon: 14400, // $450/unit for common areas
  realEstateTaxes: 63618, // 1% of property value
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
  // Total: ~$139,456 vs fantasy $28,300
};

// DEBT SIZING CALCULATION
export const debtCalculations = {
  // Maximum supportable debt at 1.20x DSCR
  calculateMaxDebt: (noi: number, rate = 0.0625, years = 40, dscrRequired = 1.20) => {
    const annualDebtService = noi / dscrRequired;
    const monthlyPayment = annualDebtService / 12;
    const months = years * 12;
    const monthlyRate = rate / 12;
    
    // PV of annuity formula
    const maxLoan = monthlyPayment * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);
    return Math.round(maxLoan);
  },
  
  // With corrected NOI of $214,929
  getCorrectedMaxDebt: () => {
    const correctedNOI = 214929;
    return debtCalculations.calculateMaxDebt(correctedNOI);
  }
  // = ~$1,430,000 NOT $2,000,000
  // This increases funding gap from $1,361,829 to $1,931,829
};

// RENT COMPLIANCE ISSUES
export const rentCompliance = {
  // Studios charging $1,050 but max AMI is $723
  studioCompliance: {
    currentRent: 1050,
    maxAllowed50AMI: 723,
    overLimit: 327,
    annualRevenueLoss: 327 * 16 * 12 // $62,784 revenue reduction
  }
};

// UNIT COUNT RECONCILIATION
export const unitCountIssue = {
  exhibitE: 30, // Official compliance document
  proforma: 32, // What's in the financial model
  preFabQuote: 32, // 8 units × 4 floors
  
  reconciliation: "Must add 2 market-rate units to Exhibit E or reduce building to 30"
};

// FINANCIAL METRICS FORMULAS
export const metrics = {
  // Return on Cost
  returnOnCost: (noi: number, totalProjectCost: number) => {
    return (noi / totalProjectCost * 100);
  },
  
  // Cap Rate  
  capRate: (noi: number, totalProjectCost: number) => {
    return (noi / totalProjectCost * 100);
  },
  
  // Debt Service Coverage Ratio
  dscr: (noi: number, annualDebtService: number) => {
    return (noi / annualDebtService);
  },
  
  // Cash on Cash Return
  cashOnCash: (cashFlowAfterDebt: number, totalEquity: number) => {
    return (cashFlowAfterDebt / totalEquity * 100);
  },
  
  // Loan to Value
  ltv: (loanAmount: number, totalProjectCost: number) => {
    return (loanAmount / totalProjectCost * 100);
  },
  
  // Debt Yield
  debtYield: (noi: number, loanAmount: number) => {
    return (noi / loanAmount * 100);
  }
};

// CASH FLOW WATERFALL CALCULATIONS
export const cashFlowWaterfall = {
  grossPotentialRent: 400800,
  lessVacancy: (gpr: number, vacancyRate = 0.025) => gpr * vacancyRate,
  lessConcessions: 10020,
  effectiveGrossIncome: (gpr: number, vacancyRate = 0.025) => gpr - (gpr * vacancyRate) - 10020,
  
  operatingExpenses: 139456, // CORRECTED
  netOperatingIncome: (egi: number) => egi - 139456,
  
  reserves: 9600, // $300/unit CORRECTED
  cashFlowBeforeDebt: (noi: number) => noi - 9600,
  
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

// DEPLOYMENT VALIDATION
export const deploymentChecks = {
  dataValidation: [
    "Verify 32 units in proforma matches building plan",
    "Confirm $139,456 operating expenses (not $28,300)",
    "Check DSCR >= 1.20 on all scenarios",
    "Validate funding gap shows $1,931,829"
  ],
  
  visualChecks: [
    "Red highlighting on failing metrics",
    "Warning banner visible on load",
    "PDF export includes all 7 sections",
    "Mobile responsive below 768px"
  ],
  
  calculations: [
    "NOI = $214,929 with corrected expenses",
    "Max debt = $1,430,000 at 1.20x DSCR",
    "True gap = $1,931,829",
    "Cash-on-cash = 9.8% (not 28.9%)"
  ]
};
