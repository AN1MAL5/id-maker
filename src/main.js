#!/usr/bin/env node

/**
 * AAMVA-Compliant ID Maker
 * Main application entry point
 * 
 * Generates AAMVA DL/ID Card Design Standard 2025 v1.0 compliant identification documents
 */

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const { IDGenerator } = require('./core/id-generator');
const { DataValidator } = require('./data/validator');
const { LayoutManager } = require('./layout/layout-manager');
const { PDF417Generator } = require('./barcode/pdf417');

const program = new Command();

// CLI Configuration
program
  .name('aamva-id-maker')
  .description('AAMVA-compliant ID/Driver License generator')
  .version('1.0.0');

program
  .option('-t, --template <type>', 'template type (dl, id, enhanced)', 'dl')
  .option('-f, --format <format>', 'card format (horizontal, vertical)', 'horizontal')
  .option('-o, --output <file>', 'output file path', 'generated-id.json')
  .option('-c, --config <file>', 'configuration file path')
  .option('--interactive', 'run in interactive mode')
  .option('--validate-only', 'validate input data without generating')
  .option('--preview', 'generate preview without full processing');

program.parse();

const options = program.opts();

/**
 * Main application class
 */
class IDMakerApp {
  constructor(options) {
    this.options = options;
    this.generator = new IDGenerator();
    this.validator = new DataValidator();
    this.layoutManager = new LayoutManager();
    this.barcodeGenerator = new PDF417Generator();
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log('🆔 AAMVA ID Maker v1.0.0');
    console.log('📋 Initializing AAMVA DL/ID Card Design Standard 2025 v1.0 compliance...\n');

    // Load configuration if provided
    if (this.options.config) {
      await this.loadConfig(this.options.config);
    }

    return this;
  }

  /**
   * Load configuration from file
   */
  async loadConfig(configPath) {
    try {
      const configData = await fs.promises.readFile(configPath, 'utf8');
      this.config = JSON.parse(configData);
      console.log(`✅ Configuration loaded from ${configPath}`);
    } catch (error) {
      console.error(`❌ Error loading configuration: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Run the application
   */
  async run() {
    try {
      if (this.options.interactive) {
        return await this.runInteractive();
      }

      // Load sample data for demo purposes
      const sampleData = this.generateSampleData();
      
      if (this.options.validateOnly) {
        return await this.validateOnly(sampleData);
      }

      // Generate ID document
      const result = await this.generate(sampleData);
      
      // Save output
      await this.saveOutput(result);
      
      console.log(`✅ ID document generated successfully!`);
      console.log(`📄 Output saved to: ${this.options.output}`);
      
      return result;
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Run in interactive mode
   */
  async runInteractive() {
    console.log('🎯 Interactive Mode - Enter ID information:\n');
    
    // This would implement interactive prompts
    // For now, using sample data
    const sampleData = this.generateSampleData();
    console.log('📝 Using sample data for demonstration...\n');
    
    return await this.generate(sampleData);
  }

  /**
   * Generate sample data for testing
   */
  generateSampleData() {
    return {
      // Mandatory Data Elements (Table 1)
      familyName: 'SAMPLE',
      givenNames: 'JOHN MICHAEL',
      dateOfBirth: '03/15/1985',
      dateOfIssue: '09/26/2025',
      dateOfExpiry: '03/15/2030',
      customerIdentifier: 'D12345678901234567890',
      documentDiscriminator: '2025092612345',
      address: '123 MAIN STREET, ANYTOWN, ST 12345',
      vehicleClassifications: 'D',
      endorsements: 'NONE',
      restrictions: 'NONE',
      sex: 'M',
      height: '5\'-10\"',
      eyeColor: 'BRO',
      
      // Optional Data Elements (Table 2)
      hairColor: 'BRN',
      weight: '180 lb',
      suffix: '',
      
      // Document Type
      documentType: this.options.template.toUpperCase(),
      cardFormat: this.options.format,
      
      // Compliance Information
      compliance: {
        realId: true,
        aamvaVersion: '11',
        jurisdictionVersion: '00'
      }
    };
  }

  /**
   * Validate data only
   */
  async validateOnly(data) {
    console.log('🔍 Validating data against AAMVA standards...\n');
    
    const validation = this.validator.validate(data);
    
    if (validation.isValid) {
      console.log('✅ All data elements are valid');
      console.log(`📊 Validated ${validation.validatedFields} fields`);
    } else {
      console.log('❌ Validation failed:');
      validation.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
    }
    
    return validation;
  }

  /**
   * Generate ID document
   */
  async generate(data) {
    console.log('🏗️  Generating AAMVA-compliant ID document...\n');
    
    // Step 1: Validate input data
    console.log('1️⃣  Validating data elements...');
    const validation = this.validator.validate(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    console.log('   ✅ Data validation passed');

    // Step 2: Generate layout
    console.log('2️⃣  Generating card layout...');
    const layout = this.layoutManager.generateLayout(data);
    console.log(`   ✅ ${data.cardFormat} layout generated with ${Object.keys(layout.zones).length} zones`);

    // Step 3: Generate PDF417 barcode
    console.log('3️⃣  Generating PDF417 2D barcode...');
    const barcode = this.barcodeGenerator.generate(data);
    console.log(`   ✅ PDF417 barcode generated (${barcode.dataLength} bytes)`);

    // Step 4: Compile final document
    console.log('4️⃣  Compiling final document...');
    const document = this.generator.compile({
      data,
      layout,
      barcode,
      metadata: {
        generatedAt: new Date().toISOString(),
        standard: 'AAMVA DL/ID 2025 v1.0',
        template: this.options.template,
        format: this.options.format
      }
    });
    
    console.log('   ✅ Document compilation complete\n');
    
    return document;
  }

  /**
   * Save output to file
   */
  async saveOutput(result) {
    const outputPath = path.resolve(this.options.output);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    await fs.promises.mkdir(outputDir, { recursive: true });
    
    // Save the result
    await fs.promises.writeFile(outputPath, JSON.stringify(result, null, 2));
  }
}

/**
 * Application entry point
 */
async function main() {
  try {
    const app = new IDMakerApp(options);
    await app.init();
    await app.run();
  } catch (error) {
    console.error(`💥 Fatal error: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { IDMakerApp };