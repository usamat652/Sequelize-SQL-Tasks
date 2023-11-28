import { PDFDocument } from 'pdf-lib';
import { access, readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

async function mergePDFs(req, res) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const pdf1Path = resolve(__dirname, '../uploads/customer_details_333.pdf');
    const pdf2Path = resolve(__dirname, '../uploads/customer_details_334.pdf');
    const outputPath = resolve(__dirname, '../uploads/mergedFile.pdf');

    // Check if files exist
    await Promise.all([
      access(pdf1Path),
      access(pdf2Path),
    ]);

    // Read the PDF files
    const pdf1Bytes = await readFile(pdf1Path);
    const pdf2Bytes = await readFile(pdf2Path);

    // Create PDFDocument objects
    const pdfDoc1 = await PDFDocument.load(pdf1Bytes);
    const pdfDoc2 = await PDFDocument.load(pdf2Bytes);

    // Create a new PDF document for merging
    const mergedPdfDoc = await PDFDocument.create();

    // Add pages from the first PDF
    const [pdf1Pages, pdf2Pages] = await Promise.all([
      mergedPdfDoc.copyPages(pdfDoc1, pdfDoc1.getPageIndices()),
      mergedPdfDoc.copyPages(pdfDoc2, pdfDoc2.getPageIndices()),
    ]);

    // Add the copied pages to the merged PDF
    pdf1Pages.forEach((page) => mergedPdfDoc.addPage(page));
    pdf2Pages.forEach((page) => mergedPdfDoc.addPage(page));

    // Save the merged PDF to a file on the server
    await writeFile(outputPath, await mergedPdfDoc.save());

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=merged.pdf');

    // Send the merged PDF as the response
    res.send(await mergedPdfDoc.save());

    console.log('PDFs merged successfully. Merged file saved to:', outputPath);
  } catch (error) {
    console.error('Error merging PDFs:', error.message);
    res.status(500).send('Internal Server Error - Error merging files');
  }
}

export default mergePDFs;
