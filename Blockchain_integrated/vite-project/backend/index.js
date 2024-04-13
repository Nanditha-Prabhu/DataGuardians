import express from 'express';
import multer from 'multer';
import csvtojson from 'csvtojson';
import { MongoClient } from 'mongodb';
import cors from 'cors'; // Import cors middleware
import dotenv from 'dotenv';
dotenv.config();



const app = express();
const port = 3001;
const mongoURL ="mongodb+srv://satwikroopa:Roopa70263@fruitdb.8sxipgz.mongodb.net/?retryWrites=true&w=majority&appName=FruitDb";

// const mongoURL = process.env.MONGO_URL;
const dbName = 'KSP_Database';

// Use cors middleware
app.use(cors());

// Multer middleware for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Route for file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).send('No file uploaded');
      return;
    }

    const jsonArray = await csvtojson().fromFile(file.path);
    const fileName = file.originalname.replace(/\.[^/.]+$/, ""); // Extract file name without extension

    // Connect to MongoDB
    const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true ,});
    const db = client.db(dbName);
    const collection = db.collection(fileName);

    // Insert data into MongoDB
    await collection.insertMany(jsonArray);

    // Close MongoDB connection
    client.close();

    res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
