# AAMVA Layout Zones Reference

This document describes the zone-based layout system used in AAMVA DL/ID Card Design Standard 2025 v1.0, as implemented by the ID Maker.

## Overview

The AAMVA standard uses a five-zone layout system to ensure consistency across all jurisdictions:

- **Portrait Side**: Zones I, II, and III
- **Non-Portrait Side**: Zones IV and V

## Card Dimensions

All cards follow ISO/IEC 7810 ID-1 specifications:
- **Width**: 85.60 mm (3.370 inches)
- **Height**: 53.98 mm (2.125 inches)
- **Corner Radius**: 3.18 mm
- **Thickness**: 0.76 mm nominal

## Portrait Side Zones

### Zone I - Document Type and Jurisdiction
**Location**: Top of portrait side  
**Dimensions**: Full width × 8.00mm height  
**Background**: Variable color based on document type

**Contents**:
- Document type indicator (DRIVER LICENSE, IDENTIFICATION CARD, etc.)
- Issuing jurisdiction name
- Country code (USA/CAN)
- REAL ID compliance indicator (star or "NOT FOR REAL ID")
- Enhanced document indicators (if applicable)

**Color Coding**:
- **Driver License**: Red background (Pantone 198, 30% tint)
- **ID Card**: Green background (Pantone 368, 30% tint)
- **Enhanced License**: Navy blue background
- **Commercial License**: Red background

### Zone II - Personal and Document Information
**Location**: Left side of portrait side (horizontal) / below Zone I (vertical)  
**Dimensions**: Variable based on card format

**Horizontal Format**:
- Position: 0, 8.00mm from top
- Dimensions: 45.60mm × 45.98mm

**Vertical Format**:
- Position: 0, 8.00mm from top  
- Dimensions: 85.60mm × 20.00mm

**Contents (with AAMVA reference numbers)**:
1. Family Name
2. Given Names  
3. Date of Birth (DOB)
4a. Date of Issue (Iss)
4b. Date of Expiry (Exp)
4d. Customer Identifier
5. Document Discriminator (DD)
8. Address
9. Vehicle Classifications
9a. Endorsements (End)
12. Restrictions
15. Sex
16. Height (Hgt)
18. Eye Color (Eyes)
19. Hair Color (Hair) - optional

### Zone III - Portrait and Signature
**Location**: Right side of portrait side (horizontal) / middle section (vertical)

**Horizontal Format**:
- Position: 45.60mm from left, 8.00mm from top
- Dimensions: 40.00mm × 45.98mm
- Portrait Area: 36.00mm × 41.98mm (with 2mm margins)

**Vertical Format**:
- Position: 0, 28.00mm from top
- Dimensions: 85.60mm × 25.98mm
- Portrait Area: 45.60mm × 21.98mm (centered)

**Contents**:
- **Portrait Image**: Digital color photograph
  - Format: Full-face frontal pose
  - Background: Light blue or white
  - Size: 70-80% of zone height
  - Lifecycle: No older than 16 years
- **Signature**: Digital reproduction
  - May overlap portrait if in Zone III
  - High contrast color
  - Maintains original aspect ratio

## Non-Portrait Side Zones

### Zone IV - Code Explanations
**Location**: Bottom portion of non-portrait side  
**Dimensions**: 85.60mm × 35.00mm

**Contents**:
- Vehicle class explanations
- Endorsement descriptions
- Restriction descriptions
- Additional driving information
- Date of first issue per category (optional)
- Separate expiry dates (optional)
- Veteran indicator (optional)

**Example Content**:
```
VEHICLE RESTRICTIONS
A - Corrective lenses
D - Automatic transmission

PDE CATEGORIES  
P - Passengers
G - Goods  
D - Dangerous goods
```

### Zone V - Machine-Readable Technology
**Location**: Top portion of non-portrait side  
**Dimensions**: 85.60mm × 18.98mm  
**Barcode Area**: 75.565mm × 14.98mm maximum

**Contents**:
- **PDF417 2D Barcode** (mandatory)
  - Standard: ISO/IEC 15438
  - Error Correction Level: 3 minimum, 5 recommended
  - Orientation: Bars perpendicular to card bottom
  - X-Dimension: 0.170mm to 0.380mm range
- **Optional Technologies**:
  - Magnetic stripe (legacy)
  - Optical memory
  - RFID (Enhanced licenses)
  - Integrated circuit cards

## Format Variations

### Horizontal Format (21+ years)
**Usage**: Standard adult format  
**Zones**: I-II-III layout on portrait side

**Key Features**:
- Portrait on right side (Zone III)
- Personal data on left side (Zone II) 
- Document header across top (Zone I)
- Two-column data layout in Zone II

### Vertical Format (Under 21)
**Usage**: Mandatory for under 21 in US, optional in Canada  
**Zones**: I-II-III stacked layout on portrait side

**Key Features**:
- Portrait in center (Zone III)
- Personal data above portrait (Zone II)
- Document header at top (Zone I)
- Single-column data layout in Zone II

## Implementation Guidelines

### Zone Overlap
- Overlap is allowed and expected between zones
- Signature may overlap from Zone II to Zone III
- Security features may span multiple zones

### Text Placement
- Use reference numbers for data elements (1, 2, 3, 4a, etc.)
- Left-justify text within fields
- Maintain consistent font sizes within zones
- Ensure high contrast for readability

### Security Integration
- Security features must not obscure required data
- Portrait area must have security overlap
- Machine-readable zones must remain scannable
- Color schemes must support security printing

### Accessibility
- Minimum font sizes for readability
- High contrast ratios
- Tactile features for identification
- Clear zone separation

## Zone Dimensions Reference

| Zone | Horizontal Format | Vertical Format | Purpose |
|------|------------------|-----------------|---------|
| **I** | 85.60 × 8.00mm | 85.60 × 8.00mm | Document type |
| **II** | 45.60 × 45.98mm | 85.60 × 20.00mm | Personal data |
| **III** | 40.00 × 45.98mm | 85.60 × 25.98mm | Portrait/signature |
| **IV** | 85.60 × 35.00mm | 85.60 × 35.00mm | Code explanations |
| **V** | 85.60 × 18.98mm | 85.60 × 18.98mm | Machine-readable |

## Quality Control

### Layout Validation
- Zone positioning accuracy: ±0.5mm
- Data element placement consistency
- Portrait centering and sizing
- Barcode positioning and orientation

### Print Quality
- Color reproduction accuracy
- Text clarity and contrast
- Security feature integration
- Durability testing per Annex E

### Compliance Verification
- AAMVA zone structure adherence
- ISO/IEC 7810 dimension compliance
- Jurisdiction-specific requirements
- Accessibility standards

## Integration with ID Maker

The ID Maker's LayoutManager class implements these specifications:

```javascript
// Generate layout for horizontal format
const layoutManager = new LayoutManager();
const layout = layoutManager.generateLayout({
  cardFormat: 'horizontal',
  documentType: 'DL'
});

// Access zone specifications
const zones = layout.zones;
const portraitArea = zones.III.portraitArea;
const barcodeArea = zones.V.barcodeArea;
```

### Zone Elements
Each zone contains positioned elements:
```javascript
{
  zone: 'II',
  type: 'text',
  content: '1: SMITH',
  position: { x: 2, y: 5 },
  font: { family: 'Arial', size: 8 },
  color: 'black'
}
```

For complete implementation details, see the LayoutManager class documentation.