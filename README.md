# China Alley Vista Financial Analysis Platform

A comprehensive financial analysis platform for the China Alley Vista affordable housing development project in Fresno, CA. Built with Next.js, TypeScript, and Tailwind CSS.

## Project Overview

**Location**: 943 F Street, Fresno, CA 93721 (also referenced as 935 China Alley, Fresno, CA 93706)  
**Development**: 32-unit factory-built mixed-use affordable housing project  
**Building**: 7,500 sq ft ground-floor commercial + 4 floors residential  
**Unit Count**: 32 planned factory-built units (Exhibit E shows 30 restricted units; see reconciliation below)  
**Total Development Cost**: $6,361,829  
**Prepared by**: Zachary Vorsteg  
**Date**: September 10, 2025  

## Key Features

### 📊 Interactive Financial Analysis
- Real-time calculation of all financial metrics
- Multiple scenario analysis (As Submitted vs Market Reality vs Conservative vs LIHTC)
- Comprehensive sensitivity analysis with 10+ stress test scenarios
- Live DSCR, NOI, and funding gap calculations

### 🚨 Critical Issue Detection
- Automated compliance checking with professional recommendations
- Operating expense validation against industry benchmarks
- Rent compliance monitoring for AMI limits
- Unit count reconciliation between documents

### 📈 Professional Reporting
- Interactive dashboard with 6-tab interface
- PDF export with executive summary and methodology
- Excel export with working formulas and audit trails
- Mobile-responsive design optimized for all devices

### 🏗️ Comprehensive Data Coverage
- **Exhibit E**: Official 30-unit breakdown by AMI levels (29 restricted + 1 manager)
- **Building Plans**: 32-unit factory-built design (8 units × 4 floors)
- **PreFab Estimate**: $5.49M construction cost breakdown with site work
- **Corrected Analysis**: Market-reality operating expenses and debt sizing

## Critical Findings

### ⚠️ Issues Requiring Attention
1. **Operating Expenses Require Correction** - Submitted $28,300 vs. industry standard $139,456
2. **Property Management Fee Missing** - Required 4% of EGI for lender approval
3. **Rent Compliance Issues** - Studio units at $1,050 exceed 50% AMI limit of $723
4. **Unit Count Reconciliation** - 30 units (Exhibit E) vs 32 units (building plans)

### 💰 Financial Impact
- **Corrected NOI**: $214,929 (vs $362,480 as submitted)
- **DSCR**: 1.28x (marginal, above 1.20x minimum requirement)
- **Max Supportable Debt**: $1,430,000 (vs $2,000,000 assumed)
- **Funding Gap**: $1,931,829 (requires additional sources)
- **Return on Cost**: 3.4% (below 6-8% industry target)

## Methodology & Sources

### Key Assumptions
- **Property Tax**: 1% of Total Development Cost (Fresno County average)
- **Management Fee**: 4% of Effective Gross Income (industry standard)
- **Reserves**: $300 per unit annually (replacement reserve standard)
- **Vacancy**: 2.5% (affordable housing market average)
- **AMI Limits**: FY 2021 HUD Income Limits for Fresno County
- **Fair Market Rents**: FY 2021 HUD Fair Market Rents
- **Operating Benchmarks**: Industry standards - R&M $500/unit, Insurance $300/unit, Utilities $450/unit

### Data Sources
- Exhibit E compliance document (official unit mix)
- PreFab Innovations construction estimate
- Original development budget and pro forma
- HUD income limits and fair market rent tables
- Industry operating expense benchmarks

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with improved contrast ratios
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography
- **Exports**: jsPDF for reports, xlsx for Excel models
- **Deployment**: Netlify with static export optimization

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ZacharyVorsteg/CHINA-ALLEY-VISTA.git
cd CHINA-ALLEY-VISTA

# Install dependencies
npm install

# Run development server
npm run dev
```

### Build for Production
```bash
# Build static export for Netlify
npm run build

# The `out` directory contains the static files
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/            
│   ├── Dashboard.tsx       # Main dashboard component
│   ├── MetricCard.tsx     # Reusable metric display cards
│   ├── CriticalAlerts.tsx # Alert banner component
│   ├── TabNavigation.tsx  # Tab interface navigation
│   └── tabs/              # Individual tab components
├── data/
│   ├── config.ts          # Configuration constants and assumptions
│   └── projectData.ts     # All source data and calculations
├── utils/
│   ├── calculations.ts    # Financial calculation logic
│   └── exports.ts         # PDF/Excel export functions
└── types/                 # TypeScript type definitions
```

## Unit Count Reconciliation

The project shows a discrepancy that requires resolution:

- **Exhibit E (Compliance)**: 30 total units (29 restricted + 1 manager unit)
- **Building Plans**: 32 units (8 units per floor × 4 floors)
- **Financial Model**: Currently uses 32-unit basis for calculations

**Recommendation**: Either add 2 market-rate units to Exhibit E compliance documentation, or reduce building design to 30 units to match affordability requirements.

## Key Calculations

### Net Operating Income (Corrected)
```typescript
const egi = grossRent * (1 - vacancyRate) - concessions;
const propertyMgmt = egi * 0.04; // 4% mandatory for lender approval
const totalOpEx = propertyMgmt + repairsMaint + insurance + utilities + taxes + other;
const noi = egi - totalOpEx; // $214,929 with corrections
```

### Maximum Supportable Debt
```typescript
const annualDebtService = noi / dscrRequired; // 1.20x minimum
const monthlyPayment = annualDebtService / 12;
const maxLoan = pv(monthlyPayment, rate, years); // $1,430,000
```

### Funding Gap Analysis
```typescript
const totalCost = 6361829;
const availableFunding = grantFunding + homeFunds + equity + maxSupportableDebt;
const gap = totalCost - availableFunding; // $1,931,829
```

## Deployment

### Netlify Configuration
The project is configured for static export and optimized for Netlify deployment:

```javascript
// next.config.js
module.exports = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
};
```

### Environment Setup
No environment variables required - all data is embedded in the application with clear source attribution.

## Professional Recommendations

### Immediate Actions Required
1. **Apply for 4% LIHTC allocation** - Could generate ~$1.2M in equity
2. **Correct operating expense budget** to $139,456 annually with 4% management fee
3. **Resolve unit count discrepancy** between Exhibit E and building plans
4. **Adjust studio rents** to AMI-compliant $723/month maximum

### Feasibility Conclusion
**PROCEED WITH CONDITIONS** - Project requires additional funding sources and compliance corrections, but demonstrates acceptable debt coverage (1.28x DSCR) with realistic underwriting assumptions.

### Restructured Deal Potential
With 4% LIHTC equity:
- Reduced funding gap to ~$700K
- Enhanced cash-on-cash returns
- Improved project feasibility
- Acceptable risk-adjusted returns

## Export Features

### PDF Report Includes
- Executive summary with key findings
- Development budget analysis
- Operating pro forma with corrections
- Sources and uses of funds
- Methodology and assumptions

### Excel Model Features
- Interactive scenarios with working formulas
- Audit trails for all calculations
- Sensitivity analysis tables
- Professional formatting with percentage displays

## License

This project was created for Zachary Vorsteg's professional real estate analysis practice. All financial data is based on actual project documents with client permission.

---

**Contact**: Zachary Vorsteg  
**Date**: September 10, 2025  
**Client**: Ben Driecer / PreFab Innovations  
**Repository**: https://github.com/ZacharyVorsteg/CHINA-ALLEY-VISTA