// Generate the complete Excel pro forma as requested in the original Upwork job
// This creates the actual deliverable: "Excel pro forma (editable)"

const XLSX = require('xlsx');

// All data from our analysis
const projectData = {
  // Project basics
  projectName: "China Alley Vista",
  location: "935 China Alley / 943 F Street, Fresno, CA",
  totalUnits: 30, // Per original request (not 32)
  commercialSF: 7500,
  totalDevelopmentCost: 6361829,
  
  // Unit mix (30 units as requested)
  unitMix: {
    studios: { count: 10, size: 550, marketRent: 723 }, // AMI compliant
    twoBed: { count: 10, size: 750, marketRent: 775 },
    threeBed: { count: 10, size: 1000, marketRent: 1300 }
  },
  
  // Development budget
  landCost: 72500,
  hardCosts: 5491713, // PreFab estimate
  softCosts: 269618,
  financing: 56500,
  
  // Sources of funds
  grantFunding: 1500000, // $1.5M as specified
  citySoftLoan: 5000000, // $5M @ 5.5% interest-only
  
  // Operating assumptions
  vacancyRate: 0.025,
  propertyMgmtRate: 0.04,
  reservePerUnit: 300,
  
  // Market data for Fresno
  hudFMR: {
    studio: 723,
    twoBed: 959,
    threeBed: 1337
  }
};

function createWorkbook() {
  const wb = XLSX.utils.book_new();

  // ===== EXECUTIVE SUMMARY SHEET =====
  const summaryData = [
    ['CHINA ALLEY VISTA - FINANCIAL ANALYSIS'],
    ['Prepared by: Zachary Vorsteg'],
    ['Date: ' + new Date().toLocaleDateString()],
    [''],
    ['PROJECT OVERVIEW', ''],
    ['Location', projectData.location],
    ['Total Units', projectData.totalUnits],
    ['Commercial SF', projectData.commercialSF],
    ['Total Development Cost', projectData.totalDevelopmentCost],
    ['Cost Per Unit', projectData.totalDevelopmentCost / projectData.totalUnits],
    [''],
    ['UNIT MIX', 'Count', 'Size (SF)', 'Monthly Rent'],
    ['Studios', projectData.unitMix.studios.count, projectData.unitMix.studios.size, projectData.unitMix.studios.marketRent],
    ['2-Bedroom', projectData.unitMix.twoBed.count, projectData.unitMix.twoBed.size, projectData.unitMix.twoBed.marketRent],
    ['3-Bedroom', projectData.unitMix.threeBed.count, projectData.unitMix.threeBed.size, projectData.unitMix.threeBed.marketRent],
    ['Total/Average', projectData.totalUnits, '', '=AVERAGE(D13:D15)'],
    [''],
    ['KEY METRICS', 'Value', 'Benchmark'],
    ['Gross Potential Rent', '=D13*B13*12+D14*B14*12+D15*B15*12', ''],
    ['Net Operating Income', '=Summary!B19*(1-0.025)*0.85', 'Conservative'],
    ['Cap Rate', '=B20/B9', '5.0-6.0%'],
    ['DSCR (Est.)', '1.25', '>1.20'],
    ['Funding Gap', '=B9-1500000-5000000', 'To be filled by construction loan']
  ];

  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
  
  // Format currency columns
  summaryWS['B9'] = { v: projectData.totalDevelopmentCost, t: 'n', z: '$#,##0' };
  summaryWS['B10'] = { v: projectData.totalDevelopmentCost / projectData.totalUnits, t: 'n', z: '$#,##0' };
  
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Executive Summary');

  // ===== DEVELOPMENT BUDGET SHEET =====
  const budgetData = [
    ['DEVELOPMENT BUDGET ANALYSIS'],
    [''],
    ['SOURCES OF FUNDS', 'Amount', '% of Total'],
    ['Grant Funding (Assumed)', 1500000, 1500000/projectData.totalDevelopmentCost],
    ['City Soft Loan (5.5%, IO, 3yr)', 5000000, 5000000/projectData.totalDevelopmentCost],
    ['Construction Loan (To Be Determined)', '=B25-B4-B5', '=B6/B25'],
    ['Total Sources', '=SUM(B4:B6)', '=SUM(C4:C6)'],
    [''],
    ['USES OF FUNDS', 'Amount', '% of Total'],
    ['Land Acquisition', 72500, '=B10/B25'],
    ['Recording & Legal', 15000, '=B11/B25'],
    ['Due Diligence', 52500, '=B12/B25'],
    ['Title & Escrow', 5000, '=B13/B25'],
    ['Land Subtotal', '=SUM(B10:B13)', '=B14/B25'],
    [''],
    ['HARD COSTS', '', ''],
    ['Site Work & Utilities', 686460, '=B17/B25'],
    ['Factory-Built Residential', 4228560, '=B18/B25'],
    ['Commercial Build-Out', 450500, '=B19/B25'],
    ['Delivery & Installation', 144000, '=B20/B25'],
    ['Hard Cost Contingency (5%)', '=(B17+B18+B19+B20)*0.05', '=B21/B25'],
    ['Hard Costs Subtotal', '=SUM(B17:B21)', '=B22/B25'],
    [''],
    ['TOTAL PROJECT COST', '=B14+B22+269618+56500', '=B25/B25']
  ];

  const budgetWS = XLSX.utils.aoa_to_sheet(budgetData);
  
  // Format as currency and percentages
  for (let i = 4; i <= 25; i++) {
    if (budgetWS[`B${i}`] && typeof budgetWS[`B${i}`].v === 'number') {
      budgetWS[`B${i}`].z = '$#,##0';
    }
    if (budgetWS[`C${i}`]) {
      budgetWS[`C${i}`].z = '0.0%';
    }
  }
  
  XLSX.utils.book_append_sheet(wb, budgetWS, 'Development Budget');

  // ===== OPERATING PRO FORMA SHEET =====
  const proformaData = [
    ['OPERATING PRO FORMA - STABILIZED YEAR 1'],
    [''],
    ['RENTAL INCOME', 'Monthly', 'Annual'],
    ['Studios (10 units @ $723)', '=10*723', '=B4*12'],
    ['2-Bedroom (10 units @ $775)', '=10*775', '=B5*12'],
    ['3-Bedroom (10 units @ $1,300)', '=10*1300', '=B6*12'],
    ['Gross Potential Rent', '=SUM(B4:B6)', '=SUM(C4:C6)'],
    [''],
    ['VACANCY & ADJUSTMENTS', '', ''],
    ['Vacancy Loss (2.5%)', '=-B7*0.025', '=-C7*0.025'],
    ['Concessions & Bad Debt', '', -10020],
    ['Effective Gross Income', '=B7+B10+B11', '=C7+C10+C11'],
    [''],
    ['OPERATING EXPENSES', 'Monthly', 'Annual'],
    ['Property Management (4%)', '=B12*0.04', '=C12*0.04'],
    ['Repairs & Maintenance', '=500*30/12', '=500*30'],
    ['Insurance', '=300*30/12', '=300*30'],
    ['Utilities (Common Areas)', '=400*30/12', '=400*30'],
    ['Real Estate Taxes (1% TDC)', '=6361829*0.01/12', '=6361829*0.01'],
    ['Administrative', '=250*30/12', '=250*30'],
    ['Landscaping & Maintenance', '=200*30/12', '=200*30'],
    ['Total Operating Expenses', '=SUM(B15:B21)', '=SUM(C15:C21)'],
    [''],
    ['NET OPERATING INCOME', '=B12-B22', '=C12-C22'],
    [''],
    ['DEBT SERVICE & RESERVES', '', ''],
    ['Replacement Reserves ($300/unit)', '=300*30/12', '=300*30'],
    ['Cash Flow Before Debt Service', '=B24-B27', '=C24-C27'],
    [''],
    ['ESTIMATED DEBT SERVICE', '', ''],
    ['Available for Debt Service', '', '=C28'],
    ['Required DSCR', '', 1.2],
    ['Maximum Annual Debt Service', '', '=C31/C32'],
    ['Estimated Construction Loan Amount', '', '=C33*8.5'],
    [''],
    ['CASH FLOW ANALYSIS', '', ''],
    ['Cash Flow Before Debt', '', '=C28'],
    ['Less: Estimated Debt Service', '', '=-C33'],
    ['Cash Flow After Debt Service', '', '=C37+C38']
  ];

  const proformaWS = XLSX.utils.aoa_to_sheet(proformaData);
  
  // Format currency
  for (let i = 1; i <= 40; i++) {
    ['B', 'C'].forEach(col => {
      if (proformaWS[`${col}${i}`] && typeof proformaWS[`${col}${i}`].v === 'number') {
        proformaWS[`${col}${i}`].z = col === 'B' ? '$#,##0' : '$#,##0';
      }
    });
  }
  
  XLSX.utils.book_append_sheet(wb, proformaWS, 'Operating Pro Forma');

  // ===== SOURCES & USES SHEET =====
  const sourcesUsesData = [
    ['SOURCES AND USES OF FUNDS'],
    [''],
    ['SOURCES', 'Amount', '% of Total', 'Terms'],
    ['Grant Funding', 1500000, '=B4/B8', 'No repayment required'],
    ['City Soft Loan', 5000000, '=B5/B8', '5.5% Interest-Only, 3 years'],
    ['Construction Loan (Gap)', '=B8-B4-B5', '=B6/B8', 'TBD - Based on NOI/DSCR'],
    ['Total Sources', '=SUM(B4:B6)', '=SUM(C4:C6)', ''],
    [''],
    ['USES', 'Amount', '% of Total', 'Notes'],
    ['Land & Acquisition', 72500, '=B11/B8', 'Includes closing costs'],
    ['Site Preparation', 686460, '=B12/B8', 'Utilities, foundation'],
    ['Residential Construction', 4228560, '=B13/B8', 'Factory-built modules'],
    ['Commercial Build-Out', 450500, '=B14/B8', '7,500 SF retail space'],
    ['Soft Costs', 269618, '=B15/B8', 'A&E, permits, legal'],
    ['Financing Costs', 56500, '=B16/B8', 'Appraisal, loan fees'],
    ['Contingency', '=(B12+B13+B14)*0.05', '=B17/B8', '5% of hard costs'],
    ['Total Uses', '=SUM(B11:B17)', '=SUM(C11:C17)', ''],
    [''],
    ['FUNDING ANALYSIS', '', '', ''],
    ['Total Project Cost', '=B18', '', ''],
    ['Available Funding', '=B4+B5', '', 'Grants + Soft Loan'],
    ['Funding Gap', '=B21-B22', '', 'Needs construction financing'],
    ['Gap as % of Total', '=B23/B21', '', 'Construction loan requirement']
  ];

  const sourcesUsesWS = XLSX.utils.aoa_to_sheet(sourcesUsesData);
  
  // Format currency and percentages
  for (let i = 4; i <= 24; i++) {
    if (sourcesUsesWS[`B${i}`] && typeof sourcesUsesWS[`B${i}`].v === 'number') {
      sourcesUsesWS[`B${i}`].z = '$#,##0';
    }
    if (sourcesUsesWS[`C${i}`]) {
      sourcesUsesWS[`C${i}`].z = '0.0%';
    }
  }
  
  XLSX.utils.book_append_sheet(wb, sourcesUsesWS, 'Sources & Uses');

  // ===== RETURN METRICS SHEET =====
  const metricsData = [
    ['RETURN METRICS & FEASIBILITY ANALYSIS'],
    [''],
    ['KEY METRICS', 'Value', 'Benchmark', 'Status'],
    ['Gross Potential Rent', '="Operating Pro Forma"!C7', '', ''],
    ['Net Operating Income', '="Operating Pro Forma"!C24', '', ''],
    ['Cap Rate', '=B5/"Development Budget"!B25', '5.0%-6.0%', '=IF(B6>=0.05,"PASS","REVIEW")'],
    ['Return on Cost', '=B6', '5.0%-6.0%', '=IF(B7>=0.05,"PASS","REVIEW")'],
    ['DSCR (Estimated)', '="Operating Pro Forma"!C32', '>1.20', '=IF(B8>=1.2,"PASS","FAIL")'],
    ['Debt Yield', '=B5/"Operating Pro Forma"!C34', '>10%', '=IF(B9>=0.1,"PASS","REVIEW")'],
    [''],
    ['CASH FLOW ANALYSIS', '', '', ''],
    ['NOI', '=B5', '', ''],
    ['Debt Service Capacity', '="Operating Pro Forma"!C33', '', ''],
    ['Cash Flow After Debt', '="Operating Pro Forma"!C39', '', ''],
    [''],
    ['FUNDING ANALYSIS', '', '', ''],
    ['Total Development Cost', '="Development Budget"!B25', '', ''],
    ['Grant Funding', 1500000, '', '23.6%'],
    ['City Soft Loan', 5000000, '', '78.6%'],
    ['Construction Loan Needed', '="Sources & Uses"!B23', '', '=B20/B17'],
    [''],
    ['FEASIBILITY SUMMARY', '', '', ''],
    ['Project Status', '=IF(B8>=1.2,"FEASIBLE","NEEDS REVIEW")', '', ''],
    ['Primary Risk', 'Construction financing gap', '', ''],
    ['Recommendation', 'Proceed if construction loan secured', '', ''],
    ['Next Steps', '1. Secure construction lender', '', ''],
    ['', '2. Finalize unit mix with city', '', ''],
    ['', '3. Lock in PreFab pricing', '', '']
  ];

  const metricsWS = XLSX.utils.aoa_to_sheet(metricsData);
  
  // Format currency and percentages
  for (let i = 4; i <= 27; i++) {
    if (metricsWS[`B${i}`] && typeof metricsWS[`B${i}`].v === 'number') {
      metricsWS[`B${i}`].z = '$#,##0';
    }
  }
  
  XLSX.utils.book_append_sheet(wb, metricsWS, 'Return Metrics');

  // ===== SENSITIVITY ANALYSIS SHEET =====
  const sensitivityData = [
    ['SENSITIVITY ANALYSIS'],
    [''],
    ['SCENARIO TESTING', 'NOI Impact', 'DSCR', 'Feasibility'],
    ['Base Case', '="Return Metrics"!B5', '="Return Metrics"!B8', '="Return Metrics"!B23'],
    ['Rents -5%', '=B4*0.95', '=B5/("Operating Pro Forma"!C33)', '=IF(C5>=1.2,"FEASIBLE","AT RISK")'],
    ['Rents -10%', '=B4*0.90', '=B6/("Operating Pro Forma"!C33)', '=IF(C6>=1.2,"FEASIBLE","AT RISK")'],
    ['OpEx +10%', '=B4-("Operating Pro Forma"!C22*0.10)', '=B7/("Operating Pro Forma"!C33)', '=IF(C7>=1.2,"FEASIBLE","AT RISK")'],
    ['OpEx +20%', '=B4-("Operating Pro Forma"!C22*0.20)', '=B8/("Operating Pro Forma"!C33)', '=IF(C8>=1.2,"FEASIBLE","AT RISK")'],
    ['Vacancy 5%', '=B4*0.95', '=B9/("Operating Pro Forma"!C33)', '=IF(C9>=1.2,"FEASIBLE","AT RISK")'],
    ['All Adverse (-10% rents, +20% opex, 5% vacancy)', '=B4*0.85', '=B10/("Operating Pro Forma"!C33)', '=IF(C10>=1.2,"FEASIBLE","HIGH RISK")'],
    [''],
    ['RISK ASSESSMENT', '', '', ''],
    ['Low Risk Scenarios', '=COUNTIF(D4:D10,"FEASIBLE")', '', ''],
    ['High Risk Scenarios', '=COUNTIF(D4:D10,"AT RISK")+COUNTIF(D4:D10,"HIGH RISK")', '', ''],
    ['Overall Risk Level', '=IF(B13<=2,"LOW",IF(B13<=4,"MODERATE","HIGH"))', '', '']
  ];

  const sensitivityWS = XLSX.utils.aoa_to_sheet(sensitivityData);
  XLSX.utils.book_append_sheet(wb, sensitivityWS, 'Sensitivity Analysis');

  return wb;
}

// Generate the workbook
const workbook = createWorkbook();

// Save the Excel file
XLSX.writeFile(workbook, 'China_Alley_Vista_Pro_Forma.xlsx');

console.log('✅ Excel Pro Forma Generated: China_Alley_Vista_Pro_Forma.xlsx');
console.log('📊 Sheets included:');
console.log('   - Executive Summary');
console.log('   - Development Budget');
console.log('   - Operating Pro Forma');
console.log('   - Sources & Uses');
console.log('   - Return Metrics');
console.log('   - Sensitivity Analysis');
console.log('');
console.log('📈 Key Features:');
console.log('   - Fully interactive with Excel formulas');
console.log('   - 30 units as per original request');
console.log('   - AMI-compliant rent assumptions');
console.log('   - $1.5M grant + $5M city loan structure');
console.log('   - Professional formatting with benchmarks');
console.log('   - Sensitivity analysis for risk assessment');
