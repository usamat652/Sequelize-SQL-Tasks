import { Op } from 'sequelize';
import { Product } from '../models/products.js';
import { createObjectCsvWriter } from 'csv-writer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { resolve } from 'path';

const getProducts = async function (req, res) {
  try {
    const products = await Product.findAll({
      attributes: {
        exclude: ['orderNumber'], 
      },
      where: {
        buyPrice: {
          [Op.gt]: 30.00,
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


const deleteFile = async(req, res)=>{
  try {
    const { uuid } = req.query;

    if (!uuid) {
      return res.status(400).json({ error: 'Filename parameter is required' });
    }
    // Use import.meta.url to get the module URL and then resolve its dirname
    // const currentModulePath = new URL(import.meta.url).pathname;
    // const currentModuleDir = dirname(currentModulePath);
    
    let dir= 'C:\\Users\\SA\\Desktop\\NodeTasks\\SQL-Node-Task';
    
    const filePath = resolve(dir, 'uploads',`products_${uuid}.csv`);

    // Check if the file exists
    if (filePath){
      await fs.access(filePath);
    }else{
      return res.status(404).json({ error: 'File not found' });
    }
    // Delete the file
    await fs.unlink(filePath);
    res.status(200).json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Error deleting file:', error.message);
    res.status(500).json({ error: 'Internal Server Error - Error deleting file' });
  }
}


export { getProducts, deleteFile };
