/**
 * AAMVA Layout Manager
 * Handles zone-based layout system per AAMVA DL/ID Card Design Standard 2025 v1.0
 */

/**
 * Layout manager implementing AAMVA zone-based design
 */
class LayoutManager {
  constructor() {
    // Standard card dimensions (ISO/IEC 7810 ID-1)
    this.cardDimensions = {
      width: 85.60, // mm
      height: 53.98, // mm
      cornerRadius: 3.18 // mm
    };

    // Zone definitions for different formats
    this.zoneLayouts = {
      horizontal: this.getHorizontalZones(),
      vertical: this.getVerticalZones()
    };
  }

  /**
   * Generate layout for given data and format
   * @param {Object} data - Card data
   * @returns {Object} Complete layout specification
   */
  generateLayout(data) {
    const format = data.cardFormat || 'horizontal';
    const zones = this.zoneLayouts[format];

    return {
      format: format,
      dimensions: this.cardDimensions,
      zones: zones,
      portraitSide: {
        zones: ['I', 'II', 'III'],
        elements: this.generatePortraitSideElements(data, zones)
      },
      nonPortraitSide: {
        zones: ['IV', 'V'],
        elements: this.generateNonPortraitSideElements(data, zones)
      },
      compliance: this.generateLayoutCompliance(data),
      colorScheme: this.generateColorScheme(data)
    };
  }

  /**
   * Get horizontal card zone layout
   */
  getHorizontalZones() {
    return {
      // Zone I - Document Type and Jurisdiction (top)
      I: {
        position: { x: 0, y: 0 },
        dimensions: { width: 85.60, height: 8.00 },
        description: 'Document type indicator and issuing jurisdiction',
        backgroundColor: 'variable', // Based on document type
        textColor: 'white'
      },

      // Zone II - Personal Data (left side of portrait side)
      II: {
        position: { x: 0, y: 8.00 },
        dimensions: { width: 45.60, height: 45.98 },
        description: 'Personal and document information',
        backgroundColor: 'white',
        textColor: 'black'
      },

      // Zone III - Portrait and Signature (right side of portrait side)
      III: {
        position: { x: 45.60, y: 8.00 },
        dimensions: { width: 40.00, height: 45.98 },
        description: 'Portrait image and signature',
        backgroundColor: 'white',
        portraitArea: {
          position: { x: 2.00, y: 2.00 },
          dimensions: { width: 36.00, height: 41.98 }
        }
      },

      // Zone IV - Code Explanations (non-portrait side)
      IV: {
        position: { x: 0, y: 0 },
        dimensions: { width: 85.60, height: 35.00 },
        description: 'Vehicle class, endorsement, and restriction explanations',
        backgroundColor: 'white',
        textColor: 'black'
      },

      // Zone V - Machine Readable (non-portrait side, bottom)
      V: {
        position: { x: 0, y: 35.00 },
        dimensions: { width: 85.60, height: 18.98 },
        description: 'PDF417 barcode and other machine-readable technology',
        backgroundColor: 'white',
        barcodeArea: {
          position: { x: 5.00, y: 2.00 },
          maxDimensions: { width: 75.60, height: 14.98 }
        }
      }
    };
  }

  /**
   * Get vertical card zone layout (under 21)
   */
  getVerticalZones() {
    return {
      // Zone I - Document Type and Jurisdiction (top)
      I: {
        position: { x: 0, y: 0 },
        dimensions: { width: 85.60, height: 8.00 },
        description: 'Document type indicator and issuing jurisdiction',
        backgroundColor: 'variable',
        textColor: 'white'
      },

      // Zone II - Personal Data (below Zone I)
      II: {
        position: { x: 0, y: 8.00 },
        dimensions: { width: 85.60, height: 20.00 },
        description: 'Personal and document information',
        backgroundColor: 'white',
        textColor: 'black'
      },

      // Zone III - Portrait and Signature (middle)
      III: {
        position: { x: 0, y: 28.00 },
        dimensions: { width: 85.60, height: 25.98 },
        description: 'Portrait image and signature',
        backgroundColor: 'white',
        portraitArea: {
          position: { x: 20.00, y: 2.00 },
          dimensions: { width: 45.60, height: 21.98 }
        }
      },

      // Zone IV - Code Explanations (non-portrait side)
      IV: {
        position: { x: 0, y: 0 },
        dimensions: { width: 85.60, height: 35.00 },
        description: 'Vehicle class, endorsement, and restriction explanations',
        backgroundColor: 'white',
        textColor: 'black'
      },

      // Zone V - Machine Readable (non-portrait side, bottom)
      V: {
        position: { x: 0, y: 35.00 },
        dimensions: { width: 85.60, height: 18.98 },
        description: 'PDF417 barcode and other machine-readable technology',
        backgroundColor: 'white',
        barcodeArea: {
          position: { x: 5.00, y: 2.00 },
          maxDimensions: { width: 75.60, height: 14.98 }
        }
      }
    };
  }

  /**
   * Generate portrait side elements
   */
  generatePortraitSideElements(data, zones) {
    const elements = [];

    // Zone I elements
    elements.push({
      zone: 'I',
      type: 'text',
      content: this.getDocumentTypeText(data.documentType),
      position: { x: 5, y: 2 },
      font: { family: 'Arial', size: 14, weight: 'bold' },
      color: 'white'
    });

    elements.push({
      zone: 'I',
      type: 'text',
      content: 'SAMPLE STATE',
      position: { x: 5, y: 5 },
      font: { family: 'Arial', size: 10 },
      color: 'white'
    });

    elements.push({
      zone: 'I',
      type: 'text',
      content: 'USA',
      position: { x: 75, y: 3 },
      font: { family: 'Arial', size: 12, weight: 'bold' },
      color: 'white'
    });

    // Compliance indicator
    if (data.compliance && data.compliance.realId) {
      elements.push({
        zone: 'I',
        type: 'symbol',
        content: '★', // Gold star
        position: { x: 65, y: 2 },
        font: { size: 16 },
        color: 'gold'
      });
    } else {
      elements.push({
        zone: 'I',
        type: 'text',
        content: 'NOT FOR REAL ID',
        position: { x: 45, y: 5 },
        font: { family: 'Arial', size: 8 },
        color: 'white'
      });
    }

    // Zone II elements - Personal data
    const personalDataElements = this.generatePersonalDataElements(data);
    elements.push(...personalDataElements);

    // Zone III elements - Portrait and signature placeholders
    elements.push({
      zone: 'III',
      type: 'portrait',
      content: '[PORTRAIT]',
      position: zones.III.portraitArea.position,
      dimensions: zones.III.portraitArea.dimensions,
      requirements: {
        format: 'Color digital reproduction',
        background: 'Light blue or white',
        pose: 'Full-face frontal'
      }
    });

    elements.push({
      zone: 'III',
      type: 'signature',
      content: '[SIGNATURE]',
      position: { x: 2, y: 35 },
      dimensions: { width: 36, height: 8 },
      requirements: {
        format: 'Digital reproduction',
        color: 'High contrast'
      }
    });

    return elements;
  }

  /**
   * Generate non-portrait side elements
   */
  generateNonPortraitSideElements(data, zones) {
    const elements = [];

    // Zone IV - Code explanations
    elements.push({
      zone: 'IV',
      type: 'text',
      content: 'VEHICLE RESTRICTIONS',
      position: { x: 5, y: 2 },
      font: { family: 'Arial', size: 10, weight: 'bold' },
      color: 'black'
    });

    // Add vehicle class explanations
    const classExplanations = this.getVehicleClassExplanations(data.vehicleClassifications);
    classExplanations.forEach((explanation, index) => {
      elements.push({
        zone: 'IV',
        type: 'text',
        content: `${explanation.code} - ${explanation.description}`,
        position: { x: 5, y: 5 + (index * 3) },
        font: { family: 'Arial', size: 8 },
        color: 'black'
      });
    });

    // Zone V - PDF417 barcode placeholder
    elements.push({
      zone: 'V',
      type: 'barcode',
      content: '[PDF417 BARCODE]',
      position: zones.V.barcodeArea.position,
      dimensions: zones.V.barcodeArea.maxDimensions,
      format: 'PDF417',
      standard: 'ISO/IEC 15438'
    });

    return elements;
  }

  /**
   * Generate personal data elements for Zone II
   */
  generatePersonalDataElements(data) {
    const elements = [];
    let yPos = 2;
    const leftCol = 2;
    const rightCol = 25;
    const lineHeight = 3;

    // Helper function to add field
    const addField = (label, value, column = leftCol) => {
      if (value) {
        elements.push({
          zone: 'II',
          type: 'text',
          content: `${label}: ${value}`,
          position: { x: column, y: yPos },
          font: { family: 'Arial', size: 8 },
          color: 'black'
        });
        yPos += lineHeight;
      }
    };

    // Add personal information
    addField('1', data.familyName);
    addField('2', data.givenNames);
    addField('3 DOB', data.dateOfBirth);
    addField('4a Iss', data.dateOfIssue);
    addField('4b Exp', data.dateOfExpiry);
    addField('4d', data.customerIdentifier);
    addField('5 DD', data.documentDiscriminator);

    // Reset position for right column
    yPos = 2;
    addField('8', data.address, rightCol);
    addField('9', data.vehicleClassifications, rightCol);
    addField('12', data.restrictions, rightCol);
    addField('15 Sex', data.sex, rightCol);
    addField('16 Hgt', data.height, rightCol);
    addField('18 Eyes', data.eyeColor, rightCol);

    if (data.hairColor) {
      addField('19 Hair', data.hairColor, rightCol);
    }

    return elements;
  }

  /**
   * Generate layout compliance information
   */
  generateLayoutCompliance(data) {
    return {
      aamvaCompliant: true,
      standard: 'AAMVA DL/ID 2025 v1.0',
      zoneBasedLayout: true,
      iso7810Compliant: true,
      realIdCompliant: data.compliance?.realId || false
    };
  }

  /**
   * Generate color scheme based on document type
   */
  generateColorScheme(data) {
    const schemes = {
      DL: {
        primary: '#C41E3A', // Red (Pantone 198)
        primaryTint: '#E8C1CA', // 30% tint
        secondary: '#FFFFFF',
        text: '#000000'
      },
      ID: {
        primary: '#228B22', // Green (Pantone 368)
        primaryTint: '#B8D8B8', // 30% tint
        secondary: '#FFFFFF',
        text: '#000000'
      },
      CDL: {
        primary: '#C41E3A', // Red
        primaryTint: '#E8C1CA',
        secondary: '#FFFFFF',
        text: '#000000'
      },
      EDL: {
        primary: '#002868', // Navy blue
        primaryTint: '#B3BFD1',
        secondary: '#FFFFFF',
        text: '#000000'
      }
    };

    return schemes[data.documentType] || schemes.DL;
  }

  /**
   * Get document type text
   */
  getDocumentTypeText(docType) {
    const types = {
      DL: 'DRIVER LICENSE',
      ID: 'IDENTIFICATION CARD',
      CDL: 'COMMERCIAL DRIVER LICENSE',
      EDL: 'ENHANCED DRIVER LICENSE'
    };
    return types[docType] || 'DRIVER LICENSE';
  }

  /**
   * Get vehicle class explanations
   */
  getVehicleClassExplanations(classifications) {
    const explanations = {
      A: 'Any combination of vehicles',
      B: 'Large trucks, buses, tractor-trailers',
      C: 'Regular vehicles and small trucks',
      D: 'Regular operator license',
      M: 'Motorcycles'
    };

    return classifications.split('').map(code => ({
      code,
      description: explanations[code] || 'Unknown'
    }));
  }
}

module.exports = { LayoutManager };