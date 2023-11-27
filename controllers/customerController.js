import {Customer} from "../models/customers.js";
import {Payment} from "../models/payments.js";
import PDFDocument from 'pdfkit';

const customerDetails = async (req, res) => {
  try {
    const { customerNumber } = req.params;
    const customerPayments = await Customer.findOne({
      where: { customerNumber },
      include: [{ model: Payment, attributes: ['paymentDate', 'amount'], exclude: ['createdAt', 'updatedAt'] }],
    });

    if (!customerPayments) {
      return res.status(404).send({ message: "Customer not found" });
    }

    // Set response headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename=customer_details.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    const pdfDoc = new PDFDocument();
    // Pipe the PDF content directly to the response
    pdfDoc.pipe(res);

    // Add content to the PDF
    pdfDoc.fontSize(12).text(`Customer Details - Customer Number: ${customerPayments.customerNumber}`);
    pdfDoc.moveDown(); // Move down one line

    pdfDoc.fontSize(10).text(`Customer Name: ${customerPayments.customerName}`);
    pdfDoc.text(`Sales Rep Employee Number: ${customerPayments.salesRepEmployeeNumber}`);
    pdfDoc.text(`Credit Limit: ${customerPayments.creditLimit}`);
    
    pdfDoc.moveDown(); // Move down one line

    if (customerPayments.Payments && customerPayments.Payments.length > 0) {
      pdfDoc.fontSize(12).text('Payments:');
      pdfDoc.moveDown(); // Move down one line

      customerPayments.Payments.forEach(payment => {
        pdfDoc.fontSize(10).text(`- Payment Date: ${payment.paymentDate}, Amount: ${payment.amount}`);
      });
    } else {
      pdfDoc.fontSize(10).text('No payments found.');
    }

    // Finalize the PDF and end the response
    pdfDoc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error - customerController" });
  }
};

export default customerDetails;
