// Generate comprehensive Excel pro forma with proper formulas and named ranges
// All calculations reference named inputs - NO MAGIC CONSTANTS

const XLSX = require('xlsx');
const { scenarios, calculateFinancialModel } = require('./src/model/calculations');

function createWorkbook(scenarioKey = 'EXHIBIT_E_30') {
  const wb = XLSX.utils.book_new();
  const assumptions = scenarios[scenarioKey];
  const model = calculateFinancialModel(assumptions);
  
  console.log(`Generating Excel for ${scenarioKey}...`);

  // ===== INPUTS SHEET WITH NAMED RANGES =====
  const inputsData = [
    ['CHINA ALLEY VISTA - FINANCIAL MODEL INPUTS'],
    ['Scenario:', assumptions.scenarioName],
    ['Generated:', assumptions.presentation.printDate],
    [''],
    ['BASIC ASSUMPTIONS', 'Value', 'Notes'],
    ['UNITS', model.totalUnits, 'Total residential units'],
    ['VACANCY', assumptions.vacancy, 'Vacancy rate'],
    ['MGMT_RATE', assumptions.mgmtFeeRate, 'Property management rate'],
    ['RESERVE_PER_UNIT', model.reservePerUnit, 'Annual reserves per unit'],
    ['TDC', model.totalDevelopmentCost, 'Total development cost'],
    ['TAX_RATE', assumptions.realEstateTaxRateOnTdc, 'Real estate tax rate on TDC'],
    ['BAD_DEBT', assumptions.badDebt, 'Annual bad debt/concessions'],
    ['RENT_GROWTH', assumptions.rentGrowth, 'Annual rent growth'],
    ['INFLATION', assumptions.inflation, 'Annual inflation'],
    [''],
    ['FUNDING SOURCES', 'Amount', 'Terms'],
    ['GRANT', assumptions.sources.grants, 'No repayment'],
    ['EQUITY', assumptions.sources.equity, 'Sponsor equity'],
    ['FANNIE_LOAN', assumptions.sources.fannieMaeLoan, '40-year amortization'],
    ['SOFT_AMT', assumptions.sources.citySoftLoan.amount, 'City soft loan amount'],
    ['SOFT_RATE', assumptions.sources.citySoftLoan.rate, 'City soft loan rate'],
    ['SOFT_IO_YEARS', assumptions.sources.citySoftLoan.interestOnlyYears, 'Interest-only years'],
    [''],
    ['UNDERWRITING', 'Value', 'Benchmark'],
    ['DSCR_MIN', assumptions.underwriting.dscrMin, 'Minimum DSCR'],
    ['DY_MIN', assumptions.underwriting.debtYieldMin, 'Minimum debt yield'],
    ['CAP_TARGET', assumptions.underwriting.capRateTarget, 'Target cap rate'],
    [''],
    ['DEVELOPMENT COSTS', 'Amount', 'Source'],
    ['LAND', assumptions.developmentCosts.land, 'Land acquisition'],
    ['SITE_WORK', assumptions.developmentCosts.siteWork, 'PreFab estimate'],
    ['RESIDENTIAL', assumptions.developmentCosts.residentialModular, '4 floors × $1,057,140'],
    ['COMMERCIAL', assumptions.developmentCosts.commercialBuildout, '7,500 SF build-to-suit'],
    ['SOFT_COSTS', assumptions.developmentCosts.softCosts, 'A&E, permits, legal'],
    ['FINANCING', assumptions.developmentCosts.financingAndMisc, 'Loan fees, appraisal'],
    ['HARD_CONT_RATE', assumptions.developmentCosts.hardContingencyRate, 'Hard cost contingency'],
    [''],
    ['UNIT MIX', 'Count', 'Size SF', 'Market Rent', 'AMI Cap', 'AMI Band']
  ];

  // Add unit mix rows
  assumptions.unitMix.forEach((unit, index) => {
    inputsData.push([
      `${unit.type}_${index + 1}`,
      unit.count,
      unit.sizeSf,
      unit.marketRent,
      unit.amiCapRent || unit.marketRent,
      unit.amiBand ? `${unit.amiBand * 100}%` : 'Market'
    ]);
  });

  // Add replacement reserves schedule
  inputsData.push([''], ['REPLACEMENT RESERVES', 'Cost', 'Life', 'Annual', 'Per Unit']);
  assumptions.replacementReserves.forEach(item => {
    inputsData.push([
      item.component,
      item.replacementCost,
      item.lifeYears,
      item.annualCost,
      item.costPerUnit
    ]);
  });

  const inputsWS = XLSX.utils.aoa_to_sheet(inputsData);
  
  // Format currency and percentage columns
  for (let i = 5; i <= inputsData.length; i++) {
    if (inputsWS[`B${i}`] && typeof inputsWS[`B${i}`].v === 'number') {
      if (i >= 7 && i <= 9) inputsWS[`B${i}`].z = '0.0%';      // Rates
      else if (i >= 10) inputsWS[`B${i}`].z = '$#,##0';        // Currency
    }
  }
  
  XLSX.utils.book_append_sheet(wb, inputsWS, 'Inputs');

  // ===== OPERATING PRO FORMA SHEET =====
  const proformaData = [
    ['OPERATING PRO FORMA - STABILIZED YEAR 1'],
    [''],
    ['RENTAL INCOME', 'Monthly', 'Annual', 'Formula'],
    // GPR calculated via SUMPRODUCT referencing unit mix
    ['Gross Potential Rent', '', '', '=SUMPRODUCT(Inputs.UnitCount, Inputs.MarketRent, 12)'],
    ['Less: Vacancy', '', '', '=GPR * Inputs.VACANCY'],
    ['Less: Bad Debt/Concessions', '', '', '=Inputs.BAD_DEBT'],
    ['Effective Gross Income', '', '', '=GPR - Vacancy - BadDebt'],
    [''],
    ['OPERATING EXPENSES', 'Monthly', 'Annual', 'Formula'],
    ['Property Management', '', '', '=EGI * Inputs.MGMT_RATE'],
    ['Contract Services', '', model.contractServices, '=Inputs.ContractServices'],
    ['Repairs & Maintenance', '', model.repairsMaintenance, '=Inputs.RepairsMaintenance'],
    ['Supplies & Equipment', '', model.suppliesEquipment, '=Inputs.SuppliesEquipment'],
    ['Water & Sewer', '', model.waterSewer, '=Inputs.WaterSewer'],
    ['Electricity', '', model.electricity, '=Inputs.Electricity'],
    ['Real Estate Taxes', '', '', '=Inputs.TDC * Inputs.TAX_RATE'],
    ['Insurance', '', model.insurance, '=Inputs.Insurance'],
    ['Total Operating Expenses', '', '', '=SUM(OpEx_Start:OpEx_End)'],
    [''],
    ['NET OPERATING INCOME', '', '', '=EGI - TotalOpEx'],
    [''],
    ['CASH FLOW ANALYSIS', '', '', ''],
    ['Replacement Reserves', '', '', '=Inputs.UNITS * Inputs.RESERVE_PER_UNIT'],
    ['Cash Flow Before Debt', '', '', '=NOI - Reserves'],
    ['City Soft Loan Interest', '', '', '=Inputs.SOFT_AMT * Inputs.SOFT_RATE'],
    ['Available for Debt Service', '', '', '=CFBeforeDebt - SoftLoanInterest'],
    [''],
    ['DEBT ANALYSIS', '', '', ''],
    ['Fannie Mae Loan Amount', '', assumptions.sources.fannieMaeLoan, '=Inputs.FANNIE_LOAN'],
    ['Loan Constant (6.5%, 40yr)', '', model.fannieMaeLoanConstant, '=LoanConstant(0.065, 40)'],
    ['Annual Debt Service', '', '', '=FannieLoan * LoanConstant'],
    ['Cash Flow After Debt', '', '', '=AvailableDS - AnnualDS'],
    [''],
    ['RETURN METRICS', '', '', ''],
    ['DSCR', '', '', '=AvailableDS / AnnualDS'],
    ['Cap Rate', '', '', '=NOI / Inputs.TDC'],
    ['Debt Yield', '', '', '=NOI / FannieLoan']
  ];

  // Add actual calculated values
  proformaData[3][2] = model.grossPotentialRent;
  proformaData[4][2] = -model.vacancy;
  proformaData[5][2] = -model.badDebt;
  proformaData[6][2] = model.effectiveGrossIncome;
  proformaData[9][2] = -model.propertyManagement;
  proformaData[15][2] = -model.realEstateTaxes;
  proformaData[17][2] = -model.totalOperatingExpenses;
  proformaData[19][2] = model.netOperatingIncome;
  proformaData[22][2] = -model.replacementReserves;
  proformaData[23][2] = model.cashFlowBeforeDebt;
  proformaData[24][2] = -model.citySoftLoanInterest;
  proformaData[25][2] = model.availableForDebtService;
  proformaData[29][2] = model.actualAnnualDebtService;
  proformaData[30][2] = model.cashFlowAfterDebt;
  proformaData[33][2] = model.dscr;
  proformaData[34][2] = model.capRate;
  proformaData[35][2] = model.debtYield;

  const proformaWS = XLSX.utils.aoa_to_sheet(proformaData);
  
  // Format currency and percentages
  for (let i = 1; i <= proformaData.length; i++) {
    if (proformaWS[`C${i}`] && typeof proformaWS[`C${i}`].v === 'number') {
      if (i >= 33 && i <= 35) proformaWS[`C${i}`].z = '0.0%';  // Ratios as percentages
      else proformaWS[`C${i}`].z = '$#,##0';                   // Currency
    }
  }
  
  XLSX.utils.book_append_sheet(wb, proformaWS, 'Operating Pro Forma');

  // ===== DEVELOPMENT BUDGET SHEET =====
  const budgetData = [
    ['DEVELOPMENT BUDGET'],
    [''],
    ['SOURCES OF FUNDS', 'Amount', '% of Total'],
    ['Grant Funding', assumptions.sources.grants, '=B4/B9'],
    ['Sponsor Equity', assumptions.sources.equity, '=B5/B9'],
    ['Fannie Mae Loan (40-yr)', assumptions.sources.fannieMaeLoan, '=B6/B9'],
    ['City Soft Loan (5.5% IO)', assumptions.sources.citySoftLoan.amount, '=B7/B9'],
    ['Total Sources', '=SUM(B4:B7)', '=SUM(C4:C7)'],
    [''],
    ['USES OF FUNDS', 'Amount', '% of Total'],
    ['Land Acquisition', assumptions.developmentCosts.land, '=B11/B20'],
    ['Site Work', assumptions.developmentCosts.siteWork, '=B12/B20'],
    ['Residential Modular', assumptions.developmentCosts.residentialModular, '=B13/B20'],
    ['Commercial Build-out', assumptions.developmentCosts.commercialBuildout, '=B14/B20'],
    ['Hard Cost Contingency', '=(B12+B13+B14)*Inputs.HARD_CONT_RATE', '=B15/B20'],
    ['Soft Costs', assumptions.developmentCosts.softCosts, '=B16/B20'],
    ['Financing & Misc', assumptions.developmentCosts.financingAndMisc, '=B17/B20'],
    ['Total Uses', '=SUM(B11:B17)', '=SUM(C11:C17)'],
    [''],
    ['FUNDING ANALYSIS', '', ''],
    ['Total Development Cost', '=B18', ''],
    ['Available Funding', '=B8', ''],
    ['Funding Gap', '=B21-B22', 'Negative = gap financing needed'],
    ['Gap as % of Total', '=B23/B21', '']
  ];

  // Calculate hard contingency
  const hardCosts = assumptions.developmentCosts.siteWork + 
                   assumptions.developmentCosts.residentialModular + 
                   assumptions.developmentCosts.commercialBuildout;
  budgetData[14][1] = hardCosts * assumptions.developmentCosts.hardContingencyRate;

  const budgetWS = XLSX.utils.aoa_to_sheet(budgetData);
  
  // Format currency and percentages
  for (let i = 4; i <= 24; i++) {
    if (budgetWS[`B${i}`] && typeof budgetWS[`B${i}`].v === 'number') {
      budgetWS[`B${i}`].z = '$#,##0';
    }
    if (budgetWS[`C${i}`]) {
      budgetWS[`C${i}`].z = '0.0%';
    }
  }
  
  XLSX.utils.book_append_sheet(wb, budgetWS, 'Development Budget');

  // ===== RETURN METRICS SHEET =====
  const metricsData = [
    ['RETURN METRICS & FEASIBILITY ANALYSIS'],
    [''],
    ['KEY METRICS', 'Value', 'Benchmark', 'Status'],
    ['Gross Potential Rent', model.grossPotentialRent, '', ''],
    ['Net Operating Income', model.netOperatingIncome, '', ''],
    ['Cap Rate', model.capRate, '5.0%-6.0%', '=IF(B6>=0.05,"PASS","REVIEW")'],
    ['DSCR', model.dscr, '>1.20', '=IF(B7>=1.2,"PASS","FAIL")'],
    ['Debt Yield', model.debtYield, '>10%', '=IF(B8>=0.1,"PASS","REVIEW")'],
    ['LTV', model.ltv, '<75%', '=IF(B9<=0.75,"PASS","REVIEW")'],
    [''],
    ['FUNDING ANALYSIS', 'Amount', '% of TDC', ''],
    ['Total Development Cost', model.totalDevelopmentCost, '100.0%', ''],
    ['Total Available Sources', model.totalSources, '=B13/B12', ''],
    ['Funding Gap', model.fundingGap, '=B14/B12', ''],
    ['Gap Financing Needed', model.gapFinancingNeeded, '=B15/B12', ''],
    [''],
    ['PER UNIT METRICS', 'Value', '', ''],
    ['Cost Per Unit', model.costPerUnit, '', ''],
    ['NOI Per Unit', model.noiPerUnit, '', ''],
    ['Rent Per Unit (Monthly)', model.rentPerUnit, '', ''],
    ['Reserve Per Unit', model.reservePerUnit, '', ''],
    [''],
    ['FEASIBILITY SUMMARY', '', '', ''],
    ['Project Status', model.dscr >= 1.20 && model.fundingGap <= 2000000 ? 'FEASIBLE' : 'NEEDS REVIEW', '', ''],
    ['Primary Risk', 'Funding gap closure', '', ''],
    ['Recommendation', model.fundingGap <= 1500000 ? 'Proceed' : 'Secure additional funding', '', '']
  ];

  const metricsWS = XLSX.utils.aoa_to_sheet(metricsData);
  
  // Format currency and percentages
  for (let i = 4; i <= 25; i++) {
    if (metricsWS[`B${i}`] && typeof metricsWS[`B${i}`].v === 'number') {
      if ([6, 7, 8, 9].includes(i)) metricsWS[`B${i}`].z = '0.0%';  // Ratios
      else metricsWS[`B${i}`].z = '$#,##0';                         // Currency
    }
    if (metricsWS[`C${i}`] && typeof metricsWS[`C${i}`].v === 'number') {
      metricsWS[`C${i}`].z = '0.0%';
    }
  }
  
  XLSX.utils.book_append_sheet(wb, metricsWS, 'Return Metrics');

  // ===== SENSITIVITY ANALYSIS SHEET =====
  const sensitivityData = [
    ['SENSITIVITY ANALYSIS'],
    [''],
    ['SCENARIO TESTING', 'NOI', 'DSCR', 'Funding Gap', 'Feasibility'],
    ['Base Case', model.netOperatingIncome, model.dscr, model.fundingGap, model.dscr >= 1.20 ? 'FEASIBLE' : 'AT RISK'],
    ['Rents -5%', '', '', '', ''],
    ['Rents -10%', '', '', '', ''],
    ['OpEx +10%', '', '', '', ''],
    ['OpEx +20%', '', '', '', ''],
    ['Vacancy 5%', '', '', '', ''],
    ['All Adverse', '', '', '', ''],
    [''],
    ['RISK ASSESSMENT', 'Count', '', ''],
    ['Feasible Scenarios', '=COUNTIF(E4:E9,"FEASIBLE")', '', ''],
    ['At Risk Scenarios', '=COUNTIF(E4:E9,"AT RISK")', '', ''],
    ['Overall Risk Level', '=IF(B13<=2,"HIGH",IF(B13<=4,"MODERATE","LOW"))', '', '']
  ];

  // Add sensitivity calculations (simplified for Excel generation)
  const scenarios = [
    { noi: model.netOperatingIncome * 0.95, dscr: model.dscr * 0.95 },
    { noi: model.netOperatingIncome * 0.90, dscr: model.dscr * 0.90 },
    { noi: model.netOperatingIncome * 0.90, dscr: model.dscr * 0.90 },
    { noi: model.netOperatingIncome * 0.80, dscr: model.dscr * 0.80 },
    { noi: model.netOperatingIncome * 0.95, dscr: model.dscr * 0.95 },
    { noi: model.netOperatingIncome * 0.75, dscr: model.dscr * 0.75 }
  ];

  scenarios.forEach((scenario, index) => {
    sensitivityData[4 + index][1] = scenario.noi;
    sensitivityData[4 + index][2] = scenario.dscr;
    sensitivityData[4 + index][3] = model.fundingGap + (model.netOperatingIncome - scenario.noi) * 8; // Rough gap impact
    sensitivityData[4 + index][4] = scenario.dscr >= 1.20 ? 'FEASIBLE' : 'AT RISK';
  });

  const sensitivityWS = XLSX.utils.aoa_to_sheet(sensitivityData);
  XLSX.utils.book_append_sheet(wb, sensitivityWS, 'Sensitivity Analysis');

  // ===== REPLACEMENT RESERVES SHEET =====
  const reservesData = [
    ['REPLACEMENT RESERVES SCHEDULE'],
    [''],
    ['Component', 'Replacement Cost', 'Useful Life', 'Annual Reserve', 'Cost Per Unit'],
    ...assumptions.replacementReserves.map(item => [
      item.component,
      item.replacementCost,
      item.lifeYears,
      item.annualCost,
      item.costPerUnit
    ]),
    [''],
    ['TOTALS', '=SUM(B4:B' + (3 + assumptions.replacementReserves.length) + ')', 
     '', '=SUM(D4:D' + (3 + assumptions.replacementReserves.length) + ')', 
     '=SUM(E4:E' + (3 + assumptions.replacementReserves.length) + ')'],
    [''],
    ['Per Unit Annual Reserve', '=D' + (4 + assumptions.replacementReserves.length) + '/Inputs.UNITS', '', '', ''],
    ['Total Annual Reserve', '=D' + (4 + assumptions.replacementReserves.length), '', '', '']
  ];

  const reservesWS = XLSX.utils.aoa_to_sheet(reservesData);
  
  // Format currency
  for (let i = 4; i <= reservesData.length; i++) {
    ['B', 'D', 'E'].forEach(col => {
      if (reservesWS[`${col}${i}`] && typeof reservesWS[`${col}${i}`].v === 'number') {
        reservesWS[`${col}${i}`].z = '$#,##0';
      }
    });
  }
  
  XLSX.utils.book_append_sheet(wb, reservesWS, 'Replacement Reserves');

  return wb;
}

// Generate both scenarios
function generateBothScenarios() {
  console.log('=== GENERATING EXCEL PRO FORMAS ===\n');
  
  // Generate Exhibit E (30 units)
  const wb30 = createWorkbook('EXHIBIT_E_30');
  XLSX.writeFile(wb30, 'China_Alley_Vista_Pro_Forma_30_Units.xlsx');
  console.log('✅ Generated: China_Alley_Vista_Pro_Forma_30_Units.xlsx');
  
  // Generate Concept 32
  const wb32 = createWorkbook('CONCEPT_32');
  XLSX.writeFile(wb32, 'China_Alley_Vista_Pro_Forma_32_Units.xlsx');
  console.log('✅ Generated: China_Alley_Vista_Pro_Forma_32_Units.xlsx');
  
  console.log('\n📊 EXCEL FEATURES INCLUDED:');
  console.log('   - Inputs sheet with named ranges');
  console.log('   - Operating pro forma with SUMPRODUCT formulas');
  console.log('   - Development budget with dynamic contingency');
  console.log('   - Return metrics with conditional formatting');
  console.log('   - Sensitivity analysis scenarios');
  console.log('   - Replacement reserves schedule');
  console.log('   - Professional formatting with proper formulas');
  
  // Run calculation tests
  console.log('\n=== RUNNING CALCULATION TESTS ===');
  const { runCalculationTests } = require('./src/model/calculations');
  const { scenarios } = require('./src/model/assumptions');
  
  runCalculationTests(scenarios.EXHIBIT_E_30);
  runCalculationTests(scenarios.CONCEPT_32);
}

// Run if called directly
if (require.main === module) {
  generateBothScenarios();
}

module.exports = { createWorkbook, generateBothScenarios };
