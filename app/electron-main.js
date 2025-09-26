// Commented out for pure web app conversion
// This file was used for Electron app functionality
// const { app, BrowserWindow, ipcMain, dialog } = require('electron');
// const path = require('path');
// const fs = require('fs').promises;

// // Import existing AAMVA logic
// const { IDGenerator } = require('../src/core/id-generator');
// const { DataValidator } = require('../src/data/validator');
// const { LayoutManager } = require('../src/layout/layout-manager');
// const { PDF417Generator } = require('../src/barcode/pdf417');

// let mainWindow;

// function createWindow() {
//   // Create the browser window
//   mainWindow = new BrowserWindow({
//     width: 1400,
//     height: 900,
//     minWidth: 1200,
//     minHeight: 800,
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       enableRemoteModule: false,
//       preload: path.join(__dirname, 'preload.js')
//     },
//     icon: path.join(__dirname, 'assets', 'icon.png'),
//     title: 'AAMVA ID Maker',
//     show: false
//   });

//   // Load the HTML file
//   mainWindow.loadFile(path.join(__dirname, 'index.html'));

//   // Show window when ready
//   mainWindow.once('ready-to-show', () => {
//     mainWindow.show();
//   });

//   // Open DevTools in development
//   if (process.argv.includes('--dev')) {
//     mainWindow.webContents.openDevTools();
//   }
// }

// // App event handlers
// app.whenReady().then(createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

// // IPC Handlers for AAMVA functionality

// // Validate data
// ipcMain.handle('validate-data', async (event, data) => {
//   try {
//     const validator = new DataValidator();
//     const validation = validator.validate(data);
//     return {
//       success: true,
//       validation: validation
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// });

// // Generate layout
// ipcMain.handle('generate-layout', async (event, data) => {
//   try {
//     const layoutManager = new LayoutManager();
//     const layout = layoutManager.generateLayout(data);
//     return {
//       success: true,
//       layout: layout
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// });

// // Generate PDF417 barcode
// ipcMain.handle('generate-barcode', async (event, data) => {
//   try {
//     const barcodeGenerator = new PDF417Generator();
//     const barcode = barcodeGenerator.generate(data);
//     return {
//       success: true,
//       barcode: barcode
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// });

// // Generate complete ID document
// ipcMain.handle('generate-document', async (event, data) => {
//   try {
//     // Step 1: Validate
//     const validator = new DataValidator();
//     const validation = validator.validate(data);

//     if (!validation.isValid) {
//       return {
//         success: false,
//         error: `Validation failed: ${validation.errors.join(', ')}`
//       };
//     }

//     // Step 2: Generate layout
//     const layoutManager = new LayoutManager();
//     const layout = layoutManager.generateLayout(data);

//     // Step 3: Generate barcode
//     const barcodeGenerator = new PDF417Generator();
//     const barcode = barcodeGenerator.generate(data);

//     // Step 4: Compile document
//     const idGenerator = new IDGenerator();
//     const document = idGenerator.compile({
//       data,
//       layout,
//       barcode,
//       metadata: {
//         generatedAt: new Date().toISOString(),
//         template: data.documentType.toLowerCase(),
//         format: data.cardFormat
//       }
//     });

//     return {
//       success: true,
//       document: document,
//       validation: validation
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// });

// // Save document to file
// ipcMain.handle('save-document', async (event, document) => {
//   try {
//     const result = await dialog.showSaveDialog(mainWindow, {
//       title: 'Save AAMVA ID Document',
//       defaultPath: `aamva-id-${new Date().toISOString().split('T')[0]}.json`,
//       filters: [
//         { name: 'JSON Files', extensions: ['json'] },
//         { name: 'All Files', extensions: ['*'] }
//       ]
//     });

//     if (result.canceled) {
//       return { success: false, canceled: true };
//     }

//     await fs.writeFile(result.filePath, JSON.stringify(document, null, 2));

//     return {
//       success: true,
//       filePath: result.filePath
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// });

// // Load document from file
// ipcMain.handle('load-document', async (event) => {
//   try {
//     const result = await dialog.showOpenDialog(mainWindow, {
//       title: 'Load AAMVA ID Document',
//       filters: [
//         { name: 'JSON Files', extensions: ['json'] },
//         { name: 'All Files', extensions: ['*'] }
//       ],
//       properties: ['openFile']
//     });

//     if (result.canceled) {
//       return { success: false, canceled: true };
//     }

//     const fileContent = await fs.readFile(result.filePaths[0], 'utf8');
//     const document = JSON.parse(fileContent);

//     return {
//       success: true,
//       document: document,
//       filePath: result.filePaths[0]
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// });

// // Export document as HTML preview
// ipcMain.handle('export-html-preview', async (event, document) => {
//   try {
//     const result = await dialog.showSaveDialog(mainWindow, {
//       title: 'Export HTML Preview',
//       defaultPath: `aamva-id-preview-${new Date().toISOString().split('T')[0]}.html`,
//       filters: [
//         { name: 'HTML Files', extensions: ['html'] },
//         { name: 'All Files', extensions: ['*'] }
//       ]
//     });

//     if (result.canceled) {
//       return { success: false, canceled: true };
//     }

//     // Generate HTML preview content
//     const htmlContent = generateHTMLPreview(document);
//     await fs.writeFile(result.filePath, htmlContent);

//     return {
//       success: true,
//       filePath: result.filePath
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// });

// // Generate HTML preview content
// function generateHTMLPreview(document) {
//   const hr = document.humanReadable;
//   const layout = document.layout;

//   return `<!DOCTYPE html>
// <html>
// <head>
//     <title>AAMVA ID Preview - ${hr.zoneII.familyName}, ${hr.zoneII.givenNames}</title>
//     <style>
//         body { font-family: Arial, sans-serif; margin: 20px; background: #f0f0f0; }
//         .card-container { display: flex; gap: 20px; justify-content: center; }
//         .card {
//             width: 340px; height: 214px;
//             background: white;
//             border: 2px solid #333;
//             border-radius: 12px;
//             position: relative;
//             box-shadow: 0 4px 8px rgba(0,0,0,0.2);
//             font-size: 10px;
//         }
//         .zone-i {
//             background: ${layout.colorScheme.primary};
//             color: white;
//             height: 32px;
//             padding: 4px 8px;
//             border-radius: 10px 10px 0 0;
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//         }
//         .zone-ii { position: absolute; left: 8px; top: 40px; width: 180px; }
//         .zone-iii { position: absolute; right: 8px; top: 40px; width: 140px; text-align: center; }
//         .portrait {
//             width: 120px; height: 140px;
//             background: #e0e0e0;
//             border: 1px solid #999;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             margin: 0 auto 10px;
//         }
//         .signature {
//             height: 30px;
//             background: #f0f0f0;
//             border: 1px solid #999;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//         }
//         .field { margin: 2px 0; }
//         .back-side { background: #f9f9f9; }
//         .zone-iv { padding: 8px; font-size: 9px; }
//         .zone-v {
//             position: absolute;
//             bottom: 8px;
//             left: 8px;
//             right: 8px;
//             height: 60px;
//             background: #f0f0f0;
//             border: 1px solid #999;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//         }
//         .real-id-star { color: gold; font-size: 16px; }
//         .document-info { margin: 20px 0; padding: 20px; background: white; border-radius: 8px; }
//     </style>
// </head>
// <body>
//     <h1>AAMVA ID Document Preview</h1>

//     <div class="document-info">
//         <h2>Document Information</h2>
//         <p><strong>Standard:</strong> ${document.metadata.standard}</p>
//         <p><strong>Generated:</strong> ${document.metadata.generatedAt}</p>
//         <p><strong>Format:</strong> ${layout.format}</p>
//         <p><strong>REAL ID Compliant:</strong> ${document.compliance.realId ? 'Yes' : 'No'}</p>
//     </div>

//     <div class="card-container">
//         <!-- Front Side -->
//         <div class="card">
//             <div class="zone-i">
//                 <div>
//                     <strong>${hr.zoneI.documentType}</strong><br>
//                     <small>SAMPLE STATE • USA</small>
//                 </div>
//                 <div>
//                     ${document.compliance.realId ? '<span class="real-id-star">★</span>' : '<small>NOT FOR REAL ID</small>'}
//                 </div>
//             </div>

//             <div class="zone-ii">
//                 <div class="field"><strong>1</strong> ${hr.zoneII.familyName}</div>
//                 <div class="field"><strong>2</strong> ${hr.zoneII.givenNames}</div>
//                 <div class="field"><strong>3 DOB</strong> ${hr.zoneII.dateOfBirth}</div>
//                 <div class="field"><strong>4a Iss</strong> ${hr.zoneII.dateOfIssue}</div>
//                 <div class="field"><strong>4b Exp</strong> ${hr.zoneII.dateOfExpiry}</div>
//                 <div class="field"><strong>5 DD</strong> ${hr.zoneII.documentDiscriminator}</div>
//                 <div class="field"><strong>8</strong> ${hr.zoneII.address}</div>
//                 <div class="field"><strong>9</strong> ${hr.zoneII.vehicleClassifications}</div>
//                 <div class="field"><strong>12</strong> ${hr.zoneII.restrictions}</div>
//                 <div class="field"><strong>15 Sex</strong> ${hr.zoneII.sex}</div>
//                 <div class="field"><strong>16 Hgt</strong> ${hr.zoneII.height}</div>
//                 <div class="field"><strong>18 Eyes</strong> ${hr.zoneII.eyeColor}</div>
//             </div>

//             <div class="zone-iii">
//                 <div class="portrait">PORTRAIT<br>PHOTO</div>
//                 <div class="signature">SIGNATURE</div>
//             </div>
//         </div>

//         <!-- Back Side -->
//         <div class="card back-side">
//             <div class="zone-iv">
//                 <h4>RESTRICTIONS & ENDORSEMENTS</h4>
//                 <div><strong>Vehicle Classifications:</strong></div>
//                 <div>D - Regular operator license</div>
//                 <br>
//                 <div><strong>Restrictions:</strong></div>
//                 <div>${hr.zoneII.restrictions === 'NONE' ? 'No restrictions' : 'A - Corrective lenses required'}</div>
//                 <br>
//                 <div><strong>Endorsements:</strong></div>
//                 <div>${hr.zoneII.endorsements === 'NONE' ? 'No endorsements' : hr.zoneII.endorsements}</div>
//             </div>

//             <div class="zone-v">
//                 PDF417 BARCODE<br>
//                 <small>[${document.machineReadable.zoneV.pdf417.dataLength} bytes]</small>
//             </div>
//         </div>
//     </div>

//     <div class="document-info">
//         <h3>Validation Status</h3>
//         <p><strong>AAMVA Compliant:</strong> ${document.compliance.aamvaCompliant ? 'Yes' : 'No'}</p>
//         <p><strong>Document ID:</strong> ${document.metadata.documentId}</p>
//         <p><strong>PDF417 Data Length:</strong> ${document.metadata.documentId}</p>
//     </div>
// </body>
// </html>`;
// }
