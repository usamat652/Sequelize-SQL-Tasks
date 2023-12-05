import { Op } from 'sequelize';
import { Product } from '../models/products.js';
import { createObjectCsvWriter } from 'csv-writer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
// import { resolve } from 'path';
import { DownloadQueue } from './taskBull.js';

const getProducts = async function (req, res) {
  try {
    const buyPrice= req.params.buyPrice
    const products = await Product.findAll({
      attributes: {
        exclude: ['orderNumber'],
      },
      where: {
        buyPrice: {
          [Op.gt]: buyPrice,
        },
      },
    });
    // Generate a unique filename for the CSV
    const filename = `uploads/products_${uuidv4()}.csv`;

    // Create CSV writer with specified headers
    const csvWriter = createObjectCsvWriter({
      path: filename,
      header: [
        { id: "productCode", title: "Product-Code" },
        { id: "productName", title: "Product-Name" },
        { id: "productScale", title: "Product-Scale" },
        { id: "productVendor", title: "Product-Vendor" },
        { id: "productDescription", title: "Product-Description" },
        { id: "quantityInStock", title: "Quantity-InStock" },
        { id: "buyPrice", title: "Buy-Price" },
        { id: "MSRP", title: "MSRP" },
      ],
    });

    // Write product records to the CSV file
    await csvWriter.writeRecords(products);

    if (req.headers['user-agent'].includes('Postman')) {
      // If request is from Postman, respond with JSON
      res.status(200).json({ message: `CSV file ${filename} has been written successfully` });
    } else {
      // If request is from a browser, trigger download prompt
      res.download(filename, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).send("Internal Server Error");
        }
        // Cleanup: Delete the generated CSV file after download
        fs.unlinkSync(filename);
      });
    }
  } catch (error) {
    console.error("Error fetching or writing products:", error);
    res.status(500).send("Internal Server Error");
  }
};


// const deleteFile = async (req, res) => {
//   try {
//     const { uuid } = req.query;

//     if (!uuid) {
//       return res.status(400).json({ error: 'Filename parameter is required' });
//     }
//     // Use import.meta.url to get the module URL and then resolve its dirname
//     // const currentModulePath = new URL(import.meta.url).pathname;
//     // const currentModuleDir = dirname(currentModulePath);

//     let dir = 'C:\\Users\\SA\\Desktop\\NodeTasks\\SQL-Node-Task';

//     const filePath = resolve(dir, 'uploads', `products_${uuid}.csv`);

//     // Check if the file exists
//     if (filePath) {
//       await fs.access(filePath);
//     } else {
//       return res.status(404).json({ error: 'File not found' });
//     }
//     // Delete the file
//     await fs.unlink(filePath);
//     res.status(200).json({ message: 'File deleted successfully' });

//   } catch (error) {
//     console.error('Error deleting file:', error.message);
//     res.status(500).json({ error: 'Internal Server Error - Error deleting file' });
//   }
// }

async function deleteFile(req, res) {
  try {
    const fileName = req.params.uuid;
    await DownloadQueue.add({ fileName });
    res.json({
      message: "File Saved to the Download Folder",
    });
  } catch (error) {
    console.error('Error initiating download process:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export { getProducts, deleteFile };
