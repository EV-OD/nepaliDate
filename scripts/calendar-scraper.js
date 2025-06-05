
const axios = require('axios');
const fs = require("fs");
const { JSDOM } = require("jsdom");

const DAYS = ["आईतवार", "सोमवार", "मंगलवार", "बुधवार", "बिहीवार", "शुक्रवार", "शनिवार"];

const NEPALI_TO_ENGLISH_NUMERAL_MAP = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
};

function nepaliToEnglishNumerals(nepaliString) {
    if (!nepaliString) return "";
    return nepaliString.split('').map(char => NEPALI_TO_ENGLISH_NUMERAL_MAP[char] || char).join('');
}

const _fetchData = async (year, month) => {
    try {
        console.log("fetching", year, month);
        // Ensure the base data directory exists
        if (!fs.existsSync(`./data`)) {
            fs.mkdirSync(`./data`, { recursive: true });
        }
        // Ensure the year-specific directory exists
        if (!fs.existsSync(`./data/${year}`)) {
            fs.mkdirSync(`./data/${year}`, { recursive: true });
        }

        if (fs.existsSync(`./data/${year}/${month}.json`)) {
            console.log(`Data already exists for ${year}/${month}: ./data/${year}/${month}.json. Skipping fetch.`);
            return;
        }

        const { data } = await axios({
            method: 'post',
            url: 'https://nepalicalendar.rat32.com/index_nep.php',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: `selYear=${year}&selMonth=${month}&viewCalander=View+Calander`,
        });

        let dom = new JSDOM(data);

        // metadata
        let metadata = {
            en: dom.window.document.querySelector("#entarikYr").textContent.trim(),
            np: dom.window.document.querySelector("#yren").textContent.trim(),
        }

        // holidays & festivals
        let holiFest = [];
        const holiCTable = dom.window.document.querySelector("#holiC table tbody");
        if (holiCTable) {
            const rows = holiCTable.querySelectorAll("tr");
            rows.forEach(row => {
                const cells = row.querySelectorAll("td");
                if (cells.length === 2) {
                    const dayPart = cells[0].textContent.trim();
                    let descPart = cells[1].textContent.trim().replace(/\s\s+/g, ' '); // Replace multiple spaces/newlines
                    
                    if (dayPart && descPart) {
                        holiFest.push(`${dayPart} ${descPart}`);
                    } else if (descPart) { // Handle cases where dayPart might be empty (though unlikely for this structure)
                        holiFest.push(descPart);
                    }
                }
            });
        }
        // Fallback if the table structure isn't found or doesn't yield results
        if (holiFest.length === 0) {
            const holiElementRoot = dom.window.document.querySelector("#holi");
            if (holiElementRoot) {
                const holiBElement = holiElementRoot.querySelector("b");
                if (holiBElement) holiBElement.remove();
                const holiAElement = holiElementRoot.querySelector("a");
                if (holiAElement) holiAElement.remove();
                const holiContentElement = dom.window.document.querySelector("#holiC") || holiElementRoot; // Prefer #holiC if available
                holiFest = holiContentElement.textContent.trim().split('\n').map(s => s.trim().replace(/\s\s+/g, ' ')).filter(s => s && s !== "See Calendar in English Language");
            }
        }


        // marriage date
        const bibahElement = dom.window.document.querySelector("#bibah");
        if (bibahElement) {
            const bibahBElement = bibahElement.querySelector("b");
            if (bibahBElement) bibahBElement.remove();
        }
        let marriage = bibahElement ? bibahElement.textContent.trim().split('\n').map(s => s.trim()).filter(s => s) : [];

        // bratabandha date
        const bratabandhaElement = dom.window.document.querySelector("#bratabandha");
        if (bratabandhaElement) {
            const bratabandhaBElement = bratabandhaElement.querySelector("b");
            if (bratabandhaBElement) bratabandhaBElement.remove();
        }
        let bratabandha = bratabandhaElement ? bratabandhaElement.textContent.trim().split('\n').map(s => s.trim()).filter(s => s) : [];


        let days = [];

        let dayCount = 1; 
        let arr = Array.from(dom.window.document.querySelectorAll('.cells'));
        arr.forEach(cell => {
            const ndayContent = cell.querySelector('#nday') ? cell.querySelector('#nday').textContent.trim() : "";
            if (!ndayContent) {
                return; 
            }

            // Re-parse individual cell for cleaner access to its direct children
            // This avoids carrying over context from previous JSDOM initializations if any issue.
            const cellDom = new JSDOM(cell.innerHTML); 
            
            const ndayNode = cellDom.window.document.querySelector('#nday');
            const edayNode = cellDom.window.document.querySelector('#eday');
            const dashiNode = cellDom.window.document.querySelector('#dashi');
            const festNode = cellDom.window.document.querySelector('#fest');
            const fontNode = ndayNode ? ndayNode.querySelector('font') : null;

            const nepaliDayString = ndayNode ? ndayNode.textContent.trim() : "";
            const englishEquivalentNepaliDay = nepaliToEnglishNumerals(nepaliDayString);

            days.push({
                n: nepaliDayString,
                ne: englishEquivalentNepaliDay,
                e: edayNode ? edayNode.textContent.trim() : "",
                t: dashiNode ? dashiNode.textContent.trim() : "",
                f: festNode ? festNode.textContent.trim() : "",
                h: fontNode ? fontNode.getAttribute('color')?.trim() == "red" : false,
                d: dayCount 
            });

            dayCount++;
            if (dayCount > 7) dayCount = 1;
        })

        // write to file
        fs.writeFileSync(`./data/${year}/${month}.json`, JSON.stringify({ metadata, days, holiFest, marriage, bratabandha }, null, 2));
        console.log("Done", year, month, ` -> ./data/${year}/${month}.json`);
    } catch (e) {
        console.error(`Error fetching data for ${year}/${month}:`, e.message);
        if (e.response) {
            console.error("Response data:", e.response.data);
            console.error("Response status:", e.response.status);
        }
    }
}

const scrapeData = async (year, month) => {
    await _fetchData(year, month);
}

module.exports = { scrapeData };
