import { Op } from 'sequelize';
import { Product } from '../models/products.js';
import { createObjectCsvWriter } from 'csv-writer';
import { v4 as uuidv4 } from 'uuid';
// import fs from 'fs';
// import path from 'path';

const getProducts = async function (req, res) {
  try {
    // Fetch products with buyPrice greater than 60.00
    const products = await Product.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where: {
        buyPrice: {
          [Op.gt]: 60.00,
        },
      },
    });

    // Generate a unique filename for the CSV
    const filename = `uploads/products_${uuidv4()}.csv`;

    // Create CSV writer with specified headers
    const csvWriter = createObjectCsvWriter({
      path: filename,
      header: [
        { id: "productCode", title: "Product Code" },
        { id: "productName", title: "Product Name" },
        { id: "productScale", title: "Product Scale" },
        { id: "productVendor", title: "Product Vendor" },
        { id: "productDescription", title: "Product Description" },
        { id: "quantityInStock", title: "Quantity In Stock" },
        { id: "buyPrice", title: "Buy Price" },
        { id: "MSRP", title: "MSRP" },
      ],
    });

    // Write product records to the CSV file
    await csvWriter.writeRecords(products);

    // Send success message with the generated filename
    res.send(`CSV file ${filename} has been written successfully`);
  } catch (error) {
    console.error("Error fetching or writing products:", error);
    res.status(500).send("Internal Server Error");
  }
};


export { getProducts };
