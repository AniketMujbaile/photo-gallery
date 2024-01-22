const express = require('express');
const { exec } = require('child_process');
const sharp = require('sharp');
const app = express();
const port = 3000;

// Set the path to dcraw executable
const dcrawPath = 'C:\\path\\to\\dcraw.exe'; // Replace with the actual path to dcraw

app.get('/', async (req, res) => {
  try {
    const imagePath = 'C:\\Users\\ACER\\OneDrive\\Desktop\\Data\\_DSC8596.ARW';
    const convertedImagePath = await convertRawToJpeg(imagePath);
    const processedImage = await processImage(convertedImagePath);
    res.json({ processedImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

async function convertRawToJpeg(rawPath) {
  return new Promise((resolve, reject) => {
    const outputPath = rawPath.replace('.ARW', '.jpg'); // Output path for the converted image
    const command = `${dcrawPath} -c -e "${rawPath}" | convert - "${outputPath}"`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`Error converting RAW to JPEG: ${stderr || err.message}`));
      } else {
        resolve(outputPath);
      }
    });
  });
}

async function processImage(imagePath) {
  try {
    const processedImage = await sharp(imagePath).resize(300).toBuffer();
    // Further processing or conversion to base64 as needed
    return 'Processed image data'; // Replace with actual processed image data
  } catch (error) {
    throw new Error(`Error processing image: ${error.message}`);
  }
}
