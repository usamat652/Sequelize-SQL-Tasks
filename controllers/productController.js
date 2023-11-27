import { Op } from 'sequelize';
import { Product } from '../models/products.js';
import { createObjectCsvWriter } from 'csv-writer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const getProducts = async function (req, res) {
  try {
    const pro = await Product.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        where: {
        buyPrice: {
          [Op.gt]: 60.00
        },
      },
    });

    const filename = `uploads/products_${uuidv4()}.csv`;
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
    csvWriter
      .writeRecords(pro)
      .then(() => {
        res.send(`CSV file ${filename} has been written successfully`); 
      })
      .catch((error) => {
        console.error("Error writing CSV file:", error); 
        res.status(500).send("Internal Server Error");
      });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getCsv = (req, res) => {
    const { uuid } = req.body;
    const filePath = path.join(__dirname, 'uploads', `products_${uuid}.csv`);
  
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=products_${uuid}.csv`
      );
  
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
  
      fileStream.on('end', () => {
        fs.unlinkSync(filePath);
      });
  
      fileStream.on('error', (error) => {
        console.error('Error streaming CSV file:', error);
        res.status(500).send('Internal Server Error');
      });
    } else {
      res.status(404).send('File not found');
    }
  };
  
export { getProducts, getCsv };