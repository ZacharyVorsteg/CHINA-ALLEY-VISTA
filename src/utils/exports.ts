// Export utilities for PDF and Excel generation
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { 
  formatCurrency, 
  formatPercentage, 
  formatRatio,
  type FinancialResults 
} from './calculations';
import { originalBudget, preFabEstimate, correctedOperatingExpenses } from '@/data/projectData';
import { CONFIG, totalUnits } from '@/data/config';

// PDF Export with improved professional tone
export const exportToPDF = async (results: FinancialResults) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with line breaks
  const addText = (text: string, x: number, y: number, options: { align?: 'center' | 'left' | 'right' | 'justify'; lineHeight?: number } = {}) => {
    pdf.text(text, x, y, options);
    return y + (options.lineHeight || 7);
  };

  // Cover Page
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('CHINA ALLEY VISTA', pageWidth / 2, yPosition + 30, { 
    align: 'center', 
    lineHeight: 12 
  });
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  yPosition = addText('Financial Feasibility Analysis', pageWidth / 2, yPosition + 10, { 
    align: 'center', 
    lineHeight: 8 
  });
  
  pdf.setFontSize(12);
  yPosition = addText('Prepared by: Zachary Vorsteg', pageWidth / 2, yPosition + 20, { 
    align: 'center', 
    lineHeight: 8 
  });
  yPosition = addText('Date: September 10, 2025', pageWidth / 2, yPosition, { 
    align: 'center', 
    lineHeight: 8 
  });
  yPosition = addText('Client: Ben Driecer / PreFab Innovations', pageWidth / 2, yPosition, { 
    align: 'center', 
    lineHeight: 8 
  });

  // Executive Summary
  pdf.addPage();
  yPosition = margin;
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('EXECUTIVE SUMMARY', margin, yPosition, { lineHeight: 10 });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  yPosition = addText(`Project: ${totalUnits}-unit mixed-use affordable housing development`, margin, yPosition + 5, { lineHeight: 6 });
  yPosition = addText(`Location: ${CONFIG.project.address}`, margin, yPosition, { lineHeight: 6 });
  yPosition = addText('Total Development Cost: ' + formatCurrency(CONFIG.project.totalDevelopmentCost), margin, yPosition, { lineHeight: 6 });
  
  // Key Metrics
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('KEY FINANCIAL METRICS:', margin, yPosition + 10, { lineHeight: 8 });
  pdf.setFont('helvetica', 'normal');
  yPosition = addText('• Net Operating Income: ' + formatCurrency(results.netOperatingIncome), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('• Debt Service Coverage Ratio: ' + formatRatio(results.dscr), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('• Cap Rate / Return on Cost: ' + formatPercentage(results.capRate), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('• Maximum Supportable Debt: ' + formatCurrency(results.maxSupportableDebt), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('• Funding Gap: ' + formatCurrency(results.fundingGap), margin + 5, yPosition, { lineHeight: 6 });

  // Recommendation
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('RECOMMENDATION:', margin, yPosition + 10, { lineHeight: 8 });
  pdf.setFont('helvetica', 'normal');
  const recommendation = results.fundingGap > 2000000 || results.dscr < 1.20 ? 
    'PROCEED WITH CONDITIONS - Additional funding sources and expense corrections required' :
    'FEASIBLE WITH LIHTC - Project viable with tax credit equity';
  yPosition = addText(recommendation, margin, yPosition, { lineHeight: 6 });

  // Critical Issues
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('ISSUES REQUIRING ATTENTION:', margin, yPosition + 10, { lineHeight: 8 });
  pdf.setFont('helvetica', 'normal');
  yPosition = addText('• Operating expenses require correction to industry standards', margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('• Property management fee must be included for lender approval', margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('• Studio rents exceed AMI compliance limits', margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('• Unit count reconciliation needed between plans', margin + 5, yPosition, { lineHeight: 6 });

  // Development Budget Page
  pdf.addPage();
  yPosition = margin;
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('DEVELOPMENT BUDGET', margin, yPosition, { lineHeight: 10 });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('SOURCES OF FUNDS:', margin, yPosition + 5, { lineHeight: 8 });
  pdf.setFont('helvetica', 'normal');
  yPosition = addText('Grant Funding: ' + formatCurrency(CONFIG.sources.grant), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('HOME Funds: ' + formatCurrency(CONFIG.sources.homeFunds), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Sponsor Equity: ' + formatCurrency(CONFIG.sources.equity), margin + 5, yPosition, { lineHeight: 6 });
  if (CONFIG.sources.cityLoan.amount > 0) {
    yPosition = addText(`City Soft Loan (${(CONFIG.sources.cityLoan.rate * 100).toFixed(1)}%, ${CONFIG.sources.cityLoan.termYears} years): ` + formatCurrency(CONFIG.sources.cityLoan.amount), margin + 5, yPosition, { lineHeight: 6 });
  }
  yPosition = addText('Max Supportable Debt: ' + formatCurrency(results.maxSupportableDebt), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('FUNDING GAP: ' + formatCurrency(results.fundingGap), margin + 5, yPosition, { lineHeight: 6 });

  pdf.setFont('helvetica', 'bold');
  yPosition = addText('USES OF FUNDS:', margin, yPosition + 10, { lineHeight: 8 });
  pdf.setFont('helvetica', 'normal');
  yPosition = addText('Land Acquisition: ' + formatCurrency(originalBudget.landAcquisition.total), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Hard Costs: ' + formatCurrency(preFabEstimate.projectTotal), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Soft Costs: ' + formatCurrency(originalBudget.softCosts.total), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Financing Costs: ' + formatCurrency(originalBudget.financing.total), margin + 5, yPosition, { lineHeight: 6 });

  // Operating Pro Forma Page
  pdf.addPage();
  yPosition = margin;
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('OPERATING PRO FORMA', margin, yPosition, { lineHeight: 10 });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('INCOME:', margin, yPosition + 5, { lineHeight: 8 });
  pdf.setFont('helvetica', 'normal');
  yPosition = addText('Gross Potential Rent: ' + formatCurrency(results.grossPotentialRent), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText(`Less: Vacancy (${formatPercentage(CONFIG.VACANCY_RATE * 100)}): (` + formatCurrency(results.vacancy) + ')', margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Less: Concessions: (' + formatCurrency(CONFIG.project.concessions) + ')', margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Effective Gross Income: ' + formatCurrency(results.effectiveGrossIncome), margin + 5, yPosition, { lineHeight: 6 });

  pdf.setFont('helvetica', 'bold');
  yPosition = addText('OPERATING EXPENSES (INDUSTRY STANDARDS):', margin, yPosition + 10, { lineHeight: 8 });
  pdf.setFont('helvetica', 'normal');
  yPosition = addText('Property Management (4% EGI): ' + formatCurrency(correctedOperatingExpenses.propertyManagement(results.effectiveGrossIncome)), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Repairs & Maintenance: ' + formatCurrency(correctedOperatingExpenses.repairsMaintenance), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Insurance: ' + formatCurrency(correctedOperatingExpenses.insurance), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Utilities (Common): ' + formatCurrency(correctedOperatingExpenses.utilitiesCommon), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Real Estate Taxes: ' + formatCurrency(correctedOperatingExpenses.realEstateTaxes), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Other: ' + formatCurrency(correctedOperatingExpenses.adminMarketing + correctedOperatingExpenses.trashLandscaping), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Total Operating Expenses: ' + formatCurrency(results.operatingExpenses), margin + 5, yPosition, { lineHeight: 6 });

  pdf.setFont('helvetica', 'bold');
  yPosition = addText('NET OPERATING INCOME: ' + formatCurrency(results.netOperatingIncome), margin, yPosition + 10, { lineHeight: 8 });

  // Methodology & Sources Page
  pdf.addPage();
  yPosition = margin;
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('METHODOLOGY & SOURCES', margin, yPosition, { lineHeight: 10 });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('KEY ASSUMPTIONS:', margin, yPosition + 5, { lineHeight: 8 });
  pdf.setFont('helvetica', 'normal');
  yPosition = addText(`• Property Tax: ${CONFIG.methodology.propertyTaxBasis}`, margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText(`• Management Fee: ${CONFIG.methodology.managementFeeBasis}`, margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText(`• Reserves: ${CONFIG.methodology.reservesBasis}`, margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText(`• Vacancy: ${CONFIG.methodology.vacancyBasis}`, margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText(`• AMI Limits: ${CONFIG.methodology.amiTableYear}`, margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText(`• Fair Market Rents: ${CONFIG.methodology.fmrTableYear}`, margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText(`• Operating Benchmarks: ${CONFIG.methodology.opexBenchmarks}`, margin + 5, yPosition, { lineHeight: 6 });

  // Save PDF
  pdf.save('China_Alley_Vista_Financial_Analysis.pdf');
};

// Excel Export with corrected formulas
export const exportToExcel = (results: FinancialResults) => {
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ['CHINA ALLEY VISTA - FINANCIAL ANALYSIS'],
    ['Prepared by: Zachary Vorsteg'],
    ['Date: September 10, 2025'],
    [''],
    ['KEY METRICS', ''],
    ['Total Development Cost', CONFIG.project.totalDevelopmentCost],
    ['Total Units', totalUnits],
    ['Cost Per Unit', results.costPerUnit],
    ['Net Operating Income', results.netOperatingIncome],
    ['Debt Service Coverage Ratio', results.dscr],
    ['Cap Rate', results.capRate / 100],
    ['Max Supportable Debt', results.maxSupportableDebt],
    ['Funding Gap', results.fundingGap],
    [''],
    ['RECOMMENDATION', results.fundingGap > 2000000 || results.dscr < 1.20 ? 'PROCEED WITH CONDITIONS' : 'FEASIBLE']
  ];
  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary');

  // Development Budget Sheet
  const budgetData = [
    ['DEVELOPMENT BUDGET'],
    [''],
    ['LAND ACQUISITION', ''],
    ['Purchase Price', originalBudget.landAcquisition.purchasePrice],
    ['Recording Fees', originalBudget.landAcquisition.recordingFees],
    ['Legal Fees', originalBudget.landAcquisition.legalFees],
    ['Due Diligence', originalBudget.landAcquisition.developerDueDiligence],
    ['Title Insurance', originalBudget.landAcquisition.titleInsurance],
    ['Land Total', originalBudget.landAcquisition.total],
    [''],
    ['HARD COSTS', ''],
    ['Site Work', preFabEstimate.siteWork.siteWorkTotal],
    ['Residential (4 floors)', preFabEstimate.residentialPerFloor.totalResidential],
    ['Commercial Build-out', preFabEstimate.commercial.cost],
    ['Hard Costs Total', preFabEstimate.projectTotal],
    [''],
    ['SOFT COSTS', ''],
    ['Architectural Fees', originalBudget.softCosts.architecturalFees],
    ['Engineering & Permits', originalBudget.softCosts.civilEngineering + originalBudget.softCosts.buildingPermit],
    ['Legal & Professional', originalBudget.softCosts.legalConstruction],
    ['Insurance', originalBudget.softCosts.generalLiability],
    ['Other Soft Costs', originalBudget.softCosts.total - originalBudget.softCosts.architecturalFees - originalBudget.softCosts.civilEngineering - originalBudget.softCosts.buildingPermit - originalBudget.softCosts.legalConstruction - originalBudget.softCosts.generalLiability],
    ['Soft Costs Total', originalBudget.softCosts.total],
    [''],
    ['TOTAL PROJECT COST', CONFIG.project.totalDevelopmentCost]
  ];
  const budgetWS = XLSX.utils.aoa_to_sheet(budgetData);
  XLSX.utils.book_append_sheet(wb, budgetWS, 'Development Budget');

  // Operating Pro Forma Sheet with corrected formulas
  const proformaData = [
    ['OPERATING PRO FORMA'],
    [''],
    ['INCOME', ''],
    ['Gross Potential Rent', results.grossPotentialRent],
    ['Vacancy Rate', CONFIG.VACANCY_RATE],
    ['Concessions', CONFIG.project.concessions],
    ['Less: Vacancy', -results.vacancy],
    ['Less: Concessions', -CONFIG.project.concessions],
    ['Effective Gross Income', results.effectiveGrossIncome],
    [''],
    ['OPERATING EXPENSES', ''],
    ['Property Management (4%)', -correctedOperatingExpenses.propertyManagement(results.effectiveGrossIncome)],
    ['Repairs & Maintenance', -correctedOperatingExpenses.repairsMaintenance],
    ['Insurance', -correctedOperatingExpenses.insurance],
    ['Utilities (Common)', -correctedOperatingExpenses.utilitiesCommon],
    ['Real Estate Taxes', -correctedOperatingExpenses.realEstateTaxes],
    ['Administrative', -correctedOperatingExpenses.adminMarketing],
    ['Landscaping & Trash', -correctedOperatingExpenses.trashLandscaping],
    ['Total Operating Expenses', -results.operatingExpenses],
    [''],
    ['NET OPERATING INCOME', results.netOperatingIncome],
    ['Less: Reserves', -results.reserves],
    ['Cash Flow Before Debt', results.cashFlowBeforeDebt],
    ['Less: Annual Debt Service', -results.annualDebtService],
    ['Cash Flow After Debt', results.cashFlowAfterDebt]
  ];
  const proformaWS = XLSX.utils.aoa_to_sheet(proformaData);
  
  // Add corrected formulas
  proformaWS['B9'] = { f: 'B4*(1-B5)-B6' }; // EGI = GPR * (1-vacancy) - concessions
  proformaWS['B21'] = { f: 'B9+SUM(B12:B19)' }; // NOI = EGI - Operating Expenses (sum is negative)
  proformaWS['B25'] = { f: 'B21-B22-B24' }; // Cash flow after debt = NOI - Reserves - Debt Service
  
  XLSX.utils.book_append_sheet(wb, proformaWS, 'Operating Pro Forma');

  // Sources & Uses Sheet
  const sourcesUsesData = [
    ['SOURCES & USES OF FUNDS'],
    [''],
    ['SOURCES', 'Amount', '%'],
    ['Grant Funding', CONFIG.sources.grant, CONFIG.sources.grant / CONFIG.project.totalDevelopmentCost],
    ['HOME Funds', CONFIG.sources.homeFunds, CONFIG.sources.homeFunds / CONFIG.project.totalDevelopmentCost],
    ['Sponsor Equity', CONFIG.sources.equity, CONFIG.sources.equity / CONFIG.project.totalDevelopmentCost],
    ['Max Supportable Debt', results.maxSupportableDebt, results.maxSupportableDebt / CONFIG.project.totalDevelopmentCost],
    ['Total Sources', CONFIG.sources.grant + CONFIG.sources.homeFunds + CONFIG.sources.equity + results.maxSupportableDebt, (CONFIG.sources.grant + CONFIG.sources.homeFunds + CONFIG.sources.equity + results.maxSupportableDebt) / CONFIG.project.totalDevelopmentCost],
    [''],
    ['USES', 'Amount', '%'],
    ['Land Acquisition', originalBudget.landAcquisition.total, originalBudget.landAcquisition.total / CONFIG.project.totalDevelopmentCost],
    ['Hard Costs', preFabEstimate.projectTotal, preFabEstimate.projectTotal / CONFIG.project.totalDevelopmentCost],
    ['Soft Costs', originalBudget.softCosts.total, originalBudget.softCosts.total / CONFIG.project.totalDevelopmentCost],
    ['Financing Costs', originalBudget.financing.total, originalBudget.financing.total / CONFIG.project.totalDevelopmentCost],
    ['Total Uses', CONFIG.project.totalDevelopmentCost, 1],
    [''],
    ['FUNDING GAP', results.fundingGap, results.fundingGap / CONFIG.project.totalDevelopmentCost]
  ];
  const sourcesUsesWS = XLSX.utils.aoa_to_sheet(sourcesUsesData);
  
  // Format percentage columns
  for (let i = 4; i <= 17; i++) {
    if (sourcesUsesWS[`C${i}`]) {
      sourcesUsesWS[`C${i}`].z = '0.0%';
    }
  }
  
  XLSX.utils.book_append_sheet(wb, sourcesUsesWS, 'Sources & Uses');

  // Return Metrics Sheet
  const metricsData = [
    ['RETURN METRICS ANALYSIS'],
    [''],
    ['Metric', 'Value', 'Benchmark', 'Status'],
    ['Cap Rate', results.capRate / 100, 0.055, results.capRate >= 5.5 ? 'PASS' : 'NEEDS IMPROVEMENT'],
    ['DSCR', results.dscr, 1.35, results.dscr >= 1.35 ? 'PASS' : results.dscr >= 1.20 ? 'MARGINAL' : 'REQUIRES ATTENTION'],
    ['Debt Yield', results.debtYield / 100, 0.10, results.debtYield >= 10 ? 'PASS' : 'NEEDS IMPROVEMENT'],
    ['LTV', results.ltv / 100, 0.75, results.ltv <= 75 ? 'PASS' : 'MARGINAL'],
    [''],
    ['CASH FLOW ANALYSIS', ''],
    ['NOI', results.netOperatingIncome],
    ['Annual Debt Service', results.annualDebtService],
    ['Cash Flow After Debt', results.cashFlowAfterDebt],
    [''],
    ['INVESTMENT SUMMARY', ''],
    ['Total Development Cost', CONFIG.project.totalDevelopmentCost],
    ['Max Supportable Debt', results.maxSupportableDebt],
    ['Required Additional Funding', results.fundingGap]
  ];
  const metricsWS = XLSX.utils.aoa_to_sheet(metricsData);
  XLSX.utils.book_append_sheet(wb, metricsWS, 'Return Metrics');

  // Save Excel file
  XLSX.writeFile(wb, 'China_Alley_Vista_Financial_Model.xlsx');
};