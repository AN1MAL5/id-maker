# Quick Start Guide

Get started with the AAMVA ID Maker in minutes!

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd id-maker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Basic Usage

### Generate a Sample ID

Generate a sample driver's license with default data:

```bash
npm run start
```

This creates `generated-id.json` with a complete AAMVA-compliant ID document.

### Command Line Options

```bash
# Generate different document types
npm run generate:dl     # Driver License (horizontal)
npm run generate:id     # ID Card (horizontal)
npm run generate:vertical # Under-21 format (vertical)

# Interactive mode
npm run interactive

# Validation only
npm run validate
```

### Custom Data

Create your own ID data:

```javascript
const { IDMakerApp } = require('./src/main');

const customData = {
  familyName: 'JOHNSON',
  givenNames: 'MICHAEL DAVID',
  dateOfBirth: '05/15/1990',
  dateOfIssue: '09/26/2025',
  dateOfExpiry: '05/15/2030',
  customerIdentifier: 'J123456789012345',
  documentDiscriminator: '2025092654321',
  address: '456 OAK STREET, SPRINGFIELD, IL 62701',
  vehicleClassifications: 'D',
  endorsements: 'NONE',
  restrictions: 'A', // Corrective lenses
  sex: 'M',
  height: '6\'-02\"',
  eyeColor: 'GRN',
  compliance: { realId: true }
};

const app = new IDMakerApp({
  template: 'dl',
  format: 'horizontal',
  output: 'my-id.json'
});

app.init().then(() => app.generate(customData));
```

## Key Features

✅ **AAMVA 2025 v1.0 Compliant** - Full standard implementation  
✅ **PDF417 Barcodes** - Mandatory 2D barcode generation  
✅ **Zone-Based Layout** - Professional 5-zone card design  
✅ **Data Validation** - Comprehensive AAMVA rules checking  
✅ **Multiple Formats** - Horizontal (21+) and vertical (under 21)  
✅ **REAL ID Support** - Compliance indicators and requirements  

## Output Structure

The ID Maker generates a comprehensive JSON structure:

```json
{
  "humanReadable": {
    "zoneI": { "documentType": "DRIVER LICENSE", ... },
    "zoneII": { "familyName": "SMITH", ... },
    "zoneIII": { "portrait": "[PORTRAIT]", ... },
    "zoneIV": { "codeExplanations": [...] }
  },
  "machineReadable": {
    "zoneV": { "pdf417": { "data": "@\n...", ... } }
  },
  "layout": { "format": "horizontal", "zones": {...} },
  "compliance": { "aamvaCompliant": true, ... }
}
```

## Next Steps

- 📖 **Documentation**: Check `/docs` for detailed guides
- 🧪 **Examples**: Run `node examples/basic-usage.js` for demos  
- 🔧 **Customization**: Modify templates in `/templates`
- ✅ **Validation**: Use built-in data validation tools

## Need Help?

- **Data Elements**: See `docs/data-elements.md`
- **Layout System**: See `docs/layout-zones.md` 
- **Examples**: Check `examples/basic-usage.js`
- **API Reference**: See individual module documentation

Happy ID making! 🆔✨