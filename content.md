
# Date Bliss Application - Page Content Analysis

This document provides a detailed breakdown of the textual content on each key page of the Date Bliss application. It is intended for SEO analysis, content strategy, and ensuring keyword alignment.

## Table of Contents
1.  [Homepage (`/`)](#homepage--)
2.  [BS to AD Converter (`/bs-to-ad`)](#bs-to-ad-converter--bs-to-ad)
3.  [AD to BS Converter (`/ad-to-bs`)](#ad-to-bs-converter--ad-to-bs)
4.  [API Information Page (`/api-info`)](#api-information-page--api-info)
5.  [API Playground (`/api-playground`)](#api-playground--api-playground)

---

## 1. Homepage (`/`)

*   **Route:** `/`
*   **Main Heading (H1 Equivalent - Visual):** "Welcome to Date Bliss" (Accompanied by `CalendarDays` icon)
*   **Main Descriptive Paragraph:** "Your one-stop solution for Bikram Sambat (BS) and Gregorian (AD) date conversions, enriched with holiday and event insights for the Nepali calendar."
*   **Section Cards:**
    *   **Card 1: BS to AD Converter**
        *   **Heading (H2 Equivalent - CardTitle):** "BS to AD Converter" (Accompanied by `ArrowRightLeft` icon)
        *   **Description (CardDescription):** "Convert Bikram Sambat dates to Gregorian dates and see relevant Nepali calendar events."
        *   **Button Text:** "Go to BS to AD Converter"
        *   **Button Link:** `/bs-to-ad`
    *   **Card 2: AD to BS Converter**
        *   **Heading (H2 Equivalent - CardTitle):** "AD to BS Converter" (Accompanied by `ArrowRightLeft` icon)
        *   **Description (CardDescription):** "Convert Gregorian dates to Bikram Sambat dates and explore Nepali Patro events."
        *   **Button Text:** "Go to AD to BS Converter"
        *   **Button Link:** `/ad-to-bs`
    *   **Card 3: Nepali Calendar API**
        *   **Heading (H2 Equivalent - CardTitle):** "Nepali Calendar API" (Accompanied by `ServerIcon` icon)
        *   **Description (CardDescription):** "Explore our API for Bikram Sambat calendar data, holidays, and events."
        *   **Button Text:** "View API Details"
        *   **Button Link:** `/api-info`

---

## 2. BS to AD Converter (`/bs-to-ad`)

*   **Route:** `/bs-to-ad`
*   **Main Card Heading (H1 Equivalent - CardTitle):** "Bikram Sambat (BS) to Gregorian (AD)"
*   **Main Card Description (CardDescription):** "Enter a BS date to convert it to AD and see relevant Nepali calendar events."
*   **Form Fields & Labels:**
    *   **Label:** "BS Year" (Associated with a `Select` component for BS Year)
    *   **Label:** "BS Month" (Associated with a `Select` component for BS Month)
    *   **Label:** "BS Day" (Associated with a `Select` component for BS Day)
*   **Button Text:** "Convert to AD" (Triggers conversion server action)
    *   **Loading State Text (within button):** (Implied by `Loader2` icon)
*   **Result Display (Dynamic Content):**
    *   **Label (Static):** "Gregorian (AD) Date"
    *   **Date Output Format:** "{AD_Day} {AD_Month_Name} {AD_Year}" (e.g., "14 April 2024")
    *   **Day of Week Output Format:** "{AD_Day_Of_Week}" (e.g., "Sunday")
*   **Event Summary Display (Dynamic Content):**
    *   **Section Title:** "Events & Holidays: {BS_Month_Name} {BS_Year}" (e.g., "Events & Holidays: Baishakh 2080")
    *   **Subsection Title 1:** "Holidays & Festivals" (Accompanied by `Sparkles` icon)
        *   **Event Item Format:** Day Badge (e.g., "०१") + Event Description (e.g., "नव वर्ष २०८० आरम्भ")
        *   Multiple events on the same day are listed under the same badge.
        *   Events without a specific day (marked "•") are displayed individually.
    *   **Subsection Title 2:** "Auspicious Marriage Dates" (Accompanied by `Heart` icon)
        *   **Event Item Format:** List of dates (e.g., "२, ४, ६ गते") or message "यो महिना को लागी विवाह मुर्हुत छैन ।"
    *   **Subsection Title 3:** "Auspicious Bratabandha Dates" (Accompanied by `Milestone` icon)
        *   **Event Item Format:** List of dates (e.g., "२३ र २८ गते") or message "यो महिना को लागी ब्रतबन्ध मुर्हुत छैन ।"
    *   **Loading State (Visual):** Animated placeholders (skeletons) for title and event items.
    *   **Error State Message (if event data fails):** `{eventDataError}` (e.g., "Could not retrieve event data...")
    *   **No Events Message (if data is loaded but empty):** "No Specific Events Found..."
*   **Toast Messages (Dynamic, on action):**
    *   **Success Toast Title:** "Conversion Successful"
    *   **Success Toast Description:** "Converted BS {Day}/{Month}/{Year} to AD."
    *   **Error Toast Title:** "Conversion Error"
    *   **Error Toast Description:** `{error_message_from_conversion_logic}`
    *   **General Error Toast Title:** "Error"
    *   **General Error Toast Description:** `{error_message_from_exception}`

---

## 3. AD to BS Converter (`/ad-to-bs`)

*   **Route:** `/ad-to-bs`
*   **Main Card Heading (H1 Equivalent - CardTitle):** "Gregorian (AD) to Bikram Sambat (BS)"
*   **Main Card Description (CardDescription):** "Enter an AD date to convert it to BS and see relevant Nepali calendar events."
*   **Form Fields & Labels:**
    *   **Label:** "AD Date" (Associated with a `Calendar` popover component)
        *   **Calendar Popover Button Text (Default):** "Pick a date"
        *   **Calendar Popover Button Text (Selected):** "{Formatted AD Date, e.g., January 1, 2024}"
*   **Button Text:** "Convert to BS" (Triggers conversion server action)
    *   **Loading State Text (within button):** (Implied by `Loader2` icon)
*   **Result Display (Dynamic Content):**
    *   **Label (Static):** "Bikram Sambat (BS) Date"
    *   **Date Output Format:** "{BS_Day} {BS_Month_Name} {BS_Year}" (e.g., "1 Baishakh 2080")
    *   **Day of Week Output Format:** "{BS_Day_Of_Week}" (e.g., "Friday")
*   **Event Summary Display (Dynamic Content):**
    *   **Section Title:** "Events & Holidays: {BS_Month_Name} {BS_Year}" (e.g., "Events & Holidays: Baishakh 2080")
    *   (Subsections for Holidays, Marriage, Bratabandha are identical in format to the BS to AD converter page)
    *   **Loading State (Visual):** Animated placeholders.
    *   **Error State Message (if event data fails):** `{eventDataError}`
    *   **No Events Message (if data is loaded but empty):** "No Specific Events Found..."
*   **Toast Messages (Dynamic, on action):**
    *   **Success Toast Title:** "Conversion Successful"
    *   **Success Toast Description:** "Converted AD {Day}/{Month}/{Year} to BS."
    *   **Error Toast Title:** "Conversion Error"
    *   **Error Toast Description:** `{error_message_from_conversion_logic}`
    *   **General Error Toast Title:** "Error"
    *   **General Error Toast Description:** `{error_message_from_exception}`

---

## 4. API Information Page (`/api-info`)

*   **Route:** `/api-info`
*   **Main Page Title (H1 - Dynamic from API):** `apiInfoData.apiName` (e.g., "Date Bliss Calendar API")
*   **Main Page Description (Paragraph - Dynamic from API):** `apiInfoData.description` (e.g., "A comprehensive API for Bikram Sambat (BS) to Gregorian (AD) date conversions...")
*   **Badges (Dynamic from API):**
    *   "Version: {apiInfoData.version}"
    *   "Status: {apiInfoData.status}" (Styled based on status)
*   **Contact Information (Dynamic from API):** "Contact: <a href='mailto:{apiInfoData.contactEmail}'>{apiInfoData.contactEmail}</a>"
*   **Button to Playground:**
    *   **Text:** "Go to API Playground" (Accompanied by `PlayCircle` icon)
    *   **Link:** `/api-playground`
*   **Section 1: API Endpoints**
    *   **Heading (H2 Equivalent - CardTitle):** "API Endpoints" (Accompanied by `Network` icon)
    *   **Description (CardDescription):** "Detailed information about each available API endpoint for the Nepali Calendar."
    *   **Accordion Items (Dynamic from `apiInfoData.endpoints`):**
        *   **Trigger Text:** "{HTTP_METHOD} {ENDPOINT_PATH}" (e.g., "GET /api/calendar/info")
        *   **Content:**
            *   **Description:** `endpoint.description`
            *   **Parameters Heading:** "Parameters:"
                *   **Parameter Item Format:** "`{param.name}` ({param.type}, in {param.in}): {param.description} (required)"
            *   **Example Request Heading:** "Example Request:"
            *   **Example Request Code:** `endpoint.exampleRequest`
            *   **Example Response Heading:** "Example Response:" (or "Example Response Summary:")
            *   **Example Response JSON/Text:** `endpoint.exampleResponse` or `endpoint.exampleResponseSummary` (Rendered in a code block)
            *   **Link to Data Structures:** "For detailed field descriptions, see the Data Structures section."
            *   **Possible Error Responses Heading:** "Possible Error Responses:"
                *   **Error Item Format:** Badge "{err.statusCode}" + `err.description`
*   **Section 2: Data Structures**
    *   **Heading (H2 Equivalent - CardTitle):** "Data Structures" (Accompanied by `ListTree` icon)
    *   **Description (CardDescription):** "Explanation of the JSON data structures returned by the Bikram Sambat Calendar API."
    *   **Data Structure Blocks (Dynamic from `apiInfoData.dataStructures`):**
        *   **Structure Name (H3):** e.g., "BsMonthData", "BsDayData" (in `font-mono`)
        *   **Structure Description:** `structure.description`
        *   **Fields Table:**
            *   **Columns:** "Field Name", "Type", "Description"
            *   **Rows (Dynamic from `structure.fields`):** `{field.name}`, `{field.type}`, `{field.description}`
            *   **Nested Fields:** If a field has sub-fields, a nested table is rendered.
*   **Section 3: Data Coverage & Notes**
    *   **Heading (H2 Equivalent - CardTitle):** "Data Coverage & Notes" (Accompanied by `Database` icon)
    *   **Description (CardDescription):** "Information about the Bikram Sambat data provided by the API."
    *   **Available Years Heading:** "Available Bikram Sambat Years in Data:"
    *   **Available Years Text:** `apiInfoData.dataCoverage.bsYears`
    *   **Alert: Data Source & Accuracy**
        *   **Title (AlertTitle):** "Data Source & Accuracy" (Accompanied by `Info` icon)
        *   **Description (AlertDescription):** `apiInfoData.dataCoverage.note`
    *   **Important Notes Heading:** "Important Notes:"
    *   **Notes List (Dynamic from `apiInfoData.notes`):** List items for each note.
*   **Footer Note (Static + Dynamic):** "API Documentation last updated: {new Date().toLocaleDateString(...)}"
*   **Loading State:** "Loading API information..." (with spinner)
*   **Error State (if API info fetch fails):**
    *   **Title:** "Error Fetching API Information"
    *   **Description:** `{error_message}`

---

## 5. API Playground (`/api-playground`)

*   **Route:** `/api-playground`
*   **Main Card Heading (H1 Equivalent - CardTitle):** "API Playground" (Accompanied by `TestTube2` icon)
*   **Main Card Description (CardDescription):** "Test the `/api/calendar/[YYYY]/[MM]` endpoint. View the full API documentation <a href='/api-info'>here</a>."
*   **Form Fields & Labels:**
    *   **Label:** "Bikram Sambat Year (YYYY)" (Associated with a `Select` for BS Year)
    *   **Label:** "Bikram Sambat Month (MM)" (Associated with a `Select` for BS Month)
    *   **Label (Dynamic):** "Request URL"
        *   **URL Display:** `"{baseUrl}/api/calendar/{selected_year}/{selected_month}"`
*   **Buttons:**
    *   **Button 1 Text:** "Send Request" (Triggers API call, accompanied by `PlayCircle` or `Loader2` icon)
    *   **Button 2 Text:** "Open" (Opens request URL in new tab, accompanied by `ExternalLink` icon)
*   **API Response Section (Dynamic, appears after request):**
    *   **Section Heading:** "API Response" (Accompanied by `Code` icon)
    *   **Status Display:** "Status: {statusCode}" (e.g., "Status: 200" or "Status: 404")
    *   **Error Display (if error):**
        *   **Error Heading:** "Error:"
        *   **Error Message:** `{errorMessage}`
    *   **Response Body Display (if successful or error with body):**
        *   **Body Heading:** "Response Body:"
        *   **Content:** JSON data rendered in a code block.
*   **Toast Messages (Dynamic, on action):**
    *   **Success Toast Title:** "Success"
    *   **Success Toast Description:** "API request successful."
    *   **Error Toast Title (from response):** "Error: {statusCode}"
    *   **Error Toast Description (from response):** `{error_message_from_api}`
    *   **Fetch Error Toast Title:** "Fetch Error"
    *   **Fetch Error Toast Description:** `{error_message_from_fetch_exception}`
    *   **URL Error Toast Title:** "Error"
    *   **URL Error Toast Description:** "Could not construct request URL."

---
This provides a comprehensive overview of the textual content present on the main pages of the Date Bliss application.

    