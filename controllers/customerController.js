import fs from 'fs';
import { Customer } from "../models/customers.js";
import { Payment } from "../models/payments.js";
import PDFDocument from 'pdfkit';
import { Order } from '../models/orders.js';
// import { Product } from '../models/products.js';
// import { ProductLine } from '../models/productlines.js';
import { OrderDetail } from '../models/orderdetails.js';
// import { Employee } from '../models/employees.js';
// import { Sequelize } from 'sequelize';

const customerDetails = async (req, res) => {
  try {
    const { customerNumber } = req.params;
    const customerPayments = await Customer.findOne({
      where: { customerNumber },
      include: [
        { model: Payment, attributes: ['paymentDate', 'amount'] },
        {
          model: Order, attributes: ['orderNumber', 'orderDate', 'shippedDate'],
          include: [
            {
              model: OrderDetail,
              attributes: ['quantityOrdered', 'priceEach']
            }
          ],

        },
      ]
    });

    if (!customerPayments) {
      return res.status(404).send({ message: "Customer not found" });
    }

    const pdfFilePath = `./uploads/customer_details_${customerNumber}.pdf`;

    // Create a write stream to save the PDF file
    const pdfStream = fs.createWriteStream(pdfFilePath);

    res.setHeader('Content-Disposition', `attachment; filename=customer_details_${customerNumber}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    const pdfDoc = new PDFDocument();

    // Pipe the PDF content to both the response and the write stream
    pdfDoc.pipe(res);
    pdfDoc.pipe(pdfStream);

    pdfDoc.fontSize(14).text(`Customer Details - Customer Number: ${customerPayments.customerNumber}`);
    pdfDoc.moveDown();

    pdfDoc.fontSize(12).text(`Customer Name: ${customerPayments.customerName}`);
    pdfDoc.text(`Sales Rep Employee Number: ${customerPayments.salesRepEmployeeNumber}`);
    pdfDoc.text(`Credit Limit: ${customerPayments.creditLimit}`);

    pdfDoc.moveDown();

    if (customerPayments.Payments && customerPayments.Payments.length > 0) {
      pdfDoc.fontSize(14).text('Payments:');
      pdfDoc.moveDown();

      customerPayments.Payments.forEach(payment => {
        pdfDoc.fontSize(10).text(`- Payment Date: ${payment.paymentDate}, Amount: ${payment.amount}`);
      });
    } else {
      pdfDoc.fontSize(10).text('No payments found.');
    }

    pdfDoc.moveDown();

    if (customerPayments.Orders && customerPayments.Orders.length > 0) {
      pdfDoc.fontSize(12).text('Orders:');
      pdfDoc.moveDown();

      customerPayments.Orders.forEach(order => {
        pdfDoc.fontSize(10).text(`- Order Date: ${order.orderDate}, Shipped Date: ${order.shippedDate}`);

      });
    }

    // End the PDF document
    pdfDoc.end();

    // Wait for the PDF stream to finish writing before responding to the client
    pdfStream.on('finish', () => {} );

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server Error" });
  }
};

export default customerDetails;



// const customerDetails = async (req, res) => {
//   try {
//     const { customerNumber } = req.params;

//     // Fetch customer details with associated data
//     const customerPayments = await Customer.findOne({
//       where: { customerNumber },
//       include: [
//         { model: Payment, attributes: ['paymentDate', 'amount'], exclude: ['createdAt', 'updatedAt'] },
//         {
//           model: Order,
//           attributes: ['orderNumber', 'orderDate', 'shippedDate'],
//           include: [
//             {
//               model: ProductLine,
//               attributes: ['productLine', 'productName', 'quantityOrdered', 'priceEach'],
//               as: 'ProductLines' // Use the correct alias
//             }
//           ]
//         },
//         {
//           model: Employee,
//           attributes: ['employeeNumber', 'firstName', 'lastName'],
//           as: 'Employee',
//           where: { employeeNumber: Sequelize.col('Customer.salesRepEmployeeNumber') }
//         },
//       ],
//     });

//     if (!customerPayments) {
//       return res.status(404).send({ message: "Customer not found" });
//     }

//     res.setHeader('Content-Disposition', 'attachment; filename=customer_details.pdf');
//     res.setHeader('Content-Type', 'application/pdf');

//     const pdfDoc = new PDFDocument();
//     // Pipe the PDF content directly to the response
//     pdfDoc.pipe(res);

//     pdfDoc.fontSize(14).text(`Customer Details - Customer Number: ${customerPayments.customerNumber}`);
//     pdfDoc.moveDown();

//     pdfDoc.fontSize(12).text(`Customer Name: ${customerPayments.customerName}`);

//     // Include sales rep details
//     pdfDoc.text(`Sales Rep: ${customerPayments.SalesRep.firstName} ${customerPayments.SalesRep.lastName}`);

//     // Include order details
//     if (customerPayments.Orders && customerPayments.Orders.length > 0) {
//       pdfDoc.fontSize(12).text('Orders:');
//       pdfDoc.moveDown();

//       customerPayments.Orders.forEach(order => {
//         pdfDoc.fontSize(10).text(`- Order Date: ${order.orderDate}, Shipped Date: ${order.shippedDate}`);

//         // Include product line details
//         if (order.ProductLines && order.ProductLines.length > 0) {
//           order.ProductLines.forEach(productLine => {
//             pdfDoc.fontSize(10).text(`  - Product: ${productLine.productName}, Quantity: ${productLine.quantityOrdered}, Price Each: ${productLine.priceEach}`);
//           });
//         } else {
//           pdfDoc.fontSize(10).text('    No products in this order.');
//         }
//       });
//     } else {
//       pdfDoc.fontSize(10).text('No orders found.');
//     }

//     // Include payment details
//     if (customerPayments.Payments && customerPayments.Payments.length > 0) {
//       pdfDoc.fontSize(12).text('Payments:');
//       pdfDoc.moveDown();

//       customerPayments.Payments.forEach(payment => {
//         pdfDoc.fontSize(10).text(`- Payment Date: ${payment.paymentDate}, Amount: ${payment.amount}`);
//       });
//     } else {
//       pdfDoc.fontSize(10).text('No payments found.');
//     }

//     pdfDoc.end();

//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Internal Server Error - customerController" });
//   }
// };
// export default customerDetails;
