import fs from 'fs';
import { Customer } from "../models/customers.js";
import PDFDocument from 'pdfkit';
import { Payment } from "../models/payments.js";
import { Order } from '../models/orders.js';
import { Product } from '../models/products.js';
import { ProductLine } from '../models/productlines.js';
import { OrderDetail } from '../models/orderdetails.js';
import { Employee } from '../models/employees.js';
// import { Sequelize } from 'sequelize';



const orderDetails = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const customer = await Order.findOne({
            where: { orderNumber },
            include: [
                {
                    model: Customer,
                    attributes: ['customerNumber', 'customerName', 'salesRepEmployeeNumber', 'creditLimit'],
                    include: [
                        {
                            model: Payment,
                            attributes: ['paymentDate', 'amount']
                        }
                    ]
                },
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
                },
            ]
        });

        if (!customer) {
            return res.status(404).send({ message: "Customer not found" });
        }

        const pdfFilePath = `./uploads/order_details_${orderNumber}.pdf`;

        // Create a write stream to save the PDF file
        const pdfStream = fs.createWriteStream(pdfFilePath);

        res.setHeader('Content-Disposition', `attachment; filename=order_details_${orderNumber}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');

        const pdfDoc = new PDFDocument();
        // Pipe the PDF content to both the response and the write stream
        pdfDoc.pipe(res);
        pdfDoc.pipe(pdfStream);

        const logoPath = 'C:\\Users\\SA\\Desktop\\NodeTasks\\SQL-Node-Task\\Logo.png'; // Replace with the path to your logo image
        pdfDoc.image(logoPath, 50, 50, { width: 100 })

        pdfDoc.fontSize(18).font('Helvetica-Bold').text(`INVOICE (${orderNumber})`, { align: 'center' });
        pdfDoc.moveDown();

        pdfDoc.fontSize(16).font('Helvetica-Bold').text(`Order Details`, { align: 'left' });
        pdfDoc.moveDown();
        pdfDoc.fontSize(12).text(`     - Order Number: ${customer.orderNumber}`, { align: 'left' });
        pdfDoc.fontSize(12).text(`     - Order Date: ${customer.orderDate}`, { align: 'left' });
        pdfDoc.text(`     - Shipped Date: ${customer.shippedDate}`, { align: 'left' });
        pdfDoc.text(`     - Customer Number: ${customer.customerNumber}`, { align: 'left' });
        pdfDoc.moveDown();


        if (customer.Customer) {
            pdfDoc.fontSize(16).font('Helvetica-Bold').text(`Customer Details`, { align: 'left' });
            pdfDoc.moveDown();
            pdfDoc.fontSize(12).text(`     - Customer Number: ${customer.customerNumber}`)
            pdfDoc.fontSize(12).text(`     - Customer Name: ${customer.Customer.customerName}`, { align: 'left' });
            pdfDoc.fontSize(12).text(`     - Sales Rep Employee Number: ${customer.Customer.salesRepEmployeeNumber}`, { align: 'left' });
            pdfDoc.text(`     - Credit Limit: ${customer.Customer.creditLimit}`, { align: 'left' });
            pdfDoc.moveDown();
        }

        if (customer.OrderDetails && customer.OrderDetails.length > 0) {
            pdfDoc.fontSize(16).font('Helvetica-Bold').text('  Order Details:', { align: 'left' });
            pdfDoc.moveDown();
            customer.OrderDetails.forEach(orderDetail => {
                pdfDoc.fontSize(12).text(`     - Quantity Ordered: ${orderDetail.quantityOrdered},\n     - Price Each: ${orderDetail.priceEach}`);

                if (orderDetail.Product) {
                    pdfDoc.fontSize(12).font('Helvetica-Bold').text(`     - Product: ${orderDetail.Product.productName},\n     - Product Line: ${orderDetail.Product.productLine}`, { align: 'left' });

                    if (orderDetail.Product.ProductLine) {
                        pdfDoc.fontSize(12).font('Helvetica-Bold').text(`     - Product Line: ${orderDetail.Product.ProductLine.productLine}`, { align: 'left' });
                        pdfDoc.moveDown();

                    }
                }
            })
        }

        pdfDoc.end();

        pdfStream.on('finish', () => { });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server Error" });
    }
};

export default orderDetails;

