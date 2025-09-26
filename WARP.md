# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an **AAMVA-Compliant ID Maker** that generates standardized identification documents following the AAMVA (American Association of Motor Vehicle Administrators) DL/ID Card Design Standard 2025 v1.0. The project implements the complete AAMVA specification including human-readable data elements, PDF417 2D barcode generation, zone-based layout systems, and comprehensive data validation.

## Core Architecture

The codebase follows a modular architecture with clear separation of concerns:

### Main Components

- **`src/main.js`** - Entry point and CLI application orchestrator
- **`src/core/id-generator.js`** - Core document compilation and AAMVA zone generation (I-V)
- **`src/data/validator.js`** - Comprehensive data validation against AAMVA standards
- **`src/layout/layout-manager.js`** - Zone-based layout system (horizontal/vertical formats)
- **`src/barcode/pdf417.js`** - PDF417 2D barcode generation with AAMVA encoding

### Key Data Flow

1. **Input Validation** → DataValidator validates against mandatory/optional AAMVA elements
2. **Layout Generation** → LayoutManager creates zone-based card layouts (5 zones)
3. **Barcode Generation** → PDF417Generator encodes data per AAMVA Annex D specifications  
4. **Document Compilation** → IDGenerator combines all components into final AAMVA-compliant document

### AAMVA Zone System

The layout follows a strict 5-zone system:
- **Zone I**: Document type and jurisdiction (header)
- **Zone II**: Personal and document information (left/top area)
- **Zone III**: Portrait and signature (right/center area)
- **Zone IV**: Code explanations (non-portrait side)
- **Zone V**: Machine-readable technology (PDF417 barcode)

## Development Commands

### Core Commands
```bash
# Install dependencies
npm install

# Generate sample ID with default data
npm start
# or
node src/main.js

# Run comprehensive examples
node examples/basic-usage.js
```

### Document Generation
```bash
# Generate different document types
npm run generate:dl          # Driver License (horizontal format)
npm run generate:id          # ID Card (horizontal format)  
npm run generate:vertical    # Under-21 format (vertical)

# Interactive data entry mode
npm run interactive

# Validation-only mode (no generation)
npm run validate
```

### Testing & Quality
```bash
# Run test suite
npm test

# Watch mode for development
npm run test:watch

# Generate coverage reports
npm run test:coverage

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Specific Use Cases
```bash
# Generate with custom output path
node src/main.js --output my-custom-id.json

# Use configuration file
node src/main.js --config ./config/custom-config.json

# Preview mode (no full processing)
node src/main.js --preview

# Validate specific data
node src/main.js --validate-only --config ./data/sample-data.json
```

## AAMVA Compliance Requirements

When working with this codebase, understand these critical compliance aspects:

### Mandatory Data Elements
All generated IDs must include these AAMVA Table 1 fields:
- Family Name, Given Names, Date of Birth, Sex, Height, Eye Color
- Date of Issue/Expiry, Customer Identifier, Document Discriminator
- Address, Vehicle Classifications, Endorsements, Restrictions

### Data Format Standards
- **Dates**: MM/DD/CCYY format (US standard)
- **Height**: Feet/inches format (`5'-10"`) or metric (`178 cm`)
- **Colors**: AAMVA standard codes (BRO, BLU, GRN, etc.)
- **Character Types**: A (Alpha), N (Numeric), ANS (Alphanumeric+Special)

### PDF417 Barcode Requirements
- Must encode all mandatory elements using AAMVA data element identifiers
- Error correction level 3 minimum, 5 recommended
- Maximum dimensions: 75.565mm × 38.1mm
- Follows ISO/IEC 15438 standard

### Card Format Logic
- **Horizontal Format**: Standard for 21+ years, 85.60×53.98mm
- **Vertical Format**: Required/recommended for under 21
- **REAL ID**: Compliance indicators (gold star vs "NOT FOR REAL ID")

## Key Development Patterns

### Data Validation Pattern
```javascript
const validator = new DataValidator();
const validation = validator.validate(data);
if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
}
```

### Component Generation Pattern
```javascript
// 1. Validate data
// 2. Generate layout
// 3. Generate barcode
// 4. Compile final document
const document = generator.compile({ data, layout, barcode, metadata });
```

### Error Handling Standards
- Use descriptive error messages with field names
- Validate incrementally (data → layout → barcode → final)
- Provide both errors and warnings in validation results
- Include AAMVA reference numbers in error messages

## Important Constraints

### Security and Legal Compliance
- This is for **educational/development purposes only**
- Official government implementation requires additional security measures
- Must implement proper access controls and audit trails for production use
- Jurisdictional regulations must be followed for any official use

### Technical Limitations  
- Portrait/signature areas use placeholders (`[PORTRAIT]`, `[SIGNATURE]`)
- Barcode contains properly formatted data but requires actual PDF417 rendering library
- Color values are specified but not physically rendered
- Security features are documented but not implemented

### Data Constraints
- Maximum field lengths per AAMVA specifications
- Character set restrictions (ANS fields vs Alpha-only)
- Date range validations (birth date, expiry after issue date)
- Cross-field validation (age vs format recommendations)

## File Structure Notes

```
src/
├── core/              # Core ID generation logic and AAMVA zone compilation
├── data/              # Data validation with comprehensive AAMVA rules
├── layout/            # Zone-based layout system (horizontal/vertical)
├── barcode/           # PDF417 generation with AAMVA encoding
└── main.js           # CLI orchestrator and application entry point

docs/
├── data-elements.md   # Complete AAMVA data element reference
├── layout-zones.md    # Zone-based layout system documentation
└── quick-start.md     # Getting started guide

examples/
└── basic-usage.js     # Comprehensive usage examples and demonstrations
```

## Integration Notes

When extending or integrating this codebase:

1. **Always validate data first** using the DataValidator before any processing
2. **Respect AAMVA zone boundaries** when modifying layout logic  
3. **Test with both horizontal and vertical formats** for age-appropriate rendering
4. **Validate PDF417 data integrity** - barcode must encode all mandatory elements
5. **Check compliance flags** (REAL ID, enhanced, CDL) for proper indicators
6. **Consider jurisdiction variations** while maintaining AAMVA standard compliance

The codebase is designed to be educational and demonstrates the full AAMVA standard implementation while maintaining clear separation between document logic, validation, layout, and barcode generation components.