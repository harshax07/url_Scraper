const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  // Set the URL of the website to scrape
  const url = 'https://www.cricbuzz.com';

  // Send an HTTP GET request to the website
  fetch(url)
    .then(response => response.text())
    .then(html => {
      // Load the HTML response into Cheerio
      const $ = cheerio.load(html);

      // Extract all the anchor elements and their href attributes
      const links = $('a');
      const urls = [];
      links.each(function () {
        urls.push($(this).attr('href'));
      });

      const regex01 = /^\/live-cricket-scores\/.+$/;
      const filterURL = urls.filter(str => regex01.test(str));
      res.json(filterURL.slice(0, 4));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while scraping the website.' });
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
