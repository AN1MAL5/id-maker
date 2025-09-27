/**
 * AAMVA ID Generator - Core functionality
 * Implements AAMVA DL/ID Card Design Standard 2025 v1.0
 */

const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns');

/**
 * Main ID Generator class
 * Handles compilation of all components into final AAMVA-compliant document
 */
class IDGenerator {
  constructor() {
    this.standard = 'AAMVA DL/ID 2025 v1.0';
    this.version = '11'; // AAMVA Version Number
  }

  /**
   * Compile all components into final document
   * @param {Object} components - All document components
   * @returns {Object} Complete AAMVA-compliant document
   */
  compile(components) {
    const { data, layout, barcode, metadata } = components;

    // Generate AAMVA PDF417 string
    const aamvaString = this.generateAAMVAString(data);

    // Generate document structure following AAMVA standards
    const document = {
      // Document Header
      header: this.generateHeader(metadata),

      // Human-readable data (Zones I-IV)
      humanReadable: {
        zoneI: this.generateZoneI(data),
        zoneII: this.generateZoneII(data),
        zoneIII: this.generateZoneIII(data),
        zoneIV: this.generateZoneIV(data)
      },

      // Machine-readable data (Zone V)
      machineReadable: {
        zoneV: {
          pdf417: barcode,
          aamvaString: aamvaString,
          format: 'PDF417',
          standard: 'ISO/IEC 15438'
        }
      },

      // Layout information
      layout: layout,

      // Security features
      security: this.generateSecurityFeatures(data),

      // Compliance information
      compliance: this.generateComplianceInfo(data),

      // Metadata
      metadata: {
        ...metadata,
        documentId: uuidv4(),
        generatedBy: 'AAMVA ID Maker v1.0.0',
        standard: this.standard,
        aamvaVersion: this.version
      }
    };

    return document;
  }

  /**
   * Generate AAMVA PDF417 string
   */
  generateAAMVAString(data) {
    // AAMVA PDF417 format: @\n + header + subfile designator + data elements
    let aamvaString = '@\n';

    // Header: ANSI 6360000102DL00410278NV00100
    // Format: ANSI space jurisdiction version AAMVA version issue date expiration date
    const jurisdiction = '6360000102DL00410278NV00100';
    aamvaString += jurisdiction + '\n';

    // Subfile designator: DL (Driver License)
    aamvaString += 'DL\n';

    // Data elements
    aamvaString += `DCS${data.familyName}\n`;
    aamvaString += `DAC${data.givenNames}\n`;
    aamvaString += `DAD${data.middleName || ''}\n`;
    aamvaString += `DBD${data.dateOfBirth.replace(/\//g, '')}\n`;
    aamvaString += `DBB${data.dateOfBirth.replace(/\//g, '')}\n`; // Duplicate for some formats
    aamvaString += `DBA${data.dateOfExpiry.replace(/\//g, '')}\n`;
    aamvaString += `DBC${data.sex}\n`;
    aamvaString += `DAY${data.eyeColor}\n`;
    aamvaString += `DAU${data.height}\n`;
    aamvaString += `DAG${data.address}\n`;
    aamvaString += `DAI${data.city || ''}\n`;
    aamvaString += `DAJ${data.state || 'NV'}\n`;
    aamvaString += `DAK${data.zip || ''}\n`;
    aamvaString += `DCF${data.documentDiscriminator || ''}\n`;
    aamvaString += `DCG${'USA'}\n`;
    aamvaString += `DCH${data.customerIdentifier}\n`;
    aamvaString += `DCI${'NV'}\n`;
    aamvaString += `DCJ${data.documentType}\n`;
    aamvaString += `DCK${data.customerIdentifier.slice(-9)}\n`; // DL No
    aamvaString += `DCL${data.vehicleClassifications || 'C'}\n`;
    aamvaString += `DCM${data.restrictions || 'NONE'}\n`;
    aamvaString += `DCN${data.endorsements || 'NONE'}\n`;
    aamvaString += `DCO${data.organDonor ? '1' : '0'}\n`;
    aamvaString += `DCP${data.veteran ? '1' : '0'}\n`;
    aamvaString += `DCQ${data.hairColor || ''}\n`;
    aamvaString += `DCR${data.placeOfBirth || ''}\n`;
    aamvaString += `DCT${data.familyName}\n`; // Duplicate
    aamvaString += `DCU${data.auditInformation || ''}\n`;

    return aamvaString;
  }

  /**
   * Generate document header
   */
  generateHeader(metadata) {
    return {
      standard: this.standard,
      version: this.version,
      generatedAt: metadata.generatedAt,
      template: metadata.template,
      format: metadata.format
    };
  }

  /**
   * Generate Zone I - Document Type and Issuing Authority
   */
  generateZoneI(data) {
    const documentTypes = {
      'DL': 'DRIVER LICENSE',
      'ID': 'IDENTIFICATION CARD',
      'CDL': 'COMMERCIAL DRIVER\'S LICENSE',
      'EDL': 'ENHANCED DRIVER LICENSE'
    };

    return {
      documentType: documentTypes[data.documentType] || 'DRIVER LICENSE',
      issuingJurisdiction: 'NEVADA',
      countryCode: 'USA',
      backgroundDesign: {
        color: 'Blue',
        pantone: '288',
        tintPercentage: 20
      }
    };
  }

  /**
   * Generate Zone II - Personal and Document Information
   */
  generateZoneII(data) {
    return {
      // Mandatory Data Elements
      familyName: data.familyName,
      givenNames: data.givenNames,
      fullName: `${data.givenNames} ${data.familyName}`.toUpperCase(),
      suffix: data.suffix || null,
      dateOfBirth: data.dateOfBirth,
      dateOfIssue: data.dateOfIssue,
      dateOfExpiry: data.dateOfExpiry,
      customerIdentifier: data.customerIdentifier,
      dlNo: data.customerIdentifier.slice(-9),
      documentDiscriminator: data.documentDiscriminator,
      address: data.address,
      vehicleClassifications: data.vehicleClassifications || 'C',
      endorsements: data.endorsements,
      restrictions: data.restrictions,
      sex: data.sex,
      height: data.height,
      eyeColor: data.eyeColor,

      // Optional Data Elements
      hairColor: data.hairColor || null,
      weight: data.weight || null,
      placeOfBirth: data.placeOfBirth || null,
      auditInformation: data.auditInformation || null,

      // Age-related fields
      under18Until: this.calculateAgeDate(data.dateOfBirth, 18),
      under19Until: this.calculateAgeDate(data.dateOfBirth, 19),
      under21Until: this.calculateAgeDate(data.dateOfBirth, 21),

      // Indicators
      organDonor: data.organDonor || false,
      veteran: data.veteran || false
    };
  }

  /**
   * Generate Zone III - Portrait and Signature
   */
  generateZoneIII(data) {
    return {
      portrait: {
        present: true,
        data: data.photo || null,
        requirements: {
          format: 'Color digital reproduction',
          pose: 'Full-face frontal',
          background: 'Light blue or white',
          size: '70-80% of zone height',
          orientation: 'Crown to top of zone'
        },
        placeholder: '[PORTRAIT IMAGE PLACEHOLDER]'
      },
      signature: {
        present: true,
        requirements: {
          format: 'Digital reproduction',
          color: 'High contrast',
          placement: 'Zone II or III'
        },
        placeholder: '[SIGNATURE PLACEHOLDER]'
      }
    };
  }

  /**
   * Generate Zone IV - Code Explanations and Additional Info
   */
  generateZoneIV(data) {
    const codeExplanations = {
      vehicleClassifications: this.getVehicleClassExplanations(data.vehicleClassifications),
      endorsements: this.getEndorsementExplanations(data.endorsements),
      restrictions: this.getRestrictionExplanations(data.restrictions)
    };

    return {
      codeExplanations,
      additionalInfo: {
        dateOfFirstIssue: data.dateOfFirstIssue || null,
        separateExpiryDates: data.separateExpiryDates || null
      }
    };
  }

  /**
   * Generate security features
   */
  generateSecurityFeatures(data) {
    return {
      mandatory: [
        'UV-dull substrate material',
        'Security background printing with at least 2 special colors',
        'Guilloche design',
        'UV fluorescent ink',
        'Digital imaging for personalization',
        'Tamper-evident overlay/laminate',
        'Security background overlapping portrait'
      ],
      optional: [
        'Optical Variable Element (OVE)',
        'Microprinting',
        'Rainbow printing',
        'Ghost image',
        'Tactile features'
      ],
      implementation: 'Security features implemented per AAMVA Annex B requirements'
    };
  }

  /**
   * Generate compliance information
   */
  generateComplianceInfo(data) {
    const compliance = data.compliance || {};

    return {
      aamvaCompliant: true,
      aamvaVersion: this.version,
      realId: compliance.realId || true,
      realIdIndicator: (compliance.realId || true) ? 'Gold Star' : 'NOT FOR REAL ID',
      limitedDuration: compliance.limitedDuration || false,
      enhanced: compliance.enhanced || false,
      cdl: data.documentType === 'CDL',
      nonDomiciled: compliance.nonDomiciled || false,
      jurisdictionSpecific: {
        state: 'NV',
        version: '01'
      }
    };
  }

  /**
   * Calculate age-related dates
   */
  calculateAgeDate(dateOfBirth, targetAge) {
    try {
      const birthDate = new Date(dateOfBirth);
      const ageDate = new Date(birthDate);
      ageDate.setFullYear(birthDate.getFullYear() + targetAge);
      return format(ageDate, 'MM/dd/yyyy');
    } catch (error) {
      return null;
    }
  }

  /**
   * Get vehicle class explanations
   */
  getVehicleClassExplanations(classifications) {
    const explanations = {
      'A': 'Any combination of vehicles',
      'B': 'Large trucks, buses, and tractor-trailers',
      'C': 'Regular vehicles and small trucks',
      'D': 'Regular operator license',
      'M': 'Motorcycles'
    };

    return classifications.split('').map(code => ({
      code: code,
      description: explanations[code] || 'Unknown classification'
    }));
  }

  /**
   * Get endorsement explanations
   */
  getEndorsementExplanations(endorsements) {
    if (endorsements === 'NONE') return [];

    const explanations = {
      'H': 'Hazardous materials',
      'N': 'Tank vehicles',
      'P': 'Passenger vehicles',
      'S': 'School bus',
      'T': 'Double/triple trailers',
      'X': 'Combination of tank vehicle and hazardous materials'
    };

    return endorsements.split('').map(code => ({
      code: code,
      description: explanations[code] || 'Unknown endorsement'
    }));
  }

  /**
   * Get restriction explanations
   */
  getRestrictionExplanations(restrictions) {
    if (restrictions === 'NONE') return [];

    const explanations = {
      'A': 'Corrective lenses',
      'B': 'Outside rearview mirror',
      'C': 'Prosthetic aid',
      'D': 'Automatic transmission',
      'E': 'No manual transmission equipped CMV',
      'F': 'Outside rearview mirror and/or signal',
      'G': 'Limit to daylight driving only',
      'H': 'Limit to employment',
      'I': 'Limited other',
      'J': 'Other adaptive devices',
      'K': 'CDL Intrastate only',
      'L': 'Vehicles without air brakes'
    };

    return restrictions.split('').map(code => ({
      code: code,
      description: explanations[code] || 'Unknown restriction'
    }));
  }
}

module.exports = { IDGenerator };