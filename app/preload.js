// Commented out for pure web app conversion
// This file was used for Electron preload functionality
// const { contextBridge, ipcRenderer } = require('electron');

// // Expose protected methods that allow the renderer process to use
// // the ipcRenderer without exposing the entire object
// contextBridge.exposeInMainWorld('electronAPI', {
//   // AAMVA document operations
//   validateData: (data) => ipcRenderer.invoke('validate-data', data),
//   generateLayout: (data) => ipcRenderer.invoke('generate-layout', data),
//   generateBarcode: (data) => ipcRenderer.invoke('generate-barcode', data),
//   generateDocument: (data) => ipcRenderer.invoke('generate-document', data),

//   // File operations
//   saveDocument: (document) => ipcRenderer.invoke('save-document', document),
//   loadDocument: () => ipcRenderer.invoke('load-document'),
//   exportHTMLPreview: (document) => ipcRenderer.invoke('export-html-preview', document),

//   // Utility functions
//   getCurrentDateTime: () => new Date().toISOString(),
//   formatDate: (date) => {
//     const d = new Date(date);
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const day = String(d.getDate()).padStart(2, '0');
//     const year = d.getFullYear();
//     return `${month}/${day}/${year}`;
//   }
// });

// // Expose AAMVA constants and helpers
// contextBridge.exposeInMainWorld('AAMVA', {
//   // Document types
//   DOCUMENT_TYPES: {
//     DL: 'Driver License',
//     ID: 'Identification Card',
//     CDL: 'Commercial Driver License',
//     EDL: 'Enhanced Driver License'
//   },

//   // Card formats
//   CARD_FORMATS: {
//     horizontal: 'Horizontal (21+)',
//     vertical: 'Vertical (Under 21)'
//   },

//   // Eye color codes
//   EYE_COLORS: {
//     BRO: 'Brown',
//     BLU: 'Blue',
//     BLK: 'Black',
//     HAZ: 'Hazel',
//     GRN: 'Green',
//     GRY: 'Gray',
//     PNK: 'Pink',
//     MAR: 'Maroon',
//     DIC: 'Dichromatic'
//   },

//   // Hair color codes
//   HAIR_COLORS: {
//     BLD: 'Bald',
//     BLK: 'Black',
//     BLN: 'Blonde',
//     BRN: 'Brown',
//     GRY: 'Gray',
//     RED: 'Red/Auburn',
//     SDY: 'Sandy',
//     WHI: 'White',
//     UNK: 'Unknown'
//   },

//   // Vehicle classifications
//   VEHICLE_CLASSES: {
//     A: 'Any combination of vehicles',
//     B: 'Large trucks, buses, tractor-trailers',
//     C: 'Regular vehicles and small trucks',
//     D: 'Regular operator license',
//     M: 'Motorcycles'
//   },

//   // Endorsements
//   ENDORSEMENTS: {
//     H: 'Hazardous materials',
//     N: 'Tank vehicles',
//     P: 'Passenger vehicles',
//     S: 'School bus',
//     T: 'Double/triple trailers',
//     X: 'Combination of tank vehicle and hazardous materials'
//   },

//   // Restrictions
//   RESTRICTIONS: {
//     A: 'Corrective lenses',
//     B: 'Outside rearview mirror',
//     C: 'Prosthetic aid',
//     D: 'Automatic transmission',
//     E: 'No manual transmission equipped CMV',
//     F: 'Outside rearview mirror and/or signal',
//     G: 'Limit to daylight driving only',
//     H: 'Limit to employment',
//     I: 'Limited other',
//     J: 'Other adaptive devices',
//     K: 'CDL Intrastate only',
//     L: 'Vehicles without air brakes'
//   },

//   // Helper functions
//   getDefaultData: () => ({
//     // Mandatory Data Elements
//     familyName: 'SAMPLE',
//     givenNames: 'JOHN MICHAEL',
//     dateOfBirth: '03/15/1985',
//     dateOfIssue: new Date().toLocaleDateString('en-US'),
//     dateOfExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toLocaleDateString('en-US'),
//     customerIdentifier: 'D12345678901234567890',
//     documentDiscriminator: `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}12345`,
//     address: '123 MAIN STREET, ANYTOWN, ST 12345',
//     vehicleClassifications: 'D',
//     endorsements: 'NONE',
//     restrictions: 'NONE',
//     sex: 'M',
//     height: '5\'-10"',
//     eyeColor: 'BRO',

//     // Optional Data Elements
//     hairColor: 'BRN',
//     weight: '180 lb',
//     suffix: '',

//     // Document Configuration
//     documentType: 'DL',
//     cardFormat: 'horizontal',

//     // Compliance Information
//     compliance: {
//       realId: true,
//       aamvaVersion: '11',
//       jurisdictionVersion: '00'
//     }
//   }),

//   // Validation helpers
//   isValidDate: (dateString) => {
//     const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/([12][0-9][0-9][0-9])$/;
//     if (!regex.test(dateString)) return false;

//     const [month, day, year] = dateString.split('/').map(Number);
//     const date = new Date(year, month - 1, day);
//     return date.getFullYear() === year &&
//            date.getMonth() === month - 1 &&
//            date.getDate() === day;
//   },

//   isValidHeight: (height) => {
//     const heightRegex = /^(\d{1})'-(\d{2})"$|^(\d{3}) cm$/;
//     return heightRegex.test(height);
//   },

//   isValidWeight: (weight) => {
//     const weightRegex = /^(\d{1,3}) lb$|^(\d{1,3}) kg$/;
//     return weightRegex.test(weight);
//   },

//   formatCustomerIdentifier: (id) => {
//     // Remove spaces and limit to 25 characters
//     return id.replace(/\s/g, '').substring(0, 25).toUpperCase();
//   },

//   generateDocumentDiscriminator: () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const day = String(now.getDate()).padStart(2, '0');
//     const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
//     return `${year}${month}${day}${random}`;
//   }
// });
