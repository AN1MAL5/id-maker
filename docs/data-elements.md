# AAMVA Data Elements Reference

This document provides a complete reference for all data elements supported by the AAMVA ID Maker, following the AAMVA DL/ID Card Design Standard 2025 v1.0.

## Overview

Data elements are divided into two categories:
- **Mandatory Data Elements** (Table 1) - Must be present on all compliant documents
- **Optional Data Elements** (Table 2) - May be included based on jurisdiction requirements

## Mandatory Data Elements

### Personal Information

| Field | Reference | Description | Format | Max Length | Example |
|-------|-----------|-------------|--------|------------|---------|
| **Family Name** | 1 | Last name or surname | ANS | 40 chars | `SMITH` |
| **Given Names** | 2 | First and middle names | ANS | 80 chars | `JOHN MICHAEL` |
| **Date of Birth** | 3 | Birth date | MM/DD/CCYY | 10 chars | `03/15/1985` |
| **Sex** | 15 | Gender designation | M/F/X | 1 char | `M` |
| **Height** | 16 | Physical height | Feet/inches | 6 chars | `5'-10"` |
| **Eye Color** | 18 | Eye color | AAMVA codes | 12 chars | `BRO` |

### Document Information

| Field | Reference | Description | Format | Max Length | Example |
|-------|-----------|-------------|--------|------------|---------|
| **Date of Issue** | 4a | Issue date | MM/DD/CCYY | 10 chars | `09/26/2025` |
| **Date of Expiry** | 4b | Expiration date | MM/DD/CCYY | 10 chars | `03/15/2030` |
| **Customer Identifier** | 4d | Unique ID number | ANS | 25 chars | `D12345678901234567890` |
| **Document Discriminator** | 5 | Document unique ID | ANS | 25 chars | `2025092612345` |
| **Address** | 8 | Mailing/residential address | ANS | 108 chars | `123 MAIN ST, ANYTOWN, ST 12345` |

### Driving Privileges

| Field | Reference | Description | Format | Max Length | Example |
|-------|-----------|-------------|--------|------------|---------|
| **Vehicle Classifications** | 9 | Authorized vehicle types | ANS | 6 chars | `D` |
| **Endorsements** | 9a | Additional privileges | ANS | 5 chars | `HN` or `NONE` |
| **Restrictions** | 12 | Driving limitations | ANS | 12 chars | `A` or `NONE` |

## Optional Data Elements

### Extended Personal Information

| Field | Reference | Description | Format | Max Length | Example |
|-------|-----------|-------------|--------|------------|---------|
| **Hair Color** | 19 | Hair color | AAMVA codes | 12 chars | `BRN` |
| **Weight** | 17 | Physical weight | Pounds/kg | 6 chars | `180 lb` |
| **Name Suffix** | - | Name suffix | ANS | 5 chars | `JR`, `SR`, `III` |
| **Place of Birth** | 3a | Birth location | A | 33 chars | `NEW YORK, NY, USA` |

### Administrative Information

| Field | Reference | Description | Format | Max Length | Example |
|-------|-----------|-------------|--------|------------|---------|
| **Audit Information** | 21 | Production tracking | ANS | 25 chars | `2025092612345ABCD` |
| **Inventory Control** | 21 | Card stock tracking | ANS | 25 chars | `ICN2025092612345` |

### Age-Based Information

| Field | Reference | Description | Format | Example |
|-------|-----------|-------------|--------|---------|
| **Under 18 Until** | - | Date turns 18 | MM/DD/CCYY | `03/15/2003` |
| **Under 19 Until** | - | Date turns 19 | MM/DD/CCYY | `03/15/2004` |
| **Under 21 Until** | - | Date turns 21 | MM/DD/CCYY | `03/15/2006` |

### Status Indicators

| Field | Reference | Description | Values | Example |
|-------|-----------|-------------|--------|---------|
| **Organ Donor** | - | Organ donor status | boolean | `true` |
| **Veteran** | - | Military veteran status | boolean | `true` |

## Data Format Specifications

### Character Types

- **A (Alpha)**: Letters A-Z, a-z, spaces, hyphens, apostrophes, periods
- **N (Numeric)**: Digits 0-9
- **S (Special)**: Special characters (!, ", #, %, &, etc.)
- **ANS**: Any combination of Alpha, Numeric, Special characters

### Date Formats

- **US Format**: MM/DD/CCYY (e.g., `03/15/1985`)
- **Canadian Format**: CCYY/MM/DD (e.g., `1985/03/15`)

### Height Formats

- **US Format**: Feet and inches (e.g., `5'-10"`)
- **Metric Format**: Centimeters (e.g., `178 cm`)

### Weight Formats

- **US Format**: Pounds (e.g., `180 lb`)
- **Metric Format**: Kilograms (e.g., `82 kg`)

## AAMVA Color Codes

### Eye Colors
- `BLU` - Blue
- `BRO` - Brown
- `BLK` - Black
- `HAZ` - Hazel
- `GRN` - Green
- `GRY` - Gray
- `PNK` - Pink
- `MAR` - Maroon
- `DIC` - Dichromatic

### Hair Colors
- `BLD` - Bald
- `BLK` - Black
- `BLN` - Blonde
- `BRN` - Brown
- `GRY` - Gray
- `RED` - Red/Auburn
- `SDY` - Sandy
- `WHI` - White
- `UNK` - Unknown

## Vehicle Classifications

### Standard Classes
- **A** - Any combination of vehicles
- **B** - Large trucks, buses, tractor-trailers
- **C** - Regular vehicles and small trucks
- **D** - Regular operator license
- **M** - Motorcycles

### Commercial Classes
- **CDL A** - Combination vehicles
- **CDL B** - Large trucks and buses
- **CDL C** - Small commercial vehicles

## Endorsements

- **H** - Hazardous materials
- **N** - Tank vehicles
- **P** - Passenger vehicles
- **S** - School bus
- **T** - Double/triple trailers
- **X** - Combination of tank vehicle and hazardous materials

## Restrictions

- **A** - Corrective lenses
- **B** - Outside rearview mirror
- **C** - Prosthetic aid
- **D** - Automatic transmission
- **E** - No manual transmission equipped CMV
- **F** - Outside rearview mirror and/or signal
- **G** - Limit to daylight driving only
- **H** - Limit to employment
- **I** - Limited other
- **J** - Other adaptive devices
- **K** - CDL Intrastate only
- **L** - Vehicles without air brakes

## Compliance Requirements

### REAL ID Compliance

For REAL ID compliant documents, the following additional fields are required:

- **Compliance Type**: `F` (compliant) or `N` (non-compliant)
- **Card Revision Date**: Date of most recent format change
- **Limited Duration Indicator**: `1` if temporary lawful status

### PDF417 Barcode Requirements

All mandatory data elements must be encoded in the PDF417 barcode using the AAMVA data element identifiers:

- Family Name: `DCS`
- Given Names: `DAC` (first), `DAD` (middle)
- Date of Birth: `DBB`
- Date of Issue: `DBD`
- Date of Expiry: `DBA`
- Customer ID: `DAQ`
- Document Discriminator: `DCF`

## Usage Examples

### Minimum Required Data
```javascript
const minimalData = {
  familyName: 'SMITH',
  givenNames: 'JOHN',
  dateOfBirth: '03/15/1985',
  dateOfIssue: '09/26/2025',
  dateOfExpiry: '03/15/2030',
  customerIdentifier: 'D12345678901234567890',
  documentDiscriminator: '2025092612345',
  address: '123 MAIN ST, ANYTOWN, ST 12345',
  vehicleClassifications: 'D',
  endorsements: 'NONE',
  restrictions: 'NONE',
  sex: 'M',
  height: '5\'-10\"',
  eyeColor: 'BRO'
};
```

### Complete Data Example
```javascript
const completeData = {
  // Mandatory fields (as above)
  ...minimalData,
  
  // Optional fields
  hairColor: 'BRN',
  weight: '180 lb',
  suffix: 'JR',
  placeOfBirth: 'NEW YORK, NY, USA',
  organDonor: true,
  veteran: false,
  
  // Compliance
  compliance: {
    realId: true,
    aamvaVersion: '11',
    jurisdictionVersion: '00'
  }
};
```

## Validation Rules

The ID Maker validates all data according to AAMVA standards:

1. **Required Field Validation**: All mandatory fields must be present
2. **Format Validation**: Data must match specified formats (dates, height, etc.)
3. **Character Type Validation**: Fields must use allowed character sets
4. **Length Validation**: Fields must not exceed maximum lengths
5. **Value Validation**: Enumerated fields must use valid values
6. **Cross-Field Validation**: Expiry date must be after issue date
7. **Age-Based Validation**: Card format recommendations based on age

For complete validation details, see the DataValidator class documentation.