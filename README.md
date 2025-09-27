# AAMVA-Compliant ID Maker ---------------> NAVADA ONLY (NEXT BUILD WILL HAVE MORE STATES) 


** AAMVA DOES NOT MATCH NAVADA ID FORMAT **
A comprehensive ID/Driver's License generator that follows the AAMVA (American Association of Motor Vehicle Administrators) DL/ID Card Design Standard 2025 v1.0. 


Design Principles and Guidelines 
for Secure DL/ID Cards (SCDP)
    ---- [GUIDELINES PDF](https://www.aamva.org/getmedia/19072a17-e9f2-45e0-975f-5e00588cb3f8/Design-Principles-and-Guidelines-for-Secure-DLID-Cards.pdf)


Standard Verification Programs link:
    ---- [ID PROGRAM FORM](https://www.aamva.org/publications-news/best-practices-standards/courtesy-standard-verification-programs/courtesy-verification-program)

 




## Overview


This project creates standardized identification documents that comply with North American standards for driver's licenses and identification cards. It implements the full AAMVA specification including:


>>  SI PAPPI   - **Human-readable data elements** (mandatory and optional) <BR/>
>>  UMM HMM    - **Machine-readable technology** (PDF417 2D barcode) <BR/> 
>> IN THE WORKS - **Security features** and design standards (working on id printers <BR/> 
>> NEXT BUILD  - **Zone-based layout** system <BR/>
>>  SIMPLE     - **Data validation** and formatting <BR/>

## Features

### Functionality
- Generate AAMVA-compliant ID cards and driver's licenses
--- Support for both horizontal (21+) and vertical (under 21) formats
- Mandatory and optional data element handling
---- PDF417 barcode generation with proper encoding
*NEXT BUILD - Zone-based layout system (Zones I-V)

### Data Elements Supported
- **Personal Information**: Name, DOB, Address, Physical Description
- **Document Information**: Issue/Expiry dates, Document discriminator
- **Driving Privileges**: Vehicle classifications, Endorsements, Restrictions
- **Security Elements**: Unique identifiers, Audit information
- **Compliance Indicators**: REAL ID compliance markers
                               ^^ have to add if you dont want it. but why :D

  
**Next build Navada uses its own format**
 ### Standards Compliance
   - AAMVA DL/ID Card Design Standard 2025 v1.0
   - ISO/IEC 18013 compatibility options
   - DHS REAL ID Act compliance
   - PDF417 barcode standards (ISO/IEC 15438)

## Project Structure

```
id-maker/
├── src/
│   ├── core/              # Core ID generation logic
│   ├── data/              # Data validation and formatting
│   ├── layout/            # Card layout and zone management
│   ├── barcode/           # PDF417 barcode generation
│   └── security/          # Security features and validation
├── templates/             # Card design templates
├── examples/              # Usage examples and sample data
├── tests/                 # Test files and validation
└── docs/                  # Documentation and specifications
```

## Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd id-maker
npm install  # or python -m pip install -r requirements.txt

# Generate a sample ID
node src/main.js --template basic --output sample-id.json
# or
python src/main.py --template basic --output sample-id.json
```

## Documentation

- [AAMVA Standard Reference](docs/aamva-reference.md)
- [Data Elements Guide](docs/data-elements.md)
- [Layout System](docs/layout-zones.md)
- [Barcode Generation](docs/pdf417-barcode.md)
- [Security Features](docs/security.md)

## Compliance Notes

This software is designed for educational and development purposes. Any implementation for official government use must:

1. Meet all AAMVA security requirements
2. Implement proper access controls
3. Follow jurisdictional regulations
4. Include appropriate audit trails ***
5. Undergo official compliance testing
>>YES HERES THE LINK 
Standard Verification Program
    ---- [ID PROGRAM FORM](https://www.aamva.org/publications-news/best-practices-standards/courtesy-standard-verification-programs/courtesy-verification-program)


## License

MIT License - See LICENSE file for details

## Contributing

Please read CONTRIBUTING.md for guidelines on contributing to this project.
