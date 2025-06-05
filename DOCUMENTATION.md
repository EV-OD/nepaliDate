
# Date Bliss Application Documentation

## 1. Project Overview

**App Name:** Date Bliss

**Core Mission:** To provide a user-friendly and reliable tool for converting dates between Bikram Sambat (BS) and Gregorian (AD) calendars, and to offer information about Nepali holidays and events for specific BS months. The application also exposes an API for programmatic access to this calendar data.

**Tech Stack:**
*   **Framework:** Next.js (with App Router)
*   **Language:** TypeScript
*   **UI Library:** React
*   **Component Library:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **AI Integration:** Genkit (for potential future AI-driven features, currently includes a holiday/event summarizer flow)
*   **Data Storage:** JSON files for calendar data

## 2. Core Features

*   **Date Conversion:**
    *   Bikram Sambat (BS) to Gregorian (AD)
    *   Gregorian (AD) to Bikram Sambat (BS)
*   **Date Validation:** Input validation notifies users of impossible date inputs (e.g., BS day exceeding days in the month).
*   **Date Picker:** User-friendly date picker components for easy date selection.
*   **Event Display:** For a selected/converted BS month, the application displays:
    *   Holidays and Festivals (`holiFest`)
    *   Auspicious Marriage Dates (`marriage`)
    *   Auspicious Bratabandha Dates (`bratabandha`)
*   **API Access:**
    *   `/api/calendar/info`: Provides detailed API documentation and information.
    *   `/api/calendar/{YYYY}/{MM}`: Fetches calendar data for a specific BS year (YYYY) and month (MM).
*   **API Playground:** Interactive UI to test the `/api/calendar/{YYYY}/{MM}` endpoint.
*   **Responsive Design:** The application is designed to work across various screen sizes.
*   **SEO Friendly:** Metadata is implemented for better search engine visibility.

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

## 4. API Endpoints

### 4.1. API Information

*   **Route:** `/api/calendar/info`
*   **Method:** `GET`
*   **Description:** Provides comprehensive documentation about the API, including endpoint details, data structures, data coverage, and usage notes.
*   **Implementation:** `src/app/api/calendar/info/route.ts`

### 4.2. Get BS Month Data

*   **Route:** `/api/calendar/{YYYY}/{MM}`
    *   `{YYYY}`: Bikram Sambat year (e.g., 2079)
    *   `{MM}`: Bikram Sambat month (1 for Baishakh, 12 for Chaitra)
*   **Method:** `GET`
*   **Description:** Retrieves detailed calendar data for the specified BS year and month.
*   **Response:** A JSON object (`BsMonthData`) containing metadata, list of days with their AD equivalents, tithis, festivals, holidays, and auspicious dates.
*   **Implementation:** `src/app/api/calendar/[...params]/route.ts`

### 4.3. Deprecated API Endpoints
The following endpoints are deprecated and will return a 410 Gone status with a message pointing to the new endpoints:
*   `/api/data/info` (Replaced by `/api/calendar/info`)
*   `/api/data/{YYYY}/{MM}` (Replaced by `/api/calendar/{YYYY}/{MM}`)
*   **Implementation:** `src/app/api/data/info/route.ts` and `src/app/api/data/[year]/[month]/route.ts`

## 5. Project File Structure and Code Explanation

### 5.1. Configuration Files

*   **`next.config.ts`**:
    *   Configures Next.js specific options.
    *   Includes `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds` (should be used cautiously).
    *   Configures `images.remotePatterns` to allow placeholder images from `placehold.co`.
*   **`package.json`**:
    *   Lists project dependencies (e.g., `next`, `react`, `tailwindcss`, `lucide-react`, `genkit`, ShadCN UI components, `date-fns`, `zod`).
    *   Defines scripts for development (`dev`), building (`build`), starting (`start`), linting (`lint`), type checking (`typecheck`), and running the data scraper (`scrape`).
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
    *   Used for environment variables (currently empty but available for API keys, etc.).
*   **`.vscode/settings.json`**:
    *   VSCode editor settings, enabling IDX AI features like inline completion and codebase indexing.

### 5.2. Root Application Files (`src/app/`)

*   **`src/app/layout.tsx`**:
    *   The root layout component for the entire application.
    *   Sets up the `<html>` and `<body>` tags.
    *   Imports global CSS (`globals.css`) and custom fonts ('Inter' and 'Alegreya').
    *   Includes `<AppHeader />`, `<AppFooter />`, and `<Toaster />` for consistent layout and notifications.
    *   Defines global SEO metadata (title, description, keywords, Open Graph, Twitter cards) that can be overridden by individual pages. It sets `metadataBase` for correct Open Graph URL generation.
    *   Configures the viewport theme color.
*   **`src/app/globals.css`**:
    *   Imports Tailwind CSS base, components, and utilities.
    *   Defines CSS variables for the ShadCN UI theme, including colors for light and dark modes, based on the PRD's style guidelines.
    *   Applies base styles to the body and heading elements.
*   **`src/app/actions.ts`**:
    *   Contains Next.js Server Actions used by the converter pages.
    *   `convertBsToAdWithEvents(bsDate)`: Converts BS to AD and fetches associated events (holidays, marriage, bratabandha) for the target BS month.
    *   `convertAdToBsWithEvents(adDate)`: Converts AD to BS and fetches associated events for the resulting BS month.
    *   `fetchEventData(bsYear, bsMonth)`: A helper function to retrieve event data from the loaded `bsCalendarData`.

### 5.3. Page Routes (`src/app/.../page.tsx`)

#### 5.3.1. `src/app/page.tsx` (Route: `/`)
*   The homepage of the application.
*   Provides a welcoming message and navigation links to the BS-to-AD and AD-to-BS converters, and the API documentation.
*   Uses ShadCN `Card` and `Button` components for layout.
*   Includes page-specific SEO metadata for title, description, keywords, Open Graph, and Twitter cards.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/`
*   **Main Heading (H1):** "Welcome to Date Bliss"
*   **Main Paragraph/Description:** "Your one-stop solution for Bikram Sambat (BS) and Gregorian (AD) date conversions, enriched with holiday and event insights for the Nepali calendar."
*   **Section Headings (Card Titles - H2 equivalent):**
    *   "BS to AD Converter"
    *   "AD to BS Converter"
    *   "Nepali Calendar API"
*   **Section Descriptions (Card Descriptions):**
    *   "Convert Bikram Sambat dates to Gregorian dates and see relevant Nepali calendar events."
    *   "Convert Gregorian dates to Bikram Sambat dates and explore Nepali Patro events."
    *   "Explore our API for Bikram Sambat calendar data, holidays, and events."
*   **Button Texts:**
    *   "Go to BS to AD Converter" (Links to `/bs-to-ad`)
    *   "Go to AD to BS Converter" (Links to `/ad-to-bs`)
    *   "View API Details" (Links to `/api-info`)
*   **Icon:** `CalendarDays` icon used above main heading.

#### 5.3.2. `src/app/bs-to-ad/page.tsx` (Route: `/bs-to-ad`)
*   Client component (`'use client'`).
*   Allows users to input a Bikram Sambat date (year, month, day) using `Select` components.
*   Uses `react-hook-form` and `zod` for form handling and validation.
*   The Zod schema includes a `refine` function to validate that the selected day is valid for the chosen BS month and year using `getClientSafeDaysInBsMonth`.
*   On submission, calls the `convertBsToAdWithEvents` server action.
*   Displays the converted AD date and relevant events using `ResultDisplay` and `EventSummaryDisplay` components.
*   Handles loading states (`useTransition`) and displays errors using `toast`.
*   Inherits SEO metadata from `layout.tsx` (as `generateMetadata` was removed due to client component restrictions).

##### Key Page Content (for SEO Analysis):
*   **Route:** `/bs-to-ad`
*   **Main Heading (Card Title - H1 equivalent):** "Bikram Sambat (BS) to Gregorian (AD)"
*   **Description (Card Description):** "Enter a BS date to convert it to AD and see relevant Nepali calendar events."
*   **Form Labels:**
    *   "BS Year"
    *   "BS Month"
    *   "BS Day"
*   **Button Text:** "Convert to AD"
*   **Result Display (Dynamic):**
    *   Label: "Gregorian (AD) Date"
    *   Content: "{AD_Day} {AD_Month_Name} {AD_Year}", "{AD_Day_Of_Week}" (e.g., "14 April 2024", "Sunday")
*   **Event Summary Display (Dynamic):**
    *   Title: "Events & Holidays: {BS_Month_Name} {BS_Year}" (e.g., "Events & Holidays: Baishakh 2080")
    *   Section Titles: "Holidays & Festivals", "Auspicious Marriage Dates", "Auspicious Bratabandha Dates"
    *   Event Items: Dynamically populated based on selected BS month.
*   **Toast Messages (Dynamic, on action):**
    *   Success: "Conversion Successful", "Converted BS {Day}/{Month}/{Year} to AD."
    *   Error: "Conversion Error", "{error_message}"

#### 5.3.3. `src/app/ad-to-bs/page.tsx` (Route: `/ad-to-bs`)
*   Client component (`'use client'`).
*   Allows users to select a Gregorian date using the ShadCN `Calendar` component within a `Popover`.
*   Uses `react-hook-form` and `zod` for form handling.
*   On submission, calls the `convertAdToBsWithEvents` server action.
*   Displays the converted BS date and relevant events.
*   Handles loading states and errors similarly to the BS-to-AD page.
*   Inherits SEO metadata from `layout.tsx` (as `generateMetadata` was removed due to client component restrictions).

##### Key Page Content (for SEO Analysis):
*   **Route:** `/ad-to-bs`
*   **Main Heading (Card Title - H1 equivalent):** "Gregorian (AD) to Bikram Sambat (BS)"
*   **Description (Card Description):** "Enter an AD date to convert it to BS and see relevant Nepali calendar events."
*   **Form Label:** "AD Date" (associated with a Calendar popover)
*   **Button Text:** "Convert to BS"
*   **Result Display (Dynamic):**
    *   Label: "Bikram Sambat (BS) Date"
    *   Content: "{BS_Day} {BS_Month_Name} {BS_Year}", "{BS_Day_Of_Week}" (e.g., "1 Baishakh 2080", "Friday")
*   **Event Summary Display (Dynamic):**
    *   Title: "Events & Holidays: {BS_Month_Name} {BS_Year}" (e.g., "Events & Holidays: Baishakh 2080")
    *   Section Titles: "Holidays & Festivals", "Auspicious Marriage Dates", "Auspicious Bratabandha Dates"
    *   Event Items: Dynamically populated based on converted BS month.
*   **Toast Messages (Dynamic, on action):**
    *   Success: "Conversion Successful", "Converted AD {Day}/{Month}/{Year} to BS."
    *   Error: "Conversion Error", "{error_message}"

#### 5.3.4. `src/app/api-info/page.tsx` (Route: `/api-info`)
*   Server Component that fetches API documentation details from `/api/calendar/info`.
*   Displays detailed information about the API, including endpoints, data structures, data coverage, and usage notes.
*   Uses ShadCN `Card`, `Accordion`, `Badge`, and custom table rendering for a structured and readable documentation page.
*   Provides a link to the API Playground.
*   Includes page-specific SEO metadata for title, description, keywords, Open Graph, and Twitter cards.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/api-info`
*   **Main Title (H1, Dynamic from API):** e.g., "Date Bliss Calendar API"
*   **Main Description (Dynamic from API):** e.g., "A comprehensive API for Bikram Sambat (BS) to Gregorian (AD) date conversions and Nepali calendar event data..."
*   **Badges (Dynamic from API):** "Version: {version}", "Status: {status}"
*   **Contact (Dynamic from API):** "Contact: {email}" (with mailto link)
*   **Button Text:** "Go to API Playground" (Links to `/api-playground`)
*   **Section Titles (H2/Card Titles):**
    *   "API Endpoints"
    *   "Data Structures"
    *   "Data Coverage & Notes"
*   **Endpoint Accordion Triggers (Dynamic):**
    *   `GET /api/calendar/info`
    *   `GET /api/calendar/{YYYY}/{MM}`
*   **Key Descriptions within Endpoints (Dynamic from API, examples):**
    *   "Provides detailed information about the API..."
    *   "Retrieves Bikram Sambat calendar data for a specific BS year (YYYY) and month (MM, 1-12)."
    *   Parameter names and descriptions (e.g., "YYYY", "MM")
    *   "Example Request:", "Example Response:", "Example Response Summary:", "Possible Error Responses:" (followed by code blocks or lists)
*   **Data Structure Titles (H3, Dynamic from API):**
    *   "BsMonthData"
    *   "BsDayData"
*   **Data Structure Descriptions (Dynamic from API):**
    *   "Represents all data for a specific Bikram Sambat month."
    *   "Represents data for a single day in the Bikram Sambat calendar."
    *   Field names and descriptions within tables (e.g., "bs_year", "metadata", "days", "holiFest", "n", "ne", "e", "t", "f", "h", "d", "ad_year_start", "ad_month_start", etc.)
*   **Data Coverage Section (Dynamic from API):**
    *   "Available Bikram Sambat Years in Data: {list of years}"
    *   "Data Source & Accuracy" (Alert title)
    *   "The data is sourced from publicly available Nepali calendar information..." (Alert description)
    *   "Important Notes:" (followed by a list of notes, dynamic from API)
*   **Footer Note (Dynamic):** "API Documentation last updated: {current date}" (generated on page render)
*   **Icons:** `Network`, `ListTree`, `Database`, `Info`, `AlertCircle` are used with section titles.

#### 5.3.5. `src/app/api-playground/page.tsx` (Route: `/api-playground`)
*   Client component (`'use client'`).
*   Provides an interactive interface for users to test the `/api/calendar/{YYYY}/{MM}` endpoint.
*   Users can select BS Year and Month.
*   Dynamically displays the request URL and allows users to send the request.
*   Shows the API response status code and the JSON response body.
*   Uses `react-hook-form`, `zod`, and ShadCN components.
*   Inherits SEO metadata from `layout.tsx` (as `generateMetadata` was removed due to client component restrictions).

##### Key Page Content (for SEO Analysis):
*   **Route:** `/api-playground`
*   **Main Heading (Card Title - H1 equivalent):** "API Playground"
*   **Description (Card Description):** "Test the /api/calendar/[YYYY]/[MM] endpoint. View the full API documentation here." (with "here" being a link to `/api-info`)
*   **Form Labels:**
    *   "Bikram Sambat Year (YYYY)"
    *   "Bikram Sambat Month (MM)"
    *   "Request URL"
*   **Button Texts:**
    *   "Send Request"
    *   "Open" (next to request URL, to open in new tab)
*   **Section Title (Dynamic):** "API Response" (appears after request)
*   **Dynamic Content Placeholders:**
    *   The actual request URL: `{baseUrl}/api/calendar/{selected_year}/{selected_month}`
    *   "Status: {statusCode}" (e.g., "Status: 200" or "Status: 404")
    *   "Error: {errorMessage}" (if an error occurs)
    *   "Response Body:" (followed by JSON data or error object)
*   **Toast Messages (Dynamic, on action):**
    *   Success: "Success", "API request successful."
    *   Error: "Error: {statusCode}", "{error_message}" or "Fetch Error", "{error_message}"
*   **Icons:** `TestTube2` (main title), `Code` (response section title), `PlayCircle` (button), `ExternalLink` (button).

### 5.4. API Route Handlers (`src/app/api/.../route.ts`)

*   **`src/app/api/calendar/info/route.ts`**:
    *   `GET` handler that returns a JSON object containing detailed API documentation.
    *   Dynamically fetches available BS years using `getBsYears()` to include in the documentation.
    *   Constructs example request URLs based on the current request's origin.
    *   Defines the structure of `BsMonthData` and `BsDayData` and explains each field. It now includes more comprehensive descriptions, notes on delimiters, and the `ne` field.
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
    *   Exports the `cn` utility function (from `clsx` and `tailwind-merge`) for conditionally joining class names, commonly used with ShadCN components.
*   **`src/lib/date-converter.ts`**:
    *   `convertBsToAd(bsDate)`: Contains the logic to convert a BS date to its AD equivalent.
        *   It accesses the pre-loaded calendar data via `getBsCalendarData()`.
        *   Finds the specific BS month and day data. It now uses the `ne` (Nepali day in English numerals) for matching the input day after parsing it to an integer.
        *   Calls `getAdDateForBsDay` to determine the precise AD date.
    *   `convertAdToBs(adDate)`: Contains the logic to convert an AD date to its BS equivalent.
        *   Iterates through the loaded BS calendar data.
        *   For each BS month, it iterates through its days, calculating the corresponding AD date for each BS day.
        *   When constructing the BS date result, the `day` property is now derived by parsing the `ne` field to an integer.
        *   Returns the matching BS date when the AD date is found.
    *   `getAdDateForBsDay(bsDayEntry, monthDataRef)`: Helper function to accurately determine the AD year, month, and day for a given `BsDayData` entry within its `BsMonthData` context. It handles cases where a BS month spans across two AD months or even two AD years (e.g., Poush/Magh). It uses the `ne` field from `bsDayEntry` for consistency if needed, but primarily relies on the already determined AD context from the parent function.
    *   Exports `getDaysInBsMonth` (re-exported from `bsCalendarData.ts`) for use in form validation.
*   **`src/lib/bsCalendarData.ts`**:
    *   Manages loading and accessing the Bikram Sambat calendar data stored in JSON files.
    *   `loadCalendarDataFromFileSystem()`: Reads all `YYYY/M.json` files from the `data/` directory at build time (or on first access server-side).
        *   Parses the `metadata.en` string (e.g., "Apr/May 2023") from each JSON file to determine `ad_year_start`, `ad_month_start`, `ad_year_end`, and `ad_month_end` for more accurate AD date calculations within the `date-converter`.
    *   `getBsCalendarData()`: Returns the cached `BsCalendar` object. If not loaded, it calls `loadCalendarDataFromFileSystem()`.
    *   `getDaysInBsMonth(year, month)`: Returns the number of days in a given BS month by looking up the loaded data. Includes a fallback for robustness.
    *   `getBsYears()`: Returns a sorted array of unique BS years available in the loaded data.

### 5.6. UI Components (`src/components/`)

*   **`src/components/ui/`**:
    *   Contains all the ShadCN UI components used in the project (e.g., `Button`, `Card`, `Select`, `Calendar`, `Input`, `Toast`, `Accordion`, `Sheet`, `Badge`, `Alert`, `Popover`). These are generally used as-is or with minor styling overrides via Tailwind CSS.
*   **`src/components/layout/AppHeader.tsx`**:
    *   Renders the main application header.
    *   Includes the "Date Bliss" logo/title linking to the homepage.
    *   Provides primary navigation links for desktop view, including a new link to the "API Playground".
    *   Uses a `Sheet` component for a mobile-friendly drawer navigation menu.
    *   Icons from `lucide-react` are used for navigation items.
*   **`src/components/layout/AppFooter.tsx`**:
    *   Renders the application footer with copyright information.
*   **`src/components/converters/DateConverterFormFields.tsx`**:
    *   `BsDateFormFields`: A reusable component for BS date input (Year, Month, Day `Select` fields). It dynamically updates the number of days in the day-selector based on the selected BS year and month using `getClientSafeDaysInBsMonth`.
    *   `AdDateFormField`: A reusable component for AD date input using the ShadCN `Calendar` in a `Popover`.
    *   `ResultDisplay`: A component to display the converted date (either BS or AD) in a styled card section.
*   **`src/components/converters/EventSummaryDisplay.tsx`**:
    *   Responsible for displaying holidays and events for a selected BS month.
    *   Takes `holiFest`, `marriageEvents`, `bratabandhaEvents`, loading state, error state, and current BS year/month name as props.
    *   `EventSection`: An internal helper component to render sections for "Holidays & Festivals", "Auspicious Marriage Dates", and "Auspicious Bratabandha Dates".
        *   For "Holidays & Festivals", it now groups events by day. It parses the day from the `holiFest` string (using `_::_` as a delimiter) and displays it as a prominent badge. Event descriptions (which may be split by commas) are then listed under that badge. Events marked with "•" or without a day part are displayed individually.
        *   For Marriage and Bratabandha dates, it displays the provided strings.
    *   Uses icons from `lucide-react` for section titles (`Sparkles`, `Heart`, `Milestone`).
    *   The UI for event items has been enhanced with card-like styling for better visual distinction. Loading, error, and "no events" states are also styled more clearly.

### 5.7. TypeScript Types (`src/types/index.ts`)

*   Defines all major data structures and types used throughout the application:
    *   `BsDayData`: Structure for individual day data within a BS month, including Nepali date (`n`), Nepali date in English numerals (`ne`), English date (`e`), Tithi (`t`), festival info (`f`), holiday flag (`h`), and day of the week (`d`).
    *   `BsMonthData`: Structure for an entire BS month's data, including `metadata` (EN/NP names, AD year/month start/end), `days` array, `holiFest` array (strings in `Day_::_Description` format), `marriage` array, `bratabandha` array, `bs_year`, and `bs_month`.
    *   `BsCalendar`: An object mapping "YYYY/M" strings to `BsMonthData`.
    *   `NepaliDate`: Interface for representing a BS date.
    *   `EnglishDate`: Interface for representing an AD date.
    *   `ConversionResult`: Type for the result of date conversion functions.
    *   `NEPALI_MONTHS`, `ENGLISH_MONTHS`: Arrays of month names.
    *   `DAYS_IN_BS_MONTH`: A client-side lookup table for estimating days in BS months (primarily for form validation and UI hints before server data is loaded).
    *   `CLIENT_SIDE_BS_YEARS`: Array of BS years available for client-side dropdowns.
    *   `getClientSafeDaysInBsMonth(year, month)`: Client-side utility to get the number of days in a BS month, using `DAYS_IN_BS_MONTH` for quick lookups.

### 5.8. Hooks (`src/hooks/`)

*   **`src/hooks/use-toast.ts`**:
    *   Custom hook for managing and displaying toast notifications using the ShadCN `Toast` component.
    *   Provides `toast()` function and `dismiss()` capabilities.
*   **`src/hooks/use-mobile.tsx`**:
    *   Custom hook `useIsMobile` that detects if the current viewport width is below a defined mobile breakpoint (768px).
    *   Used by components like `Sidebar` (if it were present) to adapt behavior for mobile screens.

### 5.9. Data Files (`data/`)

*   The `data/` directory contains subdirectories for each Bikram Sambat year (e.g., `data/2079/`).
*   Inside each year directory, there are JSON files for each month (e.g., `1.json` for Baishakh, `2.json` for Jestha, etc.).
*   **JSON File Structure (e.g., `data/2079/1.json`)**:
    ```json
    {
      "metadata": {
        "en": "Apr/May 2022", 
        "np": "बैशाख २०७९"    
      },
      "days": [
        {
          "n": "१",         
          "ne": "1",        
          "e": "14",        
          "t": "त्रयोदशी", 
          "f": "नव वर्ष २०७९ आरम्भ, महावीर जयन्ती", 
          "h": true,        
          "d": 1            
        }
      ],
      "holiFest": [
        "०१_::_नव वर्ष २०७९ आरम्भ, महावीर जयन्ती, भ.पु. विश्वध्वजपातन (विस्काजात्रा)",
        "•_::_Some general festival note for the month"
      ],
      "marriage": [
        "२, ४, ६, ७, ८, ९, १०, १४, १९, २०, २१, २६, २७, २८, २९, ३० र  ३१ गते"
      ],
      "bratabandha": [
        "२३ र २८  गते"
      ]
    }
    ```
    *   The `holiFest` array stores holiday and festival information. Each string is now formatted as `Day_::_Description`, where `Day` is the BS day (Nepali numeral or '•') and `Description` is the event text. Multiple events on the same day are comma-separated within the description part.
    *   `marriage` and `bratabandha` arrays list auspicious dates or a message indicating no such dates for the month.

### 5.10. Scraper Scripts (`scripts/`)

*   **`scripts/calendar-scraper.js`**:
    *   A Node.js script using `axios` (for HTTP requests) and `jsdom` (for parsing HTML).
    *   `scrapeData(year, month)`: Fetches calendar data for a given BS year and month from `https://nepalicalendar.rat32.com/index_nep.php`.
    *   Parses the HTML response to extract:
        *   Month metadata (English and Nepali names).
        *   Day-by-day information (BS date, AD date, Tithi, events, holiday status). It now extracts the `ne` field (Nepali day in English numerals).
        *   Lists of holidays/festivals (`holiFest`), marriage dates (`marriage`), and bratabandha dates (`bratabandha`).
        *   The `holiFest` data is now scraped by specifically targeting the table rows in the HTML, extracting the day from the first `<td>` and description from the second `<td>`, and joining them with `_::_` as a delimiter.
    *   Saves the extracted data into a JSON file at `data/{year}/{month}.json`.
    *   Includes error handling and checks if data already exists to avoid re-fetching.
*   **`scripts/run-scraper.js`**:
    *   A simple Node.js script to automate the execution of `calendar-scraper.js` for a range of years (currently 2076 to 2083).
    *   Creates the necessary `data/{year}` directories if they don't exist.
    *   Calls `scrapeData` for each month within the specified year range.

### 5.11. AI Integration (Genkit - `src/ai/`)

*   **`src/ai/genkit.ts`**:
    *   Initializes and configures the Genkit instance.
    *   Specifies the `googleAI` plugin and a default model (`googleai/gemini-2.0-flash`).
*   **`src/ai/flows/holiday-event-analyzer.ts`**:
    *   Defines a Genkit flow named `summarizeRelevantBsEventsFlow`.
    *   Input: BS year, month, and arrays of `holiFest`, `marriage`, and `bratabandha` strings.
    *   Output: A concise summary of these events.
    *   Uses `ai.definePrompt` to create a prompt that instructs the LLM to summarize the provided calendar event data.
    *   The prompt uses Handlebars templating (`{{{...}}}`) to inject the input data.
    *   **Note:** This flow is defined but not currently integrated into the main UI pages. It represents a potential AI feature.
*   **`src/ai/dev.ts`**:
    *   A development entry point for Genkit, importing flows to make them available to the Genkit development UI/tools.

This detailed breakdown should provide a good understanding of the Date Bliss application's architecture, features, and codebase.
