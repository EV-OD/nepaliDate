
# NepaliDate API Documentation

## 1. Overview

The NepaliDate API provides comprehensive access to Bikram Sambat (BS) calendar data, including BS to Gregorian (AD) date information, Nepali holidays, festivals, tithis (lunar days), and auspicious dates for a given BS month or entire BS year. It's designed for developers looking to integrate Nepali Patro data into their applications.

**Current Version:** 1.3.0
**Status:** Operational

## 2. Authentication

All API endpoints under `/api/calendar/` require an API key for access.

*   **Type**: API Key
*   **Header Name**: `X-API-Key`
*   **Description**: A valid API key must be provided in the `X-API-Key` request header for all `/api/calendar/*` endpoints.
*   **How to get an API Key**: Please visit the [Get API Key page on our website](/get-api-key) for instructions on how to request your key.

**Example Request Header:**
```
X-API-Key: YOUR_SECRET_API_KEY
```

## 3. Base URL

The base URL for all API requests will be your application's deployed domain. For local development, it's typically `http://localhost:9002` (or your configured port). Replace `https://your-nepalidate-app.com` in examples with your actual domain.

## 4. API Endpoints

### 4.1. Get API Information

*   **Method**: `GET`
*   **Path**: `/api/calendar/info`
*   **Description**: Provides detailed information about the Nepali Calendar API, including available endpoints, data structures, data coverage for Bikram Sambat years, and usage notes. Requires API Key.
*   **Parameters**: None.
*   **Example Request**:
    ```
    GET https://your-nepalidate-app.com/api/calendar/info
    Headers:
      X-API-Key: YOUR_SECRET_API_KEY
    ```
*   **Example Response Summary**:
    A JSON object detailing the API capabilities, version, status, contact, endpoints, data structures, and data coverage notes (similar to the content of this document, dynamically generated).
*   **Possible Error Responses**:
    *   `401 Unauthorized`: Invalid or missing API Key.

### 4.2. Get BS Year Data

*   **Method**: `GET`
*   **Path**: `/api/calendar/{YYYY}`
*   **Description**: Retrieves all Bikram Sambat (BS) calendar data for a specific BS year (YYYY), including all 12 months. Each month's data includes daily details, Nepali holidays, festivals, and other events. Requires API Key.
*   **Path Parameters**:
    *   `YYYY` (integer, required): The Bikram Sambat year (e.g., 2079). Data intended to be available from BS 1992 to 2110.
*   **Example Request**:
    ```
    GET https://your-nepalidate-app.com/api/calendar/2079
    Headers:
      X-API-Key: YOUR_SECRET_API_KEY
    ```
*   **Example Response Structure (Array of `BsMonthData` objects)**:
    ```json
    [
      {
        "bs_year": 2079,
        "bs_month": 1,
        "metadata": {
          "en": "Apr/May 2022",
          "np": "बैशाख २०७९",
          "ad_year_start": 2022,
          "ad_month_start": 4,
          "ad_year_end": 2022,
          "ad_month_end": 5
        },
        "days": [
          { "n": "१", "ne": "1", "e": "14", "t": "त्रयोदशी", "f": "नव वर्ष २०७९ आरम्भ, महावीर जयन्ती", "h": true, "d": 1 }
          // ... more days
        ],
        "holiFest": ["१_::_नव वर्ष २०७९ आरम्भ, महावीर जयन्ती"],
        "marriage": ["२, ४, ६, ७, ८, ९, १०, १४, १९, २०, २१, २६, २७, २८, २९, ३० र  ३१ गते"],
        "bratabandha": ["२३ र २८  गते"]
      }
      // ... data for other months of the year
    ]
    ```
*   **Possible Error Responses**:
    *   `400 Bad Request`: Invalid year format.
    *   `401 Unauthorized`: Invalid or missing API Key.
    *   `404 Not Found`: Data not found for the specified BS year. The response will list available years based on scraped data.

### 4.3. Get BS Month Data

*   **Method**: `GET`
*   **Path**: `/api/calendar/{YYYY}/{MM}`
*   **Description**: Retrieves Bikram Sambat (BS) calendar data for a specific BS year (YYYY) and month (MM, 1-12). Includes daily details, Nepali holidays, festivals, and other events. Requires API Key.
*   **Path Parameters**:
    *   `YYYY` (integer, required): The Bikram Sambat year (e.g., 2079). Data intended to be available from BS 1992 to 2110.
    *   `MM` (integer, required): The Bikram Sambat month (1 for Baishakh, ..., 12 for Chaitra).
*   **Example Request**:
    ```
    GET https://your-nepalidate-app.com/api/calendar/2079/1
    Headers:
      X-API-Key: YOUR_SECRET_API_KEY
    ```
*   **Example Response Structure (`BsMonthData` object)**:
    ```json
    {
      "bs_year": 2079,
      "bs_month": 1,
      "metadata": {
        "en": "Apr/May 2022",
        "np": "बैशाख २०७९",
        "ad_year_start": 2022,
        "ad_month_start": 4,
        "ad_year_end": 2022,
        "ad_month_end": 5
      },
      "days": [
        { "n": "१", "ne": "1", "e": "14", "t": "त्रयोदशी", "f": "नव वर्ष २०७९ आरम्भ, महावीर जयन्ती", "h": true, "d": 1 },
        { "n": "२", "ne": "2", "e": "15", "t": "चतुर्दशी", "f": "", "h": false, "d": 2 }
        // ... more days
      ],
      "holiFest": ["१_::_नव वर्ष २०७९ आरम्भ, महावीर जयन्ती"],
      "marriage": ["२, ४, ६, ७, ८, ९, १०, १४, १९, २०, २१, २६, २७, २८, २९, ३० र  ३१ गते"],
      "bratabandha": ["२३ र २८  गते"]
    }
    ```
*   **Possible Error Responses**:
    *   `400 Bad Request`: Invalid year or month format.
    *   `401 Unauthorized`: Invalid or missing API Key.
    *   `404 Not Found`: Data not found for the specified BS year/month. The response will list available years based on scraped data.

## 5. Data Structures

### 5.1. `BsMonthData` Object

Represents all calendar data for a specific Bikram Sambat (BS) month.

| Field         | Type                  | Description                                                                                                                               |
|---------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `bs_year`     | integer               | The Bikram Sambat year.                                                                                                                   |
| `bs_month`    | integer               | The Bikram Sambat month (1 for Baishakh to 12 for Chaitra).                                                                                 |
| `metadata`    | object                | Metadata about the BS month. See `BsMonthData.metadata` below.                                                                            |
| `days`        | array&lt;BsDayData&gt;     | An array of day objects for the month. See `BsDayData` below.                                                                             |
| `holiFest`    | array&lt;string&gt;    | List of Nepali holidays/festivals. Format: 'Day_::_Description'. 'Day' is BS day (Nepali numeral or '•'). Multiple events comma-separated. |
| `marriage`    | array&lt;string&gt;    | List of auspicious marriage (vivah) dates in the BS month or a message if none.                                                            |
| `bratabandha` | array&lt;string&gt;    | List of auspicious bratabandha dates in the BS month or a message if none.                                                                 |

#### `BsMonthData.metadata` Object

| Field            | Type    | Description                                                                                                |
|------------------|---------|------------------------------------------------------------------------------------------------------------|
| `en`             | string  | English representation of the AD month(s) and year(s) this BS month spans (e.g., 'Apr/May 2023').         |
| `np`             | string  | Nepali representation of the BS month and year (e.g., 'बैशाख २०८०').                                       |
| `ad_year_start`  | integer | The Gregorian year in which the BS month begins.                                                           |
| `ad_month_start` | integer | The Gregorian month (1-12) in which the BS month begins.                                                    |
| `ad_year_end`    | integer | The Gregorian year in which the BS month ends.                                                             |
| `ad_month_end`   | integer | The Gregorian month (1-12) in which the BS month ends.                                                      |

### 5.2. `BsDayData` Object

Represents data for a single day in the Bikram Sambat calendar.

| Field | Type    | Description                                                                                                            |
|-------|---------|------------------------------------------------------------------------------------------------------------------------|
| `n`   | string  | Nepali date numeral (e.g., '१', '३२').                                                                                 |
| `ne`  | string  | Nepali date in English numerals (e.g., '1', '32'). Can be '•' for special, non-day-specific entries in `holiFest`.    |
| `e`   | string  | Corresponding Gregorian day of the month (e.g., '14'). May be empty for special '•' entries.                           |
| `t`   | string  | Tithi (lunar day, e.g., 'नवमी'). May be empty.                                                                          |
| `f`   | string  | Festivals or events occurring on this day. Multiple events may be comma-separated. Can be empty.                       |
| `h`   | boolean | Indicates if the day is a public holiday (true) or not (false).                                                        |
| `d`   | integer | Day of the week (1 for Sunday, ..., 7 for Saturday). Can be 0 if not applicable (e.g., special '•' entries).         |

## 6. Data Coverage & Notes

*   **Available BS Years**: The application aims to support Bikram Sambat years from 1992 to 2110. The actual availability of data for a specific year depends on the success of the data scraping process from `nepalicalendar.rat32.com`. You can check currently loaded years via the `/api/calendar/info` endpoint.
*   **Data Source**: The data for this Nepali Calendar API is sourced from publicly available Nepali calendar information scraped from `nepalicalendar.rat32.com`. While efforts are made for accuracy, data should be verified for critical applications.
*   The `holiFest` array uses a 'Day_::_Description' format. 'Day' can be a Nepali numeral or '•' for month-wide notes. Multiple descriptions for the same day are comma-separated after the delimiter.
*   The `ne` field in `BsDayData` provides the Nepali day as an English numeral string, useful for programmatic access.
*   Always check the `h` field in `BsDayData` to determine if a specific day is a Nepali holiday.

## 7. Contact

For API support, questions, or to report issues, please contact: `contact@sevenx.com.np`.

## 8. API Playground

Test these API endpoints interactively at [NepaliDate API Playground](/api-playground). You will need your API key.

---
