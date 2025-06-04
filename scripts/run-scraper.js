
const { scrapeData } = require('./calendar-scraper.js');
const fs = require('fs');

async function main() {
  const args = process.argv.slice(2); // Get command line arguments after node and script path

  const yearsToScrape = [];
  const yearMonthPairs = [];

  if (args.length === 0) {
    // Default: Scrape a couple of example months if no arguments are provided
    console.log("No arguments provided. Scraping example data for 2076/1 and 2076/2.");
    yearMonthPairs.push({ year: 2076, month: 1 });
    yearMonthPairs.push({ year: 2076, month: 2 });
  } else {
    args.forEach(arg => {
      if (arg.includes('/')) {
        const [yearStr, monthStr] = arg.split('/');
        const year = parseInt(yearStr);
        const month = parseInt(monthStr);
        if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
          yearMonthPairs.push({ year, month });
        } else {
          console.warn(`Skipping invalid year/month argument: ${arg}`);
        }
      } else {
        const year = parseInt(arg);
        if (!isNaN(year)) {
          yearsToScrape.push(year);
        } else {
          console.warn(`Skipping invalid year argument: ${arg}`);
        }
      }
    });
  }

  // Create the base 'data' directory if it doesn't exist
  const dataDir = './data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Scrape full years
  for (const year of yearsToScrape) {
    console.log(`Scraping all months for year ${year}...`);
    const yearDir = `${dataDir}/${year}`;
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true });
    }
    for (let month = 1; month <= 12; month++) {
      await scrapeData(year, month);
    }
  }

  // Scrape specific year/month pairs
  for (const pair of yearMonthPairs) {
    console.log(`Scraping for ${pair.year}/${pair.month}...`);
    const yearDir = `${dataDir}/${pair.year}`;
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true });
    }
    await scrapeData(pair.year, pair.month);
  }

  console.log("All scraping tasks initiated.");
  console.log("Check console output above for status of each task.");
}

main().catch(error => {
  console.error("Scraping process encountered an error:", error);
});
