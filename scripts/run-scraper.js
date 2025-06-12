
const { scrapeData } = require('./calendar-scraper.js');
const fs = require('fs');

async function main() {
  const startYear = 1992;
  const endYear = 2110; // Updated endYear

  console.log(`Starting to scrape calendar data from BS year ${startYear} to ${endYear}.`);

  // Create the base 'data' directory if it doesn't exist
  const dataDir = './data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`Created base data directory: ${dataDir}`);
  }

  for (let year = startYear; year <= endYear; year++) {
    console.log(`\nScraping all months for year ${year}...`);
    const yearDir = `${dataDir}/${year}`;
    if (!fs.existsSync(yearDir)) {
      fs.mkdirSync(yearDir, { recursive: true });
      console.log(`Created directory for year ${year}: ${yearDir}`);
    }
    for (let month = 1; month <= 12; month++) {
      // The scrapeData function itself logs "fetching year, month" and "Done year, month"
      // or an error if one occurs.
      try {
        await scrapeData(year, month);
      } catch (error) {
        // scrapeData already logs its own errors, but we can log a general error here too
        console.error(`An error occurred while trying to initiate scraping for ${year}/${month}:`, error.message);
      }
    }
    console.log(`Completed initiating scraping for all months in year ${year}.`);
  }

  console.log("\nAll scraping tasks for the specified year range have been initiated.");
  console.log("Please check the console output above for the status of each individual scraping task.");
  console.log(`Data will be saved in the '${dataDir}' directory.`);
}

main().catch(error => {
  console.error("The main scraping process encountered an unhandled error:", error);
});
