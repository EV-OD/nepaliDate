import type { BsCalendar } from '@/types';

export const bsCalendarData: BsCalendar = {
  "2076/1": { // Baishakh 2076
    bs_year: 2076,
    bs_month: 1,
    metadata: { 
      en: "Apr/May 2019", np: "बैशाख २०७६",
      ad_year_start: 2019, ad_month_start: 4, // April
      ad_year_end: 2019, ad_month_end: 5, // May
    },
    days: [
      { n: "१", e: "14", t: "प्रतिपदा", f: "नयाँ वर्ष", h: true, d: 1 }, // Sun, Apr 14 2019
      { n: "२", e: "15", t: "द्वितीया", f: "", h: false, d: 2 },
      // ... fill more days
      { n: "17", e: "30", t: "सप्तदशी", f: "", h: false, d: 3 }, // Tue, Apr 30 2019
      { n: "18", e: "1", t: "अष्टमी", f: "मातातीर्थ औंसी", h: false, d: 4 }, // Wed, May 1 2019
      // ... fill more days
      { n: "31", e: "14", t: "औँसी", f: "", h: false, d: 3 }, // Tue, May 14 2019
    ],
    holiFest: ["१ गते नयाँ वर्ष", "१८ गते मातातीर्थ औंसी"],
    marriage: ["५", "१५", "२५"], // Just numbers for simplicity in mock
    bratabandha: ["१०", "२०"]
  },
  "2076/2": { // Jestha 2076
    bs_year: 2076,
    bs_month: 2,
    metadata: { 
      en: "May/Jun 2019", np: "जेष्ठ २०७६",
      ad_year_start: 2019, ad_month_start: 5, // May
      ad_year_end: 2019, ad_month_end: 6, // June
    },
    days: Array.from({ length: 32 }, (_, i) => {
      const bsDay = i + 1;
      const adDayStartsOn = 15; // Jestha 1, 2076 is May 15, 2019
      let adDay = adDayStartsOn + i;
      let adMonth = 5; // May
      if (adDay > 31) { // Assuming May has 31 days
        adDay = adDay - 31;
        adMonth = 6; // June
      }
      return { 
        n: bsDay.toString(), 
        e: adDay.toString(), 
        t: bsDay === 1 ? "एकादशी" : bsDay === 2 ? "द्वादशी" : bsDay === 3 ? "त्रयोदशी" : "अन्य तिथि", 
        f: bsDay === 1 ? "मोहिनी एकादशी व्रत" : "", 
        h: false, 
        d: ((4 + i -1) % 7) + 1 // Jestha 1 is Wednesday (day 4 if Sun=1)
      };
    }),
    holiFest: [
        "१ गते मोहिनी एकादशी व्रत",
        "४ गते चण्डी पुर्णिमा, किराँत, राई, लिम्बु जातिको उर्भ्यौली पर्व, गौतम बुद्ध जयन्ती",
        "१५ गते गणतन्त्र दिवस",
        "१६ गते अपरा एकादशी व्रत",
        "२० गते हलो, निशि बार्ने, दर्श श्राद्द",
        "२१ गते गोसाईकुण्ड स्नान आरम्भ",
        "३० गते निर्जला एकादशी व्रत"
    ],
    marriage: [
        "२", "३", "४", "५", "९", "१४", "१५", "१६", "२१", "२५", "२६", "२७", "२८", "२९", "३०", "३१", "३२"
    ],
    bratabandha: [
        "९", "२९"
    ]
  },
  "2076/3": { // Ashadh 2076
    bs_year: 2076,
    bs_month: 3,
    metadata: { 
      en: "Jun/Jul 2019", np: "असार २०७६",
      ad_year_start: 2019, ad_month_start: 6, // June
      ad_year_end: 2019, ad_month_end: 7, // July
     },
    days: Array.from({ length: 31 }, (_, i) => { // Ashadh 2076 had 31 days
      const bsDay = i + 1;
      // Jestha 32, 2076 was June 15, 2019. So Ashadh 1, 2076 is June 16, 2019
      const adDayStartsOn = 16; 
      let adDay = adDayStartsOn + i;
      let adMonth = 6; // June
      if (adDay > 30) { // June has 30 days
        adDay = adDay - 30;
        adMonth = 7; // July
      }
      return { 
        n: bsDay.toString(), 
        e: adDay.toString(), 
        t: "तिथि", 
        f: bsDay === 15 ? "धान दिवस" : "", 
        h: false, 
        d: ((1 + i -1) % 7) + 1 // Ashadh 1 is Sunday (day 1)
      };
    }),
    holiFest: ["१५ गते धान दिवस", "हरिशयनी एकादशी"],
    marriage: ["५", "१०", "१५", "२०", "२५"],
    bratabandha: []
  },
  // Add a month for 2081 for testing range
   "2081/1": { // Baishakh 2081
    bs_year: 2081,
    bs_month: 1,
    metadata: { 
      en: "Apr/May 2024", np: "बैशाख २०८१",
      ad_year_start: 2024, ad_month_start: 4, // April
      ad_year_end: 2024, ad_month_end: 5, // May
    },
    days: Array.from({ length: 31 }, (_, i) => { // Baishakh 2081 typically 30/31 days, assume 31
      const bsDay = i + 1;
      const adDayStartsOn = 13; // Baishakh 1, 2081 is April 13, 2024
      let adDay = adDayStartsOn + i;
      let adMonth = 4; // April
      if (adDay > 30) { // April has 30 days
        adDay = adDay - 30;
        adMonth = 5; // May
      }
      return { 
        n: bsDay.toString(), 
        e: adDay.toString(), 
        t: "तिथि", 
        f: bsDay === 1 ? "नयाँ वर्ष २०८१" : "", 
        h: bsDay === 1, 
        d: ((7 + i -1) % 7) + 1 // April 13 2024 is Saturday (day 7)
      };
    }),
    holiFest: ["१ गते नयाँ वर्ष २०८१"],
    marriage: ["५", "१५", "२५"],
    bratabandha: ["१०", "२०"]
  },
};

// Helper to get number of days in a BS month for a given year
export function getDaysInBsMonth(year: number, month: number): number {
  const yearStr = year.toString();
  const monthIndex = month - 1;
  
  // Try to get from detailed bsCalendarData first
  const monthData = bsCalendarData[`${year}/${month}`];
  if (monthData) {
    return monthData.days.length;
  }
  
  // Fallback to DAYS_IN_BS_MONTH (less accurate, for UI population)
  const daysArray =DAYS_IN_BS_MONTH[yearStr];
  if (daysArray && daysArray[monthIndex] !== undefined) {
    return daysArray[monthIndex];
  }
  
  // Default fallback if year or month data is missing
  if (month === 2 || month === 4 ) return 32; // Jestha, Shrawan often 32
  if ([1,3,5].includes(month)) return 31; // Baishakh, Ashadh, Bhadra often 31
  return 30; // Default for others
}
