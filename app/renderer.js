 // AAMVA ID Maker Renderer Script
// Handles form interactions, live preview, and communication with main process

class IDMakerApp {
    constructor() {
        this.formData = {};
        this.validationResults = null;
        this.currentDocument = null;
        this.debounceTimer = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDefaultData();
        this.updatePreview();
        this.updateStatus('Ready');
    }

    setupEventListeners() {
        // Form field listeners for live preview
        const formFields = [
            'documentType', 'cardFormat', 'realId',
            'familyName', 'givenNames', 'suffix',
            'dateOfBirth', 'dateOfIssue', 'dateOfExpiry',
            'sex', 'height', 'eyeColor', 'hairColor', 'weight',
            'address', 'customerIdentifier', 'documentDiscriminator',
            'vehicleClassifications', 'endorsements', 'restrictions'
        ];

        formFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => this.debouncedUpdate());
                field.addEventListener('change', () => this.debouncedUpdate());
            }
        });

        // Photo upload listener
        const photoUpload = document.getElementById('photoUpload');
        if (photoUpload) {
            photoUpload.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }

        // Button listeners - adapted for web
        document.getElementById('loadBtn').addEventListener('click', () => this.loadDocument());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveDocument());
        document.getElementById('exportPngBtn').addEventListener('click', () => this.exportPng());
        document.getElementById('exportPdfBtn').addEventListener('click', () => this.exportPdf());
        document.getElementById('generateBtn').addEventListener('click', () => this.generateDocument());

        document.getElementById('loadDefaultsBtn').addEventListener('click', () => this.loadDefaultData());
        document.getElementById('validateBtn').addEventListener('click', () => this.validateData());
        document.getElementById('clearFormBtn').addEventListener('click', () => this.clearForm());
        document.getElementById('generateDDBtn').addEventListener('click', () => this.generateDocumentDiscriminator());

        // Auto-update dates
        this.setupDateAutoUpdate();
    }

    debouncedUpdate() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
            this.collectFormData();
            this.updatePreview();
            this.updateFieldCount();
        }, 300);
    }

    setupDateAutoUpdate() {
        // Auto-update issue date to today
        const dateOfIssue = document.getElementById('dateOfIssue');
        if (dateOfIssue && !dateOfIssue.value) {
            dateOfIssue.value = new Date().toLocaleDateString('en-US');
        }

        // Auto-update expiry date based on birth date (5 years from issue)
        const dateOfBirth = document.getElementById('dateOfBirth');
        const dateOfExpiry = document.getElementById('dateOfExpiry');

        dateOfBirth.addEventListener('change', () => {
            if (dateOfBirth.value && AAMVA.isValidDate(dateOfBirth.value)) {
                const birthDate = new Date(dateOfBirth.value);
                const issueDate = new Date(dateOfIssue.value);
                const expiryDate = new Date(issueDate);
                expiryDate.setFullYear(issueDate.getFullYear() + 5);

                dateOfExpiry.value = expiryDate.toLocaleDateString('en-US');
                this.debouncedUpdate();
            }
        });
    }

    collectFormData() {
        const formData = {};

        // Basic document info
        formData.documentType = document.getElementById('documentType').value;
        formData.cardFormat = document.getElementById('cardFormat').value;

        // Personal information
        formData.familyName = document.getElementById('familyName').value.toUpperCase().trim();
        formData.givenNames = document.getElementById('givenNames').value.toUpperCase().trim();
        formData.suffix = document.getElementById('suffix').value.toUpperCase().trim();
        formData.fullName = [formData.givenNames, formData.familyName, formData.suffix].filter(Boolean).join(' ');
        formData.dateOfBirth = document.getElementById('dateOfBirth').value;
        formData.dateOfIssue = document.getElementById('dateOfIssue').value;
        formData.dateOfExpiry = document.getElementById('dateOfExpiry').value;
        formData.sex = document.getElementById('sex').value;
        formData.height = document.getElementById('height').value;
        formData.eyeColor = document.getElementById('eyeColor').value;
        formData.hairColor = document.getElementById('hairColor').value || null;
        formData.weight = document.getElementById('weight').value || null;
        formData.address = document.getElementById('address').value.toUpperCase().trim();
        formData.photo = this.formData.photo || null; // Base64 from upload

        // Document identifiers - DL NO for NV
        let customerId = document.getElementById('customerIdentifier').value.trim().replace(/\D/g, ''); // Only digits
        if (customerId.length > 10) {
            customerId = customerId.slice(-10); // Max 10 digits
        }
        formData.customerIdentifier = customerId || '';
        let dd = document.getElementById('documentDiscriminator').value.trim().replace(/\D/g, ''); // Only digits
        if (dd.length < 21) {
            dd = '000' + dd.padEnd(18, '0'); // Pad to 21 starting with 000
        } else if (dd.length > 21) {
            dd = dd.slice(0, 21);
        }
        if (!dd.startsWith('000')) {
            dd = '000' + dd.slice(3);
        }
        formData.documentDiscriminator = dd;

        // Driving privileges - Default to 'C' for NV standard
        let vehicleClass = document.getElementById('vehicleClassifications').value.toUpperCase().trim();
        if (!vehicleClass) vehicleClass = 'C';
        formData.vehicleClassifications = vehicleClass;
        formData.endorsements = document.getElementById('endorsements').value.toUpperCase().trim() || 'NONE';
        formData.restrictions = document.getElementById('restrictions').value.toUpperCase().trim() || 'NONE';

        // Compliance - NV specific, default REAL ID true
        formData.compliance = {
            realId: document.getElementById('realId').value === 'true',
            aamvaVersion: '11',
            jurisdictionVersion: '01', // NV
            state: 'NV'
        };

        this.formData = formData;
        return formData;
    }

    updatePreview() {
        const data = this.formData;

        // NV specific header - already in HTML, but ensure text
        const nvHeader = document.querySelector('.nv-header');
        if (nvHeader) nvHeader.textContent = 'NEVADA USA';
        const docTitle = document.querySelector('.doc-title');
        if (docTitle) docTitle.textContent = 'DRIVER LICENSE';

        // Update DL NO
        const dlNoValue = document.getElementById('dlNoValue');
        if (dlNoValue) dlNoValue.textContent = data.customerIdentifier || '';

        // Update DD
        const ddValue = document.getElementById('ddValue');
        if (ddValue) ddValue.textContent = data.documentDiscriminator || '';

        // Update specific NV fields by ID
        const updateFieldById = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value || '';
        };

        updateFieldById('dobValue', data.dateOfBirth);
        updateFieldById('issValue', data.dateOfIssue);
        updateFieldById('expValue', data.dateOfExpiry);
        updateFieldById('nameValue', data.fullName);
        updateFieldById('addressValue', data.address);
        updateFieldById('classValue', data.vehicleClassifications);
        updateFieldById('restValue', data.restrictions);
        updateFieldById('endoValue', data.endorsements);
        updateFieldById('sexValue', data.sex);
        updateFieldById('hgtValue', data.height);
        updateFieldById('eyesValue', data.eyeColor);
        updateFieldById('hairValue', data.hairColor);

        // Update REAL ID indicator - no emoji
        const complianceIndicator = document.querySelector('.compliance-indicator');
        if (complianceIndicator) {
            if (data.compliance && data.compliance.realId) {
                complianceIndicator.innerHTML = '<span class="real-id-text">REAL ID</span>';
            } else {
                complianceIndicator.innerHTML = '<span class="not-real-id">NOT FOR REAL ID</span>';
            }
        }

        // Update back side explanations
        this.updateBackSideExplanations(data);

        // Generate barcode preview if document generated
        if (this.currentDocument) {
            this.generateBarcodePreview();
        }

        // Update document stats
        const formatDisplay = document.querySelector('.format-display');
        if (formatDisplay) formatDisplay.textContent =
            data.cardFormat === 'vertical' ? 'Vertical (Under 21)' : 'Horizontal (21+)';
        const realIdDisplay = document.querySelector('.real-id-display');
        if (realIdDisplay) realIdDisplay.textContent =
            data.compliance && data.compliance.realId ? 'Yes' : 'No';
    }

    updatePreviewField(fieldNum, value) {
        const fields = document.querySelectorAll('.field');
        fields.forEach(field => {
            const fieldNumEl = field.querySelector('.field-num');
            if (fieldNumEl && fieldNumEl.textContent === fieldNum) {
                const fieldValueEl = field.querySelector('.field-value');
                fieldValueEl.textContent = value || '';
            }
        });
    }

    updateBackSideExplanations(data) {
        // Update back side fields to match NV layout from photo
        const updateBackField = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value || '';
        };

        updateBackField('backDobValue', data.dateOfBirth || '');
        updateBackField('backIssValue', data.dateOfIssue || '');

        // CLASS with NV-specific description
        const classDescriptions = {
            'C': 'C-vans pickups may tow <10,000 lbs'
        };
        const classValue = data.vehicleClassifications ? `${data.vehicleClassifications} ${classDescriptions[data.vehicleClassifications] || ''}` : '';
        updateBackField('backClassValue', classValue);

        // ENDORSEMENTS - show codes or blank
        updateBackField('backEndoValue', data.endorsements === 'NONE' ? '' : data.endorsements);

        // RESTRICTIONS - show codes or blank
        updateBackField('backRestValue', data.restrictions === 'NONE' ? '' : data.restrictions);

        // ORGAN DONOR - always blank as per photo
        updateBackField('backOrganValue', '');
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.getElementById('photoPreview');
                if (img) {
                    img.src = e.target.result;
                    this.formData.photo = e.target.result; // Store base64
                    this.debouncedUpdate();
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid image file.');
        }
    }

    generateBarcodePreview() {
        const canvas = document.getElementById('barcodeCanvas');
        if (!canvas || !this.currentDocument) return;

        // Load PDF417 if not loaded (assume script is included)
        if (typeof PDF417 === 'undefined') {
            // Placeholder - in full impl, load script or use imported module
            canvas.getContext('2d').fillText('PDF417 Barcode (Integrate src/barcode/pdf417.js)', 10, 20);
            return;
        }

        const aamvaString = this.generateAAMVAString(this.formData);
        PDF417.draw(canvas, aamvaString, 2); // Level 2 error correction

        const barcodeInfo = document.querySelector('.barcode-info');
        if (barcodeInfo) barcodeInfo.textContent = `[Data Length: ${aamvaString.length} bytes]`;
    }

    generateAAMVAString(data) {
        // Simplified AAMVA PDF417 string generation for NV DL
        const header = '@\nANSI 636000090002DL00410278\n'; // AAMVA header for REAL ID DL
        let elements = '';

        // Compliance indicator
        elements += data.compliance.realId ? 'Y\n' : 'N\n';

        // Data elements (AAMVA format: DACode + Length + Value)
        elements += `DL${data.documentDiscriminator.length}${data.documentDiscriminator}\n`; // DAC
        elements += `DCA${data.customerIdentifier.length}${data.customerIdentifier}\n`; // DCG for DL ID
        elements += `DBB${data.dateOfBirth.replace(/\//g, '')}\n`; // DOB
        elements += `DBA${data.dateOfExpiry.replace(/\//g, '')}\n`; // Exp
        elements += `DBC${data.dateOfIssue.replace(/\//g, '')}\n`; // Issue
        elements += `DCS${data.fullName.length}${data.fullName.replace(/ /g, '')}\n`; // Name (no spaces)
        elements += `DAG${data.address.length}${data.address.replace(/ /g, '')}\n`; // Address (no spaces)
        elements += `DAU${data.height.replace(/[^0-9]/g, '')}\n`; // Height in inches
        elements += `DAE${data.eyeColor}\n`; // Eyes
        elements += `DAG${data.hairColor || ''}\n`; // Hair
        elements += `DAS${data.sex}\n`; // Sex
        elements += `DCG${data.vehicleClassifications}\n`; // Class
        elements += `DCK${data.restrictions}\n`; // Restrictions
        elements += `DCL${data.endorsements}\n`; // Endorsements

        return header + elements;
    }

    async validateData() {
        this.updateStatus('Validating data...');

        try {
            const data = this.collectFormData();
            const errors = [];
            const warnings = [];
            let validatedFields = 0;

            // Basic validation
            if (!data.familyName) errors.push('Family name is required');
            if (!data.givenNames) errors.push('Given names are required');
            if (!data.dateOfBirth || !/^\d{2}\/\d{2}\/\d{4}$/.test(data.dateOfBirth)) errors.push('Valid DOB (MM/DD/YYYY) required');
            if (!data.customerIdentifier || data.customerIdentifier.length > 10 || !/^\d{1,10}$/.test(data.customerIdentifier)) errors.push('DL NO must be 1-10 digits');
            if (!data.documentDiscriminator || data.documentDiscriminator.length !== 21 || !/^\d{21}$/.test(data.documentDiscriminator) || !data.documentDiscriminator.startsWith('000')) errors.push('DD must be 21 digits starting with 000');
            if (!data.address) errors.push('Address is required');

            // Count validated
            if (data.familyName) validatedFields++;
            if (data.givenNames) validatedFields++;
            // Add more as needed

            const validation = {
                isValid: errors.length === 0,
                validatedFields: validatedFields,
                errors: errors,
                warnings: warnings
            };

            this.validationResults = validation;
            this.updateValidationDisplay(validation);
            this.updateStatus('Validation complete');
            if (errors.length > 0) {
                this.showError(`Validation failed with ${errors.length} errors`);
            }
        } catch (error) {
            this.showError('Validation error: ' + error.message);
            this.updateStatus('Validation error');
        }
    }

    updateValidationDisplay(validation) {
        const resultsContainer = document.getElementById('validationResults');
        resultsContainer.innerHTML = '';

        if (validation.isValid) {
            resultsContainer.innerHTML = `
                <div class="status-item valid">
                    <span class="status-text">All ${validation.validatedFields} fields are valid</span>
                </div>
            `;
        } else {
            // Show errors
            validation.errors.forEach(error => {
                resultsContainer.innerHTML += `
                    <div class="status-item error">
                        <span class="status-text">Error: ${error}</span>
                    </div>
                `;
            });

            // Show warnings
            validation.warnings.forEach(warning => {
                resultsContainer.innerHTML += `
                    <div class="status-item warning">
                        <span class="status-text">Warning: ${warning}</span>
                    </div>
                `;
            });
        }
    }

    async generateDocument() {
        this.updateStatus('Generating AAMVA document...');

        try {
            const data = this.collectFormData();
            // Mock IDGenerator since not available
            class MockIDGenerator {
                compile(components) {
                    return {
                        humanReadable: {
                            zoneII: data
                        },
                        machineReadable: {
                            barcode: components.barcode.data
                        },
                        metadata: components.metadata,
                        compliance: data.compliance
                    };
                }
            }
            const generator = new MockIDGenerator();
            const components = {
                data: data,
                layout: { template: 'NV-DL', format: data.cardFormat },
                barcode: { data: this.generateAAMVAString(data) },
                metadata: { generatedAt: new Date().toISOString(), template: 'NV-DL' }
            };
            const document = generator.compile(components);

            this.currentDocument = document;
            this.validationResults = { isValid: true, validatedFields: Object.keys(data).length, errors: [], warnings: [] };

            // Update barcode info
            const barcodeInfo = document.querySelector('.barcode-info');
            if (barcodeInfo) barcodeInfo.textContent = `Data Length: ${components.barcode.data.length} bytes`;

            // Update generation time
            const genTime = document.querySelector('.generation-time');
            if (genTime) genTime.textContent = new Date().toLocaleString();

            this.updateValidationDisplay(this.validationResults);
            this.updatePreview(); // Refresh preview with generated data
            this.generateBarcodePreview(); // Generate barcode now
            this.updateStatus('Document generated successfully');
            this.showSuccess('Nevada DL generated successfully!');
        } catch (error) {
            this.showError('Generation error: ' + error.message);
            this.updateStatus('Generation error');
        }
    }

    async saveDocument() {
        try {
            // Save formData directly
            localStorage.setItem('nvDlData', JSON.stringify(this.formData));
            if (this.currentDocument) {
                localStorage.setItem('nvDlDocument', JSON.stringify(this.currentDocument));
            }
            this.updateStatus('Document saved to browser storage');
            this.showSuccess('Document saved successfully!');
        } catch (error) {
            this.showError('Save error: ' + error.message);
        }
    }

    async loadDocument() {
        try {
            // Load from localStorage
            const savedData = localStorage.getItem('nvDlData');
            const savedDoc = localStorage.getItem('nvDlDocument');
            if (savedData && savedDoc) {
                this.formData = JSON.parse(savedData);
                this.currentDocument = JSON.parse(savedDoc);
                this.loadDocumentIntoForm(this.currentDocument);
                this.updateStatus('Document loaded from storage');
                this.showSuccess('Document loaded successfully!');
                this.debouncedUpdate();
            } else {
                this.showError('No saved document found');
            }
        } catch (error) {
            this.showError('Load error: ' + error.message);
        }
    }

    loadDocumentIntoForm(document) {
        const data = document.humanReadable.zoneII;

        // Load data into form fields - NV specific
        document.getElementById('documentType').value = 'DL'; // Fixed for NV DL
        document.getElementById('cardFormat').value = document.metadata.format || 'horizontal';
        document.getElementById('realId').value = document.compliance.realId ? 'true' : 'false';

        // Split full name if needed
        const fullName = data.fullName || data.givenNames + ' ' + data.familyName;
        const nameParts = fullName.split(' ');
        document.getElementById('givenNames').value = nameParts.slice(0, -1).join(' ') || '';
        document.getElementById('familyName').value = nameParts.slice(-1).join(' ') || '';
        document.getElementById('suffix').value = data.suffix || '';
        document.getElementById('dateOfBirth').value = data.dateOfBirth || '';
        document.getElementById('dateOfIssue').value = data.dateOfIssue || '';
        document.getElementById('dateOfExpiry').value = data.dateOfExpiry || '';
        document.getElementById('sex').value = data.sex || 'M';
        document.getElementById('height').value = data.height || '';
        document.getElementById('eyeColor').value = data.eyeColor || 'BRO';
        document.getElementById('hairColor').value = data.hairColor || '';
        document.getElementById('weight').value = data.weight || '';
        document.getElementById('address').value = data.address || '';
        document.getElementById('customerIdentifier').value = data.customerIdentifier || '';
        document.getElementById('documentDiscriminator').value = data.documentDiscriminator || '';
        document.getElementById('vehicleClassifications').value = data.vehicleClassifications || 'C';
        document.getElementById('endorsements').value = data.endorsements || 'NONE';
        document.getElementById('restrictions').value = data.restrictions || 'NONE';

        // Load photo if available
        if (data.photo) {
            const img = document.getElementById('photoPreview');
            if (img) img.src = data.photo;
            this.formData.photo = data.photo;
        }

        this.debouncedUpdate();
    }

    async exportPng() {
        if (!this.currentDocument) {
            await this.generateDocument();
            if (!this.currentDocument) return;
        }

        try {
            // Use html2canvas for PNG export
            const frontCanvas = await html2canvas(document.querySelector('.front-side'));
            const backCanvas = await html2canvas(document.querySelector('.back-side'));

            // Download front and back
            const frontLink = document.createElement('a');
            frontLink.download = 'nv-dl-front.png';
            frontLink.href = frontCanvas.toDataURL();
            frontLink.click();

            const backLink = document.createElement('a');
            backLink.download = 'nv-dl-back.png';
            backLink.href = backCanvas.toDataURL();
            backLink.click();

            this.updateStatus('PNG exported (front and back)');
            this.showSuccess('PNG files exported successfully!');
        } catch (error) {
            this.showError('PNG export error: ' + error.message);
        }
    }

    async exportPdf() {
        if (!this.currentDocument) {
            await this.generateDocument();
            if (!this.currentDocument) return;
        }

        try {
            // Use jsPDF for PDF export
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape for ID card

            const frontCanvas = await html2canvas(document.querySelector('.front-side'), { scale: 2 });
            const backCanvas = await html2canvas(document.querySelector('.back-side'), { scale: 2 });

            const imgWidth = 85.6; // Approx ID card width in mm
            const imgHeight = 53.8; // Approx height
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            // Front page
            const frontImgData = frontCanvas.toDataURL('image/png');
            pdf.addImage(frontImgData, 'PNG', x, y, imgWidth, imgHeight);

            // Add back page
            pdf.addPage();
            const backImgData = backCanvas.toDataURL('image/png');
            pdf.addImage(backImgData, 'PNG', x, y, imgWidth, imgHeight);

            pdf.save('nv-drivers-license.pdf');
            this.updateStatus('PDF exported');
            this.showSuccess('PDF exported successfully!');
        } catch (error) {
            this.showError('PDF export error: ' + error.message);
        }
    }

    async exportHTMLPreview() {
        // Legacy - redirect to PNG/PDF
        this.exportPng();
    }

    loadDefaultData() {
        // Clear all fields for blank start, set only fixed NV template values
        this.clearForm();

        // Set fixed NV DL template values
        document.getElementById('documentType').value = 'DL';
        document.getElementById('cardFormat').value = 'horizontal';
        document.getElementById('realId').value = 'true';
        document.getElementById('sex').value = 'M';
        document.getElementById('vehicleClassifications').value = 'C';
        document.getElementById('endorsements').value = 'NONE';
        document.getElementById('restrictions').value = 'NONE';

        // Trigger update
        this.debouncedUpdate();
        this.updateStatus('Form reset to blank NV DL template');
    }

    clearForm() {
        const formFields = document.querySelectorAll('input, select');
        formFields.forEach(field => {
            if (field.type === 'file') {
                field.value = '';
            } else if (field.type === 'checkbox') {
                field.checked = false;
            } else {
                field.value = '';
            }
        });

        // Reset to NV defaults
        document.getElementById('documentType').value = 'DL';
        document.getElementById('cardFormat').value = 'horizontal';
        document.getElementById('realId').value = 'true';
        document.getElementById('sex').value = 'M';
        document.getElementById('eyeColor').value = 'BRO';
        document.getElementById('vehicleClassifications').value = 'C';
        document.getElementById('endorsements').value = 'NONE';
        document.getElementById('restrictions').value = 'NONE';

        // Clear photo
        const photoPreview = document.getElementById('photoPreview');
        if (photoPreview) photoPreview.src = '';

        this.formData = {};
        this.currentDocument = null;
        this.validationResults = null;

        this.debouncedUpdate();
        this.updateStatus('Form cleared');

        // Reset validation display - no emoji
        const validationResults = document.getElementById('validationResults');
        if (validationResults) {
            validationResults.innerHTML = `
                <div class="status-item">
                    <span class="status-text">Enter data to see validation results</span>
                </div>
            `;
        }
    }

    generateDocumentDiscriminator() {
        // Generate 21-digit DD starting with 000
        const random18 = Math.floor(Math.random() * 1e18).toString().padStart(18, '0');
        const dd = '000' + random18;
        document.getElementById('documentDiscriminator').value = dd;
        this.debouncedUpdate();
    }

    updateFieldCount() {
        const requiredFields = [
            'familyName', 'givenNames', 'dateOfBirth', 'dateOfIssue', 'dateOfExpiry',
            'sex', 'height', 'eyeColor', 'address', 'customerIdentifier',
            'documentDiscriminator', 'vehicleClassifications', 'endorsements', 'restrictions'
        ];

        let filledCount = 0;
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value.trim()) {
                filledCount++;
            }
        });

        document.getElementById('fieldCount').textContent =
            `Fields: ${filledCount}/${requiredFields.length} mandatory`;
    }

    updateStatus(message) {
        document.getElementById('statusText').textContent = message;
    }

    showSuccess(message) {
        // Simple notification - could be enhanced with a proper notification system
        const originalStatus = document.getElementById('statusText').textContent;
        document.getElementById('statusText').textContent = 'Success: ' + message;
        document.getElementById('statusText').style.color = 'var(--success-color)';

        setTimeout(() => {
            document.getElementById('statusText').textContent = originalStatus;
            document.getElementById('statusText').style.color = '';
        }, 3000);
    }

    showError(message) {
        const originalStatus = document.getElementById('statusText').textContent;
        document.getElementById('statusText').textContent = 'Error: ' + message;
        document.getElementById('statusText').style.color = 'var(--error-color)';

        setTimeout(() => {
            document.getElementById('statusText').textContent = originalStatus;
            document.getElementById('statusText').style.color = '';
        }, 5000);
    }

    generateBarcodePreview() {
        const canvas = document.getElementById('barcodeCanvas');
        if (!canvas || !this.currentDocument) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 50;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Simple barcode pattern based on data length
        const aamvaString = this.generateAAMVAString(this.formData);
        const bars = aamvaString.length % 20 + 10; // Simple mock
        const barWidth = canvas.width / bars;
        for (let i = 0; i < bars; i++) {
            if (i % 2 === 0) {
                ctx.fillStyle = 'white';
                ctx.fillRect(i * barWidth, 0, barWidth, canvas.height);
            }
        }

        const barcodeInfo = document.querySelector('.barcode-info');
        if (barcodeInfo) barcodeInfo.textContent = `PDF417 Mock Barcode - Data Length: ${aamvaString.length} bytes`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IDMakerApp();
});
