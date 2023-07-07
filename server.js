const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

// Define the endpoint to handle the search request
app.post('/search', async (req, res) => {
    );
    try {
        const { url } = req.body;

        // Call the function to get the video URL
        const videoUrl = await getVideoUrl(url);

        if (videoUrl) {
            // Generate the HTML response with video and download button
            const videoSnippet = `<video src="${videoUrl}" controls class="mx-auto mb-4"></video>`;
            const downloadButton = `<a href="${videoUrl}" download class="block text-center bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded">Download</a>`;
            const newDownload = `<a href="/" class="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Download Another One</a>`;

            // Combine video and download button in HTML response
            const htmlResponse = `
        <html>
        <head>
          <title>Video Result</title>
        </head>
        <body class="flex justify-center items-center min-h-screen">
          <div class="max-w-md w-full mx-auto p-4">
            <h1 class="text-3xl text-center mb-4">Video Result</h1>
            ${videoSnippet}
            ${downloadButton}
            ${newDownload}
          </div>
        </body>
        </html>
      `;

            // Send the HTML response back to the webpage
            res.send(htmlResponse);
        } else {
            res.status(404).json({ error: 'Not a Video Post' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Function to get the video URL using puppeteer
async function getVideoUrl(url) {
    // Launch a headless Chrome browser
    const browser = await puppeteer.launch();

    // Open a new browser page
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url);

    // Wait for the video element to be present on the page
    await page.waitForSelector('video');

    // Extract the video URL
    const videoUrl = await page.evaluate(() => {
        const videoElement = document.querySelector('video');
        return videoElement ? videoElement.src : null;
    });

    // Close the browser
    await browser.close();

    return videoUrl;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
