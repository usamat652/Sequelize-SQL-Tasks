import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import multer from 'multer';
import { PDFDocument } from 'pdf-lib';

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function mergePDFs(req, res) {
  try {
    // File check
    if (!req.files || req.files.length < 2) {
      return res.status(400).send('Please upload at least two PDF files.');
    }

    // Load the uploaded PDF files
    const pdfDocs = await Promise.all(
      req.files.map(async (file) => {
        const buffer = file.buffer;
        return await PDFDocument.load(buffer);
      })
    );

    // Create a new PDF document for merging
    const mergedPdfDoc = await PDFDocument.create();

    // Add pages from each uploaded PDF
    for (const pdfDoc of pdfDocs) {
      const pages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => mergedPdfDoc.addPage(page));
    }

    // Convert the merged PDF to base64
    const mergedPdfBase64 = await mergedPdfDoc.saveAsBase64();

    const filename = fileURLToPath(import.meta.url);
    const _dirname = dirname(filename);
    const outputPath = resolve(_dirname, '../uploads/mergedFile.pdf');

    await writeFile(outputPath, await mergedPdfDoc.save());

    console.log('PDFs merged successfully. Merged file saved to:', outputPath);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');

    // Send the merged PDF as the response
    res.status(200).send(Buffer.from(mergedPdfBase64, 'base64'));

    console.log('PDFs merged successfully.');

  } catch (error) {
    console.error('Error merging PDFs:', error.message);
    res.status(500).send('Internal Server Error - Error merging files');
  }
}

// Define your route to handle file uploads and merging


export { mergePDFs, upload };
