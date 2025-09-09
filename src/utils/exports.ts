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

// PDF Export
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
  yPosition = addText('Project: 30-unit mixed-use affordable housing development', margin, yPosition + 5, { lineHeight: 6 });
  yPosition = addText('Location: 935 China Alley / 943 F Street, Fresno, CA', margin, yPosition, { lineHeight: 6 });
  yPosition = addText('Total Development Cost: ' + formatCurrency(originalBudget.totalProjectCost), margin, yPosition, { lineHeight: 6 });
  
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
    'PROCEED WITH CONDITIONS - Significant funding gap and compliance issues identified' :
    'FEASIBLE WITH LIHTC - Project viable with tax credit equity';
  yPosition = addText(recommendation, margin, yPosition, { lineHeight: 6 });

  // Critical Issues
  pdf.setFont('helvetica', 'bold');
  yPosition = addText('CRITICAL ISSUES IDENTIFIED:', margin, yPosition + 10, { lineHeight: 8 });
  pdf.setFont('helvetica', 'normal');
  yPosition = addText('• Operating expenses understated by 84% ($28,300 vs $139,456)', margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('• Zero property management fee will fail underwriting', margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('• Studio rents exceed AMI caps by 45%', margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('• Unit count mismatch: 30 vs 32 units', margin + 5, yPosition, { lineHeight: 6 });

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
  yPosition = addText('Grant Funding: ' + formatCurrency(1250000), margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('City Soft Loan (5.5%, 3 years): ' + formatCurrency(1750000), margin + 5, yPosition, { lineHeight: 6 });
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
  yPosition = addText('Less: Vacancy (2.5%): (' + formatCurrency(results.vacancy) + ')', margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Less: Concessions: (' + formatCurrency(10020) + ')', margin + 5, yPosition, { lineHeight: 6 });
  yPosition = addText('Effective Gross Income: ' + formatCurrency(results.effectiveGrossIncome), margin + 5, yPosition, { lineHeight: 6 });

  pdf.setFont('helvetica', 'bold');
  yPosition = addText('OPERATING EXPENSES (CORRECTED):', margin, yPosition + 10, { lineHeight: 8 });
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

  // Save PDF
  pdf.save('China_Alley_Vista_Financial_Analysis.pdf');
};

// Excel Export
export const exportToExcel = (results: FinancialResults) => {
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ['CHINA ALLEY VISTA - FINANCIAL ANALYSIS'],
    ['Prepared by: Zachary Vorsteg'],
    ['Date: September 10, 2025'],
    [''],
    ['KEY METRICS', ''],
    ['Total Development Cost', originalBudget.totalProjectCost],
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
    ['TOTAL PROJECT COST', originalBudget.totalProjectCost]
  ];
  const budgetWS = XLSX.utils.aoa_to_sheet(budgetData);
  XLSX.utils.book_append_sheet(wb, budgetWS, 'Development Budget');

  // Operating Pro Forma Sheet
  const proformaData = [
    ['OPERATING PRO FORMA'],
    [''],
    ['INCOME', ''],
    ['Gross Potential Rent', results.grossPotentialRent],
    ['Less: Vacancy (2.5%)', -results.vacancy],
    ['Less: Concessions', -10020],
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
  
  // Add formulas to pro forma
  proformaWS['B8'] = { f: 'B4+B5+B6' }; // EGI formula
  proformaWS['B19'] = { f: 'B8+SUM(B10:B17)' }; // NOI formula
  proformaWS['B22'] = { f: 'B19+B20+B21' }; // Cash flow after debt
  
  XLSX.utils.book_append_sheet(wb, proformaWS, 'Operating Pro Forma');

  // Sources & Uses Sheet
  const sourcesUsesData = [
    ['SOURCES & USES OF FUNDS'],
    [''],
    ['SOURCES', 'Amount', '%'],
    ['Grant Funding', 1250000, 1250000 / originalBudget.totalProjectCost],
    ['City Soft Loan', 1750000, 1750000 / originalBudget.totalProjectCost],
    ['Max Supportable Debt', results.maxSupportableDebt, results.maxSupportableDebt / originalBudget.totalProjectCost],
    ['Total Sources', 1250000 + 1750000 + results.maxSupportableDebt, (1250000 + 1750000 + results.maxSupportableDebt) / originalBudget.totalProjectCost],
    [''],
    ['USES', 'Amount', '%'],
    ['Land Acquisition', originalBudget.landAcquisition.total, originalBudget.landAcquisition.total / originalBudget.totalProjectCost],
    ['Hard Costs', preFabEstimate.projectTotal, preFabEstimate.projectTotal / originalBudget.totalProjectCost],
    ['Soft Costs', originalBudget.softCosts.total, originalBudget.softCosts.total / originalBudget.totalProjectCost],
    ['Financing Costs', originalBudget.financing.total, originalBudget.financing.total / originalBudget.totalProjectCost],
    ['Total Uses', originalBudget.totalProjectCost, 1],
    [''],
    ['FUNDING GAP', results.fundingGap, results.fundingGap / originalBudget.totalProjectCost]
  ];
  const sourcesUsesWS = XLSX.utils.aoa_to_sheet(sourcesUsesData);
  XLSX.utils.book_append_sheet(wb, sourcesUsesWS, 'Sources & Uses');

  // Return Metrics Sheet
  const metricsData = [
    ['RETURN METRICS ANALYSIS'],
    [''],
    ['Metric', 'Value', 'Benchmark', 'Status'],
    ['Cap Rate', results.capRate / 100, 0.055, results.capRate >= 5.5 ? 'PASS' : 'FAIL'],
    ['DSCR', results.dscr, 1.35, results.dscr >= 1.35 ? 'PASS' : results.dscr >= 1.20 ? 'MARGINAL' : 'FAIL'],
    ['Debt Yield', results.debtYield / 100, 0.10, results.debtYield >= 10 ? 'PASS' : 'FAIL'],
    ['LTV', results.ltv / 100, 0.75, results.ltv <= 75 ? 'PASS' : 'MARGINAL'],
    [''],
    ['CASH FLOW ANALYSIS', ''],
    ['NOI', results.netOperatingIncome],
    ['Annual Debt Service', results.annualDebtService],
    ['Cash Flow After Debt', results.cashFlowAfterDebt],
    [''],
    ['INVESTMENT SUMMARY', ''],
    ['Total Development Cost', originalBudget.totalProjectCost],
    ['Max Supportable Debt', results.maxSupportableDebt],
    ['Required Equity/Gap', results.fundingGap]
  ];
  const metricsWS = XLSX.utils.aoa_to_sheet(metricsData);
  XLSX.utils.book_append_sheet(wb, metricsWS, 'Return Metrics');

  // Save Excel file
  XLSX.writeFile(wb, 'China_Alley_Vista_Financial_Model.xlsx');
};
