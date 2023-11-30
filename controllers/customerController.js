import fs from 'fs';
import { Customer } from "../models/customers.js";
import PDFDocument from 'pdfkit';
import { Payment } from "../models/payments.js";
import { Order } from '../models/orders.js';
import { Product } from '../models/products.js';
import { ProductLine } from '../models/productlines.js';
import { OrderDetail } from '../models/orderdetails.js';
// import { Employee } from '../models/employees.js';
// import { Sequelize } from 'sequelize';



const customerDetails = async (req, res) => {
  try {
    const { customerNumber } = req.params;
    const customerPayments = await Customer.findOne({
      where: { customerNumber },
      include: [
        {
          model: Payment,
          attributes: ['paymentDate', 'amount']
        },
        {
          model: Order,
          attributes: ['orderNumber', 'orderDate', 'shippedDate'],
          include: [
            {
              model: OrderDetail,
              attributes: ['quantityOrdered', 'priceEach'],
              include: [
                {
                  model: Product,
                  attributes: ['productCode', 'productName', 'productLine'],
                  include: [
                    {
                      model: ProductLine,
                      attributes: ['productLine'],
                    }
                  ]
                }
              ]
            }
          ]
        }
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

    pdfDoc.fontSize(16).font('Helvetica-Bold').text(`Customer Details - Customer Number: ${customerPayments.customerNumber}`);
    pdfDoc.moveDown();

    pdfDoc.fontSize(12).text(`Customer Name: ${customerPayments.customerName}`, { align: 'left' });
    pdfDoc.text(`Sales Rep Employee Number: ${customerPayments.salesRepEmployeeNumber}`, { align: 'left' });
    pdfDoc.text(`Credit Limit: ${customerPayments.creditLimit}`, { align: 'left' });

    pdfDoc.moveDown();

    if (customerPayments.Payments && customerPayments.Payments.length > 0) {
      pdfDoc.fontSize(14).font('Helvetica-Bold').text('Payments:', { align: 'left' });
      pdfDoc.moveDown();

      customerPayments.Payments.forEach(payment => {
        pdfDoc.fontSize(10).text(`- Payment Date: ${payment.paymentDate}, Amount: ${payment.amount}`);
      });
    } else {
      pdfDoc.fontSize(10).text('No payments found.');
    }

    pdfDoc.moveDown();

    if (customerPayments.Orders && customerPayments.Orders.length > 0) {
      pdfDoc.fontSize(12).font('Helvetica-Bold').text('Orders:', { align: 'left' });
      pdfDoc.moveDown();

      customerPayments.Orders.forEach(order => {
        pdfDoc.fontSize(14).font('Helvetica-Bold').text(`- Order Date: ${order.orderDate}, Shipped Date: ${order.shippedDate}`, { align: 'left' });

        if (order.OrderDetails && order.OrderDetails.length > 0) {
          pdfDoc.fontSize(14).font('Helvetica-Bold').text('  Order Details:', { align: 'left' });
          order.OrderDetails.forEach(orderDetail => {
            pdfDoc.fontSize(10).text(`    - Quantity Ordered: ${orderDetail.quantityOrdered}, Price Each: ${orderDetail.priceEach}`);

            if (orderDetail.Product) {
              pdfDoc.fontSize(10).font('Helvetica-Bold').text(`      Product: ${orderDetail.Product.productName}, Product Line: ${orderDetail.Product.productLine}`, { align: 'left' });

              if (orderDetail.Product.ProductLine) {
                pdfDoc.fontSize(10).font('Helvetica-Bold').text(`      Product Line: ${orderDetail.Product.ProductLine.productLine}`, { align: 'left' });
              }
            }
          });
        } else {
          pdfDoc.fontSize(10).text('    No order details found.');
        }
      });
    }
    // End the PDF document
    pdfDoc.end();

    pdfStream.on('finish', () => { });

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server Error" });
  }
};

export default customerDetails;










  // const customerDetails = async (req, res) => {
  //   try {
  //     const { customerNumber } = req.params;
  //     const customerPayments = await Customer.findOne({
  //       where: { customerNumber },
  //       include: [
  //         { model: Payment, attributes: ['paymentDate', 'amount'] },
  //         {
  //           model: Order, attributes: ['orderNumber', 'orderDate', 'shippedDate'],
  //           include: [
  //             {
  //               model: OrderDetail,
  //               attributes: ['quantityOrdered', 'priceEach']
  //             }
  //           ],
  
  //         },
  //       ]
  //     });
  
  //     if (!customerPayments) {
  //       return res.status(404).send({ message: "Customer not found" });
  //     }
  
  //     const pdfFilePath = `./uploads/customer_details_${customerNumber}.pdf`;
  
  //     // Create a write stream to save the PDF file
  //     const pdfStream = fs.createWriteStream(pdfFilePath);
  
  //     res.setHeader('Content-Disposition', `attachment; filename=customer_details_${customerNumber}.pdf`);
  //     res.setHeader('Content-Type', 'application/pdf');
  
  //     const pdfDoc = new PDFDocument();
  
  //     // Pipe the PDF content to both the response and the write stream
  //     pdfDoc.pipe(res);
  //     pdfDoc.pipe(pdfStream);
  
  //     pdfDoc.fontSize(14).text(`Customer Details - Customer Number: ${customerPayments.customerNumber}`);
  //     pdfDoc.moveDown();
  
  //     pdfDoc.fontSize(12).text(`Customer Name: ${customerPayments.customerName}`);
  //     pdfDoc.text(`Sales Rep Employee Number: ${customerPayments.salesRepEmployeeNumber}`);
  //     pdfDoc.text(`Credit Limit: ${customerPayments.creditLimit}`);
  
  //     pdfDoc.moveDown();
  
  //     if (customerPayments.Payments && customerPayments.Payments.length > 0) {
  //       pdfDoc.fontSize(14).text('Payments:');
  //       pdfDoc.moveDown();
  
  //       customerPayments.Payments.forEach(payment => {
  //         pdfDoc.fontSize(10).text(`- Payment Date: ${payment.paymentDate}, Amount: ${payment.amount}`);
  //       });
  //     } else {
  //       pdfDoc.fontSize(10).text('No payments found.');
  //     }
  
  //     pdfDoc.moveDown();
  
  //     if (customerPayments.Orders && customerPayments.Orders.length > 0) {
  //       pdfDoc.fontSize(12).text('Orders:');
  //       pdfDoc.moveDown();
  
  //       customerPayments.Orders.forEach(order => {
  //         pdfDoc.fontSize(10).text(`- Order Date: ${order.orderDate}, Shipped Date: ${order.shippedDate}`);
  
  //       });
  //     }
  //     // End the PDF document
  //     pdfDoc.end();
  
  //     // Wait for the PDF stream to finish writing before responding to the client
  //     pdfStream.on('finish', () => {} );
  
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).send({ message: "Server Error" });
  //   }
  // };
