#!/usr/bin/env node

/**
 * AAMVA ID Maker - Basic Usage Example
 * Demonstrates how to generate AAMVA-compliant ID documents
 */

const { IDMakerApp } = require('../src/main');

async function basicExample() {
  console.log('🆔 AAMVA ID Maker - Basic Usage Example\n');
  
  try {
    // Initialize the ID Maker
    const app = new IDMakerApp({
      template: 'dl',
      format: 'horizontal',
      output: './output/example-driver-license.json'
    });

    await app.init();
    
    // Generate with default sample data
    console.log('📝 Generating sample driver\'s license...\n');
    const result = await app.run();
    
    console.log('✅ Generation completed successfully!\n');
    
    // Display some key information
    console.log('📊 Document Summary:');
    console.log(`   • Document Type: ${result.humanReadable.zoneI.documentType}`);
    console.log(`   • Cardholder: ${result.humanReadable.zoneII.givenNames} ${result.humanReadable.zoneII.familyName}`);
    console.log(`   • Format: ${result.layout.format}`);
    console.log(`   • REAL ID Compliant: ${result.compliance.realId ? 'Yes' : 'No'}`);
    console.log(`   • PDF417 Data Length: ${result.machineReadable.zoneV.pdf417.dataLength} bytes`);
    console.log(`   • Generated: ${result.metadata.generatedAt}\n`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function customDataExample() {
  console.log('🎯 Custom Data Example\n');
  
  const customData = {
    // Mandatory Data Elements
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
    
    // Optional Data Elements
    hairColor: 'BRN',
    weight: '195 lb',
    suffix: '',
    
    // Document Configuration
    documentType: 'DL',
    cardFormat: 'horizontal',
    
    // Compliance Information
    compliance: {
      realId: true,
      aamvaVersion: '11',
      jurisdictionVersion: '00'
    }
  };
  
  try {
    const { DataValidator } = require('../src/data/validator');
    const { LayoutManager } = require('../src/layout/layout-manager');
    const { PDF417Generator } = require('../src/barcode/pdf417');
    const { IDGenerator } = require('../src/core/id-generator');
    
    // Step-by-step generation process
    console.log('1️⃣  Validating custom data...');
    const validator = new DataValidator();
    const validation = validator.validate(customData);
    
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    console.log('   ✅ Data validation passed\n');
    
    console.log('2️⃣  Generating layout...');
    const layoutManager = new LayoutManager();
    const layout = layoutManager.generateLayout(customData);
    console.log(`   ✅ ${layout.format} layout generated with ${Object.keys(layout.zones).length} zones\n`);
    
    console.log('3️⃣  Generating PDF417 barcode...');
    const barcodeGenerator = new PDF417Generator();
    const barcode = barcodeGenerator.generate(customData);
    console.log(`   ✅ PDF417 barcode generated (${barcode.dataLength} bytes)\n`);
    
    console.log('4️⃣  Compiling final document...');
    const idGenerator = new IDGenerator();
    const document = idGenerator.compile({
      data: customData,
      layout,
      barcode,
      metadata: {
        generatedAt: new Date().toISOString(),
        template: 'dl',
        format: 'horizontal'
      }
    });
    console.log('   ✅ Document compilation complete\n');
    
    // Save to file
    const fs = require('fs').promises;
    await fs.writeFile('./output/custom-example.json', JSON.stringify(document, null, 2));
    console.log('💾 Saved to ./output/custom-example.json\n');
    
    return document;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function validationExample() {
  console.log('🔍 Data Validation Example\n');
  
  // Example with invalid data
  const invalidData = {
    familyName: 'SMITH',
    givenNames: 'JOHN',
    dateOfBirth: '13/45/2000', // Invalid date
    dateOfIssue: '09/26/2025',
    dateOfExpiry: '09/25/2025', // Before issue date
    sex: 'Z', // Invalid sex code
    height: 'tall' // Invalid format
  };
  
  try {
    const { DataValidator } = require('../src/data/validator');
    const validator = new DataValidator();
    const validation = validator.validate(invalidData);
    
    console.log('Validation Result:');
    console.log(`   • Valid: ${validation.isValid}`);
    console.log(`   • Fields Validated: ${validation.validatedFields}`);
    
    if (!validation.isValid) {
      console.log('   • Errors:');
      validation.errors.forEach(error => {
        console.log(`     - ${error}`);
      });
    }
    
    if (validation.warnings.length > 0) {
      console.log('   • Warnings:');
      validation.warnings.forEach(warning => {
        console.log(`     - ${warning}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function barcodeExample() {
  console.log('📱 PDF417 Barcode Example\n');
  
  try {
    const { PDF417Generator } = require('../src/barcode/pdf417');
    const generator = new PDF417Generator();
    
    // Generate example barcode data
    const result = generator.generateExampleData();
    
    console.log('PDF417 Barcode Information:');
    console.log(`   • Data Length: ${result.dataLength} bytes`);
    console.log(`   • AAMVA Version: ${result.aamvaVersion}`);
    console.log(`   • Error Correction Level: ${result.compliance.errorCorrectionLevel}`);
    console.log(`   • Estimated Dimensions: ${result.specifications.estimatedDimensions.width.toFixed(2)}mm x ${result.specifications.estimatedDimensions.height.toFixed(2)}mm`);
    console.log(`   • X-Dimension: ${result.specifications.specifications.xDimension}mm`);
    
    // Show first 200 characters of barcode data
    console.log(`   • Sample Data: ${result.data.substring(0, 200)}...`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 AAMVA ID Maker Examples\n');
  console.log('=' .repeat(50) + '\n');
  
  // Ensure output directory exists
  const fs = require('fs').promises;
  try {
    await fs.mkdir('./output', { recursive: true });
  } catch (error) {
    // Directory already exists
  }
  
  // Run examples
  await basicExample();
  console.log('=' .repeat(50) + '\n');
  
  await customDataExample();
  console.log('=' .repeat(50) + '\n');
  
  await validationExample();
  console.log('=' .repeat(50) + '\n');
  
  await barcodeExample();
  console.log('=' .repeat(50) + '\n');
  
  console.log('✅ All examples completed successfully!');
  console.log('📁 Check the ./output directory for generated files.');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  basicExample,
  customDataExample,
  validationExample,
  barcodeExample
};