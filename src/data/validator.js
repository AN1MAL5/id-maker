/**
 * AAMVA Data Validator
 * Validates data against AAMVA DL/ID Card Design Standard 2025 v1.0 requirements
 */

/**
 * Data validation class implementing AAMVA standards
 */
class DataValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.validatedFields = 0;
  }

  /**
   * Validate complete data set against AAMVA standards
   * @param {Object} data - Data to validate
   * @returns {Object} Validation result
   */
  validate(data) {
    this.errors = [];
    this.warnings = [];
    this.validatedFields = 0;

    // Validate mandatory data elements (Table 1)
    this.validateMandatoryElements(data);
    
    // Validate optional data elements (Table 2)
    this.validateOptionalElements(data);
    
    // Validate data formats and constraints
    this.validateDataFormats(data);
    
    // Validate compliance requirements
    this.validateCompliance(data);

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      validatedFields: this.validatedFields
    };
  }

  /**
   * Validate mandatory data elements from Table 1
   */
  validateMandatoryElements(data) {
    const mandatoryFields = [
      { field: 'familyName', maxLength: 40, type: 'ANS', required: true },
      { field: 'givenNames', maxLength: 80, type: 'ANS', required: true },
      { field: 'dateOfBirth', format: 'date', required: true },
      { field: 'dateOfIssue', format: 'date', required: true },
      { field: 'dateOfExpiry', format: 'date', required: true },
      { field: 'customerIdentifier', maxLength: 25, type: 'ANS', required: true },
      { field: 'documentDiscriminator', maxLength: 25, type: 'ANS', required: true },
      { field: 'address', maxLength: 108, type: 'ANS', required: true },
      { field: 'vehicleClassifications', maxLength: 6, type: 'ANS', required: true },
      { field: 'endorsements', maxLength: 5, type: 'ANS', required: true },
      { field: 'restrictions', maxLength: 12, type: 'ANS', required: true },
      { field: 'sex', values: ['M', 'F', 'X'], required: true },
      { field: 'height', format: 'height', required: true },
      { field: 'eyeColor', maxLength: 12, type: 'A', required: true }
    ];

    mandatoryFields.forEach(fieldDef => {
      this.validateField(data, fieldDef);
    });
  }

  /**
   * Validate optional data elements from Table 2
   */
  validateOptionalElements(data) {
    const optionalFields = [
      { field: 'hairColor', maxLength: 12, type: 'A' },
      { field: 'weight', format: 'weight' },
      { field: 'suffix', maxLength: 5, type: 'ANS' },
      { field: 'placeOfBirth', maxLength: 33, type: 'A' },
      { field: 'auditInformation', maxLength: 25, type: 'ANS' }
    ];

    optionalFields.forEach(fieldDef => {
      if (data[fieldDef.field] !== undefined && data[fieldDef.field] !== null) {
        this.validateField(data, fieldDef);
      }
    });
  }

  /**
   * Validate individual field
   */
  validateField(data, fieldDef) {
    const value = data[fieldDef.field];
    const fieldName = fieldDef.field;

    this.validatedFields++;

    // Check required fields
    if (fieldDef.required && (value === undefined || value === null || value === '')) {
      this.errors.push(`Required field '${fieldName}' is missing or empty`);
      return;
    }

    // Skip validation for optional empty fields
    if (!fieldDef.required && (value === undefined || value === null || value === '')) {
      return;
    }

    // Validate by type/format
    if (fieldDef.format) {
      this.validateFormat(fieldName, value, fieldDef.format);
    }

    if (fieldDef.type) {
      this.validateCharacterType(fieldName, value, fieldDef.type);
    }

    if (fieldDef.maxLength) {
      this.validateLength(fieldName, value, fieldDef.maxLength);
    }

    if (fieldDef.values) {
      this.validateAllowedValues(fieldName, value, fieldDef.values);
    }
  }

  /**
   * Validate data formats
   */
  validateDataFormats(data) {
    // Date format validation
    if (data.dateOfBirth) {
      this.validateDateFormat('dateOfBirth', data.dateOfBirth);
      this.validateDateRange('dateOfBirth', data.dateOfBirth, 
        new Date('1900-01-01'), new Date());
    }

    if (data.dateOfIssue) {
      this.validateDateFormat('dateOfIssue', data.dateOfIssue);
    }

    if (data.dateOfExpiry) {
      this.validateDateFormat('dateOfExpiry', data.dateOfExpiry);
      // Expiry should be after issue date
      if (data.dateOfIssue && data.dateOfExpiry) {
        const issueDate = new Date(data.dateOfIssue);
        const expiryDate = new Date(data.dateOfExpiry);
        if (expiryDate <= issueDate) {
          this.errors.push('Date of expiry must be after date of issue');
        }
      }
    }

    // Vehicle classification validation
    if (data.vehicleClassifications) {
      this.validateVehicleClassifications(data.vehicleClassifications);
    }

    // Endorsement validation
    if (data.endorsements && data.endorsements !== 'NONE') {
      this.validateEndorsements(data.endorsements);
    }
  }

  /**
   * Validate format-specific fields
   */
  validateFormat(fieldName, value, format) {
    switch (format) {
      case 'date':
        this.validateDateFormat(fieldName, value);
        break;
      case 'height':
        this.validateHeightFormat(fieldName, value);
        break;
      case 'weight':
        this.validateWeightFormat(fieldName, value);
        break;
      default:
        this.warnings.push(`Unknown format type '${format}' for field '${fieldName}'`);
    }
  }

  /**
   * Validate character types (A=alpha, N=numeric, S=special, ANS=alphanumeric+special)
   */
  validateCharacterType(fieldName, value, type) {
    const patterns = {
      'A': /^[A-Za-z\s\-'\.]*$/, // Alpha characters, spaces, hyphens, apostrophes, periods
      'N': /^[0-9]*$/, // Numeric only
      'ANS': /^[A-Za-z0-9\s\-'\.\/\,\#\&\(\)\+\*]*$/ // Alphanumeric + common special chars
    };

    if (!patterns[type]) {
      this.warnings.push(`Unknown character type '${type}' for field '${fieldName}'`);
      return;
    }

    if (!patterns[type].test(value)) {
      this.errors.push(`Field '${fieldName}' contains invalid characters for type '${type}'`);
    }
  }

  /**
   * Validate field length
   */
  validateLength(fieldName, value, maxLength) {
    if (value && value.length > maxLength) {
      this.errors.push(`Field '${fieldName}' exceeds maximum length of ${maxLength} characters`);
    }
  }

  /**
   * Validate allowed values
   */
  validateAllowedValues(fieldName, value, allowedValues) {
    if (!allowedValues.includes(value)) {
      this.errors.push(`Field '${fieldName}' has invalid value '${value}'. Allowed values: ${allowedValues.join(', ')}`);
    }
  }

  /**
   * Validate date format (MM/DD/CCYY for US)
   */
  validateDateFormat(fieldName, value) {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/([12][0-9][0-9][0-9])$/;
    if (!dateRegex.test(value)) {
      this.errors.push(`Field '${fieldName}' must be in MM/DD/CCYY format`);
    } else {
      // Validate actual date
      const [month, day, year] = value.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        this.errors.push(`Field '${fieldName}' contains an invalid date`);
      }
    }
  }

  /**
   * Validate date range
   */
  validateDateRange(fieldName, value, minDate, maxDate) {
    const date = new Date(value);
    if (date < minDate || date > maxDate) {
      this.errors.push(`Field '${fieldName}' is outside valid date range`);
    }
  }

  /**
   * Validate height format (feet and inches: 6'-01")
   */
  validateHeightFormat(fieldName, value) {
    const heightRegex = /^(\d{1})\'-(\d{2})\"$|^(\d{3}) cm$/;
    if (!heightRegex.test(value)) {
      this.errors.push(`Field '${fieldName}' must be in format "5'-10"" or "180 cm"`);
    }
  }

  /**
   * Validate weight format
   */
  validateWeightFormat(fieldName, value) {
    const weightRegex = /^(\d{1,3}) lb$|^(\d{1,3}) kg$/;
    if (!weightRegex.test(value)) {
      this.errors.push(`Field '${fieldName}' must be in format "180 lb" or "80 kg"`);
    }
  }

  /**
   * Validate vehicle classifications
   */
  validateVehicleClassifications(classifications) {
    const validClasses = ['A', 'B', 'C', 'D', 'M'];
    const classes = classifications.split('');
    
    for (const cls of classes) {
      if (!validClasses.includes(cls)) {
        this.errors.push(`Invalid vehicle classification '${cls}'`);
      }
    }
  }

  /**
   * Validate endorsements
   */
  validateEndorsements(endorsements) {
    const validEndorsements = ['H', 'N', 'P', 'S', 'T', 'X'];
    const endorsementList = endorsements.split('');
    
    for (const endorsement of endorsementList) {
      if (!validEndorsements.includes(endorsement)) {
        this.errors.push(`Invalid endorsement '${endorsement}'`);
      }
    }
  }

  /**
   * Validate compliance requirements
   */
  validateCompliance(data) {
    // Check document type
    const validDocumentTypes = ['DL', 'ID', 'CDL', 'EDL'];
    if (data.documentType && !validDocumentTypes.includes(data.documentType)) {
      this.errors.push(`Invalid document type '${data.documentType}'`);
    }

    // Check card format
    const validFormats = ['horizontal', 'vertical'];
    if (data.cardFormat && !validFormats.includes(data.cardFormat)) {
      this.errors.push(`Invalid card format '${data.cardFormat}'`);
    }

    // Validate compliance flags
    if (data.compliance) {
      if (typeof data.compliance.realId !== 'boolean' && data.compliance.realId !== undefined) {
        this.warnings.push('REAL ID compliance flag should be boolean');
      }
    }

    // Age-based format validation
    if (data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 21 && data.cardFormat === 'horizontal') {
        this.warnings.push('Horizontal format recommended for ages 21 and over');
      }
      
      if (age >= 21 && data.cardFormat === 'vertical') {
        this.warnings.push('Vertical format recommended for under 21');
      }
    }
  }

  /**
   * Validate barcode data requirements
   */
  validateBarcodeData(data) {
    // PDF417 specific validation
    const requiredBarcodeFields = [
      'familyName', 'givenNames', 'dateOfBirth', 'dateOfIssue', 
      'dateOfExpiry', 'customerIdentifier', 'documentDiscriminator'
    ];

    requiredBarcodeFields.forEach(field => {
      if (!data[field]) {
        this.errors.push(`Field '${field}' required for PDF417 barcode generation`);
      }
    });
  }
}

module.exports = { DataValidator };