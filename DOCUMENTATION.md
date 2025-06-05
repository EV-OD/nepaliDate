
# NepaliDate Application Documentation

## 1. Project Overview

**App Name:** NepaliDate

**Core Mission:** To provide a user-friendly and reliable tool for converting dates between Bikram Sambat (BS) and Gregorian (AD) calendars, and to offer information about Nepali holidays and events for specific BS months. The application also exposes a Nepali Calendar API for programmatic access to this Bikram Sambat calendar data.

**Tech Stack:**
*   **Framework:** Next.js (with App Router)
*   **Language:** TypeScript
*   **UI Library:** React
*   **Component Library:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **AI Integration:** Genkit (for potential future AI-driven features, currently includes a holiday/event summarizer flow)
*   **Data Storage:** JSON files for Bikram Sambat calendar data

## 2. Core Features

*   **Date Conversion:**
    *   Bikram Sambat (BS) to Gregorian (AD) Converter
    *   Gregorian (AD) to Bikram Sambat (BS) Converter
*   **Date Validation:** Input validation notifies users of impossible date inputs (e.g., BS day exceeding days in the month).
*   **Date Picker:** User-friendly date picker components for easy date selection in both BS and AD converters.
*   **Event Display:** For a selected/converted BS month, the application displays Nepali holidays and events:
    *   Holidays and Festivals (`holiFest`) from the Nepali Patro
    *   Auspicious Marriage Dates (`marriage`)
    *   Auspicious Bratabandha Dates (`bratabandha`)
*   **Nepali Calendar API Access:**
    *   `/api/calendar/info`: Provides detailed API documentation for the Bikram Sambat calendar data.
    *   `/api/calendar/{YYYY}`: Fetches all calendar data for a specific BS year (YYYY).
    *   `/api/calendar/{YYYY}/{MM}`: Fetches calendar data for a specific BS year (YYYY) and month (MM).
*   **API Playground:** Interactive UI to test all available Nepali Calendar API endpoints (`/api/calendar/info`, `/api/calendar/{YYYY}`, and `/api/calendar/{YYYY}/{MM}`).
*   **Responsive Design:** The application is designed to work across various screen sizes.
*   **SEO Friendly:** Metadata is implemented for better search engine visibility, focusing on keywords like "BS to AD converter," "AD to BS converter," and "Nepali Calendar API."

## 3. Styling Guidelines (Implemented)

*   **Primary Color:** Light blue (`#A7D1AB`, HSL: `124 30% 70%`) - Used for primary buttons, active elements, highlights.
*   **Background Color:** Very light cyan (`#F0FAFA`, HSL: `180 50% 97%`) - Main app background.
*   **Accent Color:** Lime green (`#BCE29E`, HSL: `94 50% 75%`) - Used for secondary highlights, icons.
*   **Font Pairing:**
    *   **Headings:** 'Alegreya' (serif)
    *   **Body Text:** 'Inter' (sans-serif)
*   **Layout:** Clean and intuitive, with clear sections for input and output.
*   **Components:** Utilizes ShadCN UI components, styled with Tailwind CSS, featuring rounded corners and subtle shadows.

These colors are configured in `src/app/globals.css` using HSL CSS variables for ShadCN's theming system.

## 4. API Endpoints (Nepali Calendar API)

### 4.1. API Information

*   **Route:** `/api/calendar/info`
*   **Method:** `GET`
*   **Description:** Provides comprehensive documentation about the Bikram Sambat Calendar API, including endpoint details, data structures, data coverage, and usage notes.
*   **Implementation:** `src/app/api/calendar/info/route.ts`

### 4.2. Get BS Year Data (Nepali Patro Data for entire year)
*   **Route:** `/api/calendar/{YYYY}`
    *   `{YYYY}`: Bikram Sambat year (e.g., 2079)
*   **Method:** `GET`
*   **Description:** Retrieves all calendar data for the specified BS year, including all 12 months. Each month's data includes daily details, Nepali holidays, festivals, and other events.
*   **Response:** An array of `BsMonthData` objects, one for each month of the specified year.
*   **Implementation:** `src/app/api/calendar/[year]/route.ts`

### 4.3. Get BS Month Data (Nepali Patro Data for specific month)

*   **Route:** `/api/calendar/{YYYY}/{MM}`
    *   `{YYYY}`: Bikram Sambat year (e.g., 2079)
    *   `{MM}`: Bikram Sambat month (1 for Baishakh, 12 for Chaitra)
*   **Method:** `GET`
*   **Description:** Retrieves detailed calendar data for the specified BS year and month, including Nepali holidays and events.
*   **Response:** A JSON object (`BsMonthData`) containing metadata, list of days with their AD equivalents, tithis, festivals, holidays, and auspicious dates.
*   **Implementation:** `src/app/api/calendar/[...params]/route.ts`

### 4.4. Deprecated API Endpoints
The following endpoints are deprecated and will return a 410 Gone status with a message pointing to the new Nepali Calendar API endpoints:
*   `/api/data/info` (Replaced by `/api/calendar/info`)
*   `/api/data/{YYYY}/{MM}` (Replaced by `/api/calendar/{YYYY}/{MM}`)
*   **Implementation:** `src/app/api/data/info/route.ts` and `src/app/api/data/[year]/[month]/route.ts`

## 5. Project File Structure and Code Explanation

### 5.1. Configuration Files

*   **`next.config.ts`**:
    *   Configures Next.js specific options.
    *   Includes `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` (used cautiously).
    *   Configures `images.remotePatterns` to allow placeholder images from `placehold.co`.
*   **`package.json`**:
    *   Lists project dependencies (e.g., `next`, `react`, `tailwindcss`, `lucide-react`, `genkit`, ShadCN UI components, `date-fns`, `zod`).
    *   Defines scripts for development (`dev`), building (`build`), starting (`start`), linting (`lint`), type checking (`typecheck`), and running the data scraper (`scrape`) for Bikram Sambat data.
*   **`tailwind.config.ts`**:
    *   Configures Tailwind CSS, including dark mode settings, content paths, and theme extensions.
    *   Defines custom font families (`body`, `headline`, `code`) and color palettes based on CSS variables from `globals.css`.
    *   Includes the `tailwindcss-animate` plugin.
*   **`tsconfig.json`**:
    *   TypeScript compiler options, defining target, libraries, module system, paths aliases (`@/*`), and strictness.
*   **`components.json`**:
    *   ShadCN UI configuration, specifying style, RSC, Tailwind CSS path, base color, and component aliases.
*   **`apphosting.yaml`**:
    *   Configuration for Firebase App Hosting, e.g., `runConfig.maxInstances`.
*   **`.env`**:
    *   Used for environment variables (e.g., `NEXT_PUBLIC_APP_URL`).
*   **`.vscode/settings.json`**:
    *   VSCode editor settings, enabling IDX AI features.

### 5.2. Root Application Files (`src/app/`)

*   **`src/app/layout.tsx`**:
    *   The root layout component for the entire application.
    *   Sets up the `<html>` and `<body>` tags.
    *   Imports global CSS (`globals.css`) and custom fonts ('Inter' and 'Alegreya').
    *   Includes `<AppHeader />`, `<AppFooter />`, and `<Toaster />` for consistent layout and notifications.
    *   Defines global SEO metadata (title, description, keywords, Open Graph, Twitter cards) that can be overridden by individual pages. It sets `metadataBase` for correct Open Graph URL generation. Keywords include "BS to AD converter," "AD to BS converter," "Nepali Calendar," "Bikram Sambat," "NepaliDate."
    *   Configures the viewport theme color.
*   **`src/app/globals.css`**:
    *   Imports Tailwind CSS base, components, and utilities.
    *   Defines CSS variables for the ShadCN UI theme, including colors for light and dark modes, based on the PRD's style guidelines.
    *   Applies base styles to the body and heading elements.
*   **`src/app/actions.ts`**:
    *   Contains Next.js Server Actions used by the converter pages.
    *   `convertBsToAdWithEvents(bsDate)`: Converts BS to AD and fetches associated events (Nepali holidays, marriage, bratabandha) for the target BS month.
    *   `convertAdToBsWithEvents(adDate)`: Converts AD to BS and fetches associated events for the resulting BS month.
    *   `fetchEventData(bsYear, bsMonth)`: A helper function to retrieve event data from the loaded `bsCalendarData`.

### 5.3. Page Routes (`src/app/.../page.tsx`)

#### 5.3.1. `src/app/page.tsx` (Route: `/`)
*   The homepage of the application, a central hub for date conversion tools.
*   Provides a welcoming message and navigation links to the BS-to-AD and AD-to-BS converters, and the Nepali Calendar API documentation.
*   Uses ShadCN `Card` and `Button` components for layout.
*   Includes page-specific SEO metadata for title, description, keywords, Open Graph, and Twitter cards, optimized with terms like "BS to AD converter," "Nepali Calendar API," and "Bikram Sambat."

##### Key Page Content (for SEO Analysis):
*   **Route:** `/`
*   **Main Heading (H1):** "Welcome to NepaliDate"
*   **Main Paragraph/Description:** "Your one-stop solution for Bikram Sambat (BS) and Gregorian (AD) date conversions, enriched with holiday and event insights for the Nepali calendar. Use our BS to AD converter, AD to BS converter, or explore the Nepali Calendar API."
*   **Section Headings (Card Titles - H2 equivalent):**
    *   "BS to AD Converter"
    *   "AD to BS Converter"
    *   "Nepali Calendar API"
*   **Section Descriptions (Card Descriptions):**
    *   "Convert Bikram Sambat (BS) dates to Gregorian (AD) dates and see relevant Nepali calendar events using our accurate converter."
    *   "Convert Gregorian (AD) dates to Bikram Sambat (BS) dates and explore Nepali Patro events with our reliable tool."
    *   "Explore our comprehensive API for Bikram Sambat calendar data, including Nepali holidays, festivals, and events. Perfect for developers."
*   **Button Texts:**
    *   "Go to BS to AD Converter" (Links to `/bs-to-ad`)
    *   "Go to AD to BS Converter" (Links to `/ad-to-bs`)
    *   "View API Details" (Links to `/api-info`)
*   **Icon:** `CalendarDays` icon used above main heading.

#### 5.3.2. `src/app/bs-to-ad/page.tsx` (Route: `/bs-to-ad`)
*   Client component (`'use client'`). Allows users to convert Bikram Sambat (BS) dates to Gregorian (AD).
*   Allows users to input a Bikram Sambat date (year, month, day) using `Select` components.
*   Uses `react-hook-form` and `zod` for form handling and validation.
*   The Zod schema includes a `refine` function to validate that the selected day is valid for the chosen BS month and year using `getClientSafeDaysInBsMonth`.
*   On submission, calls the `convertBsToAdWithEvents` server action.
*   Displays the converted AD date and relevant Nepali holidays and events using `ResultDisplay` and `EventSummaryDisplay` components.
*   Handles loading states (`useTransition`) and displays errors using `toast`.
*   Inherits SEO metadata from `layout.tsx`. On-page H1 and descriptions are optimized for "BS to AD converter" and related terms.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/bs-to-ad`
*   **Main Heading (Card Title - H1 equivalent):** "Bikram Sambat (BS) to Gregorian (AD) Converter"
*   **Description (Card Description):** "Use this BS to AD converter to accurately change Bikram Sambat dates to Gregorian (AD) and discover associated Nepali holidays and events for the chosen BS month from the Nepali Patro."
*   **Form Labels:**
    *   "BS Year"
    *   "BS Month"
    *   "BS Day"
*   **Button Text:** "Convert BS to AD"
*   **Result Display (Dynamic):**
    *   Label: "Gregorian (AD) Date"
    *   Content: "{AD_Day} {AD_Month_Name} {AD_Year}", "{AD_Day_Of_Week}" (e.g., "14 April 2024", "Sunday")
*   **Event Summary Display (Dynamic):**
    *   Title: "Events & Holidays: {BS_Month_Name} {BS_Year}" (e.g., "Events & Holidays: Baishakh 2080")
    *   Section Titles: "Holidays & Festivals", "Auspicious Marriage Dates", "Auspicious Bratabandha Dates"
    *   Event Items: Dynamically populated based on selected BS month. Grouped by day for "Holidays & Festivals".
*   **Toast Messages (Dynamic, on action):**
    *   Success: "Conversion Successful", "Converted BS {Day}/{Month}/{Year} to AD."
    *   Error: "Conversion Error", "{error_message}"

#### 5.3.3. `src/app/ad-to-bs/page.tsx` (Route: `/ad-to-bs`)
*   Client component (`'use client'`). Enables conversion from Gregorian (AD) to Bikram Sambat (BS).
*   Allows users to select a Gregorian date using the ShadCN `Calendar` component within a `Popover`.
*   Uses `react-hook-form` and `zod` for form handling.
*   On submission, calls the `convertAdToBsWithEvents` server action.
*   Displays the converted BS date and relevant Nepali holidays and events.
*   Handles loading states and errors similarly to the BS-to-AD page.
*   Inherits SEO metadata from `layout.tsx`. On-page H1 and descriptions are optimized for "AD to BS converter" and related terms.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/ad-to-bs`
*   **Main Heading (Card Title - H1 equivalent):** "Gregorian (AD) to Bikram Sambat (BS) Converter"
*   **Description (Card Description):** "Use our AD to BS converter to easily change Gregorian dates to Bikram Sambat (BS). This tool also displays relevant Nepali holidays and events from the Nepali Patro for the converted BS month."
*   **Form Label:** "AD Date" (associated with a Calendar popover)
*   **Button Text:** "Convert AD to BS"
*   **Result Display (Dynamic):**
    *   Label: "Bikram Sambat (BS) Date"
    *   Content: "{BS_Day} {BS_Month_Name} {BS_Year}", "{BS_Day_Of_Week}" (e.g., "1 Baishakh 2080", "Friday")
*   **Event Summary Display (Dynamic):**
    *   Title: "Events & Holidays: {BS_Month_Name} {BS_Year}" (e.g., "Events & Holidays: Baishakh 2080")
    *   Section Titles: "Holidays & Festivals", "Auspicious Marriage Dates", "Auspicious Bratabandha Dates"
    *   Event Items: Dynamically populated based on converted BS month. Grouped by day for "Holidays & Festivals".
*   **Toast Messages (Dynamic, on action):**
    *   Success: "Conversion Successful", "Converted AD {Day}/{Month}/{Year} to BS."
    *   Error: "Conversion Error", "{error_message}"

#### 5.3.4. `src/app/api-info/page.tsx` (Route: `/api-info`)
*   Server Component that fetches API documentation details from `/api/calendar/info`.
*   Displays detailed information about the Nepali Calendar API, including endpoints, data structures, data coverage for Bikram Sambat years, and usage notes.
*   Uses ShadCN `Card`, `Accordion`, `Badge`, and custom table rendering for a structured and readable documentation page.
*   Provides a link to the API Playground.
*   Includes page-specific SEO metadata for title, description, keywords (e.g., "Nepali Calendar API", "Bikram Sambat API", "API Documentation"), Open Graph, and Twitter cards. Content is optimized for these terms.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/api-info`
*   **Main Title (H1, Dynamic from API):** e.g., "NepaliDate: Nepali Calendar & Bikram Sambat API"
*   **Main Description (Dynamic from API):** e.g., "A comprehensive API for Bikram Sambat (BS) to Gregorian (AD) date conversions and Nepali calendar event data..."
*   **Badges (Dynamic from API):** "Version: {version}", "Status: {status}"
*   **Contact (Dynamic from API):** "Contact: {contact@sevenx.com.np}" (with mailto link)
*   **Button Text:** "Go to API Playground" (Links to `/api-playground`)
*   **Section Titles (H2/Card Titles):**
    *   "Nepali Calendar API Endpoints"
    *   "API Data Structures (BS Calendar)"
    *   "Data Coverage & Notes (Nepali Patro)"
*   **Endpoint Accordion Triggers (Dynamic):**
    *   `GET /api/calendar/info`
    *   `GET /api/calendar/{YYYY}`
    *   `GET /api/calendar/{YYYY}/{MM}`
*   **Key Descriptions within Endpoints (Dynamic from API, examples):**
    *   "Provides detailed information about the Nepali Calendar API..."
    *   "Retrieves all Bikram Sambat (BS) calendar data for a specific BS year (YYYY), including all 12 months."
    *   "Retrieves Bikram Sambat (BS) calendar data for a specific BS year (YYYY) and month (MM, 1-12). Includes daily details, Nepali holidays, festivals, and other events."
    *   Parameter names and descriptions (e.g., "YYYY", "MM")
    *   "Example Request:", "Example Response:", "Example Response Summary:", "Possible Error Responses:" (followed by code blocks or lists)
*   **Data Structure Titles (H3, Dynamic from API):**
    *   "BsMonthData"
    *   "BsDayData"
*   **Data Structure Descriptions (Dynamic from API):**
    *   "Represents all calendar data for a specific Bikram Sambat (BS) month, including metadata, daily entries, Nepali holidays, and other events."
    *   "Represents data for a single day in the Bikram Sambat calendar, including AD equivalent and event details."
    *   Field names and descriptions within tables (e.g., "bs_year", "metadata", "days", "holiFest", "n", "ne", "e", "t", "f", "h", "d", "ad_year_start", "ad_month_start", etc.)
*   **Data Coverage Section (Dynamic from API):**
    *   "Available Bikram Sambat Years in Data:"
    *   "Data Source & Accuracy" (Alert title)
    *   "The data for this Nepali Calendar API is sourced from publicly available Nepali calendar information..." (Alert description)
    *   "Important Notes for API Users:" (followed by a list of notes, dynamic from API)
*   **Footer Note (Dynamic):** "Nepali Calendar API Documentation last updated: {current date}" (generated on page render)
*   **Icons:** `Network`, `ListTree`, `Database`, `Info`, `AlertCircle` are used with section titles.

#### 5.3.5. `src/app/api-playground/page.tsx` (Route: `/api-playground`)
*   Client component (`'use client'`).
*   Provides an interactive interface for users to test the Nepali Calendar API endpoints: `/api/calendar/info`, `/api/calendar/{YYYY}`, and `/api/calendar/{YYYY}/{MM}`.
*   Users can select the endpoint and relevant BS Year/Month.
*   Dynamically displays the request URL and allows users to send the request.
*   Shows the API response status code and the JSON response body.
*   Uses `react-hook-form`, `zod`, ShadCN components (including `RadioGroup` for endpoint selection).
*   Inherits SEO metadata from `layout.tsx`. On-page H1 and descriptions are optimized for "API Playground," "Nepali Calendar API," and "Bikram Sambat."

##### Key Page Content (for SEO Analysis):
*   **Route:** `/api-playground`
*   **Main Heading (Card Title - H1 equivalent):** "Nepali Calendar API Playground"
*   **Description (Card Description):** "Test the NepaliDate Bikram Sambat (BS) calendar API endpoints. Select an endpoint and provide parameters if needed. View the full <Link href='/api-info' class='...'>Nepali Calendar API documentation here</Link>."
*   **Endpoint Selection Label:** "Select API Endpoint:"
*   **Endpoint Radio Options & Labels:**
    *   `/api/calendar/info`
    *   `/api/calendar/[YYYY]`
    *   `/api/calendar/[YYYY]/[MM]`
*   **Form Labels (conditional):**
    *   "Bikram Sambat Year (YYYY)"
    *   "Bikram Sambat Month (MM)"
    *   "Request URL for API:"
*   **Button Texts:**
    *   "Send API Request"
    *   "Open" (next to request URL, to open in new tab)
*   **Section Title (Dynamic):** "API Response" (appears after request)
*   **Dynamic Content Placeholders:**
    *   The actual request URL (changes based on selection).
    *   "Status: {statusCode}" (e.g., "Status: 200" or "Status: 404")
    *   "Error: {errorMessage}" (if an error occurs)
    *   "Response Body:" (followed by JSON data or error object)
*   **Toast Messages (Dynamic, on action):**
    *   Success: "Success", "API request successful."
    *   Error: "Error: {statusCode}", "{error_message}" or "Fetch Error", "{error_message}"
    *   URL Error: "Error", "Could not construct request URL. Please select valid parameters."
*   **Icons:** `TestTube2` (main title), `Code` (response section title), `PlayCircle` (button), `ExternalLink` (button), `FileText`, `List`, `CalendarClock` (endpoint selection).

### 5.4. API Route Handlers (`src/app/api/.../route.ts`)

*   **`src/app/api/calendar/info/route.ts`**:
    *   `GET` handler that returns a JSON object containing detailed API documentation for the Nepali Calendar API.
    *   Dynamically fetches available BS years using `getBsYears()` to include in the documentation.
    *   Constructs example request URLs based on the current request's origin.
    *   Defines the structure of `BsMonthData` and `BsDayData` and explains each field. Includes comprehensive descriptions, notes on delimiters (`_::_`), and the `ne` field for Nepali dates in English numerals. Content is optimized for keywords like "Nepali Calendar API", "Bikram Sambat API", and "event data". Its `apiName` is "NepaliDate: Nepali Calendar & Bikram Sambat API". Contact email is `contact@sevenx.com.np`.
*   **`src/app/api/calendar/[year]/route.ts`**:
    *   `GET` handler for fetching all calendar data for a specific BS year.
    *   Extracts the `year` from the dynamic path parameter.
    *   Uses `getBsCalendarData()` and filters for the specific year.
    *   Returns an array of `BsMonthData` objects for the year, or a 404 if no data.
*   **`src/app/api/calendar/[...params]/route.ts`**:
    *   `GET` handler for fetching calendar data for a specific BS year and month.
    *   Extracts year and month from the dynamic path parameters.
    *   Uses `getBsCalendarData()` to retrieve the data.
    *   Returns the specific `BsMonthData` if found, or a 404 error with available years if not.
    *   Includes basic validation for year and month parameters.
*   **`src/app/api/data/info/route.ts` & `src/app/api/data/[year]/[month]/route.ts`**:
    *   These are **deprecated** route handlers.
    *   They return a JSON response with an error message and HTTP status 410 (Gone), guiding users to the new `/api/calendar/...` endpoints.

### 5.5. Library Files (`src/lib/`)

*   **`src/lib/utils.ts`**:
    *   Exports the `cn` utility function for conditionally joining class names.
*   **`src/lib/date-converter.ts`**:
    *   `convertBsToAd(bsDate)`: Contains the logic to convert a BS date to its AD equivalent using Bikram Sambat calendar data.
    *   `convertAdToBs(adDate)`: Contains the logic to convert an AD date to its BS equivalent using Bikram Sambat calendar data.
    *   `getAdDateForBsDay(bsDayEntry, monthDataRef)`: Helper function for accurate AD date determination.
    *   Exports `getDaysInBsMonth` (re-exported from `bsCalendarData.ts`).
*   **`src/lib/bsCalendarData.ts`**:
    *   Manages loading and accessing the Bikram Sambat calendar data stored in JSON files.
    *   `loadCalendarDataFromFileSystem()`: Reads all `YYYY/M.json` files from the `data/` directory.
    *   `getBsCalendarData()`: Returns the cached `BsCalendar` object.
    *   `getDaysInBsMonth(year, month)`: Returns the number of days in a given BS month.
    *   `getBsYears()`: Returns a sorted array of unique BS years available.

### 5.6. UI Components (`src/components/`)

*   **`src/components/ui/`**:
    *   Contains all the ShadCN UI components.
*   **`src/components/layout/AppHeader.tsx`**:
    *   Renders the main application header with "NepaliDate" title and navigation links, including "API Playground."
*   **`src/components/layout/AppFooter.tsx`**:
    *   Renders the application footer with "NepaliDate" copyright.
*   **`src/components/converters/DateConverterFormFields.tsx`**:
    *   `BsDateFormFields`: Reusable component for BS date input.
    *   `AdDateFormField`: Reusable component for AD date input.
    *   `ResultDisplay`: Component to display converted dates.
*   **`src/components/converters/EventSummaryDisplay.tsx`**:
    *   Responsible for displaying Nepali holidays and events. Uses `_::_` delimiter to parse `holiFest` data. Groups events by day for clarity.

### 5.7. TypeScript Types (`src/types/index.ts`)

*   Defines all major data structures and types (e.g., `BsDayData`, `BsMonthData`, `NepaliDate`, `EnglishDate`). `BsDayData` includes `ne` field. `BsMonthData` includes `holiFest` with `_::_` delimiter.

### 5.8. Hooks (`src/hooks/`)

*   **`src/hooks/use-toast.ts`**: Custom hook for toast notifications.
*   **`src/hooks/use-mobile.tsx`**: Custom hook for mobile detection.

### 5.9. Data Files (`data/`)

*   Contains Bikram Sambat calendar data in `YYYY/M.json` format. `holiFest` strings use `_::_` delimiter.

### 5.10. Scraper Scripts (`scripts/`)

*   **`scripts/calendar-scraper.js`**: Node.js script to scrape calendar data. `holiFest` data scraped with `_::_` delimiter.
*   **`scripts/run-scraper.js`**: Automates the scraper for a range of years.

### 5.11. AI Integration (Genkit - `src/ai/`)

*   **`src/ai/genkit.ts`**: Initializes Genkit.
*   **`src/ai/flows/holiday-event-analyzer.ts`**: Defines a Genkit flow for summarizing BS events (currently not integrated into main UI). Mentions "NepaliDate application" in comments.
*   **`src/ai/dev.ts`**: Development entry point for Genkit.

This detailed breakdown should provide a good understanding of the NepaliDate application's architecture, features, and codebase, with a focus on its date conversion capabilities and Nepali Calendar API.

    