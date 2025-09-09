# China Alley Vista Financial Analysis Platform

A comprehensive financial analysis platform for the China Alley Vista affordable housing development project in Fresno, CA. Built with Next.js, TypeScript, and Tailwind CSS.

## Project Overview

**Location**: 935 China Alley / 943 F Street, Fresno, CA 93706  
**Development**: 30-unit mixed-use affordable housing project  
**Building**: 7,500 sq ft ground-floor commercial + 4 floors residential  
**Total Development Cost**: $6,361,829  
**Prepared by**: Zachary Vorsteg  
**Date**: September 10, 2025  

## Key Features

### 📊 Interactive Financial Analysis
- Real-time calculation of all financial metrics
- Multiple scenario analysis (Fantasy vs Reality vs Conservative)
- Comprehensive sensitivity analysis
- Live DSCR, NOI, and funding gap calculations

### 🚨 Critical Issue Detection
- Automated compliance checking
- Operating expense validation
- Rent compliance monitoring
- Unit count reconciliation

### 📈 Professional Reporting
- Interactive dashboard with tabbed interface
- PDF export for executive summary
- Excel export with formulas intact
- Mobile-responsive design

### 🏗️ Comprehensive Data Coverage
- **Exhibit E**: Official 30-unit breakdown by AMI levels
- **PreFab Estimate**: $5.49M construction cost breakdown
- **Original Budget**: $6.36M total development cost
- **Corrected Analysis**: Market-reality operating expenses

## Critical Findings

### ⚠️ Major Issues Identified
1. **Operating Expenses Understated by 84%** - Original $28,300 vs. realistic $139,456
2. **Zero Property Management Fee** - Will fail institutional underwriting
3. **Rent Compliance Violations** - Studios at $1,050 exceed $723 AMI limit
4. **Unit Count Mismatch** - 30 units (Exhibit E) vs 32 units (proforma)

### 💰 Financial Impact
- **Funding Gap**: $1,931,829 (not $1,361,829 as originally calculated)
- **DSCR**: 1.28x (marginal, close to 1.20x minimum)
- **Max Supportable Debt**: $1,430,000 (not $2,000,000)
- **Return on Cost**: 3.4% (below 5% minimum target)

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Exports**: jsPDF, html2canvas, xlsx
- **Deployment**: Netlify (static export)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ZacharyVorsteg/CHINA-ALLEY-VISTA.git
cd china-alley-vista

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
│   ├── MetricCard.tsx     # Reusable metric display
│   ├── CriticalAlerts.tsx # Alert banner component
│   ├── TabNavigation.tsx  # Tab interface
│   └── tabs/              # Individual tab components
├── data/
│   └── projectData.ts     # All source data and constants
├── utils/
│   ├── calculations.ts    # Financial calculation logic
│   └── exports.ts         # PDF/Excel export functions
└── types/                 # TypeScript type definitions
```

## Data Sources

### Exhibit E (Official Compliance Document)
- 30 total units (29 restricted + 1 manager)
- AMI breakdown: 50%, 40%, 30% levels
- Unit mix: Studios, 1BR, 2BR, 3BR

### PreFab Innovations Construction Estimate
- Site work: $812,653
- Residential (4 floors): $4,228,560  
- Commercial build-out: $450,500
- **Total**: $5,491,713

### Original Budget Analysis
- Land acquisition: $72,500
- Hard costs: $5,963,212 (contains errors)
- Soft costs: $269,618
- Financing: $56,500
- **Total**: $6,361,829

## Key Calculations

### Net Operating Income (Corrected)
```typescript
const egi = grossRent * (1 - vacancyRate) - concessions;
const propertyMgmt = egi * 0.04; // 4% mandatory
const totalOpEx = propertyMgmt + repairsMaint + insurance + utilities + taxes + other;
const noi = egi - totalOpEx; // $214,929
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
const availableFunding = grantFunding + cityLoan + maxSupportableDebt;
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
No environment variables required - all data is embedded in the application for demonstration purposes.

## Recommendations

### Immediate Actions Required
1. **Secure 4% LIHTC allocation** (~$1.2M equity)
2. **Correct operating expense budget** to $139,456 annually
3. **Resolve unit count discrepancy** (30 vs 32 units)
4. **Adjust studio rents** to AMI-compliant $723/month

### Feasibility Conclusion
**PROCEED WITH CONDITIONS** - Project requires significant gap funding and compliance corrections, but is viable with LIHTC equity and realistic underwriting.

## License

This project was created for Zachary Vorsteg's first Upwork client engagement. All financial data is based on actual project documents provided by the client.

---

**Contact**: Zachary Vorsteg  
**Date**: September 10, 2025  
**Client**: Ben Driecer / PreFab Innovations