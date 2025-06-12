
# NepaliDate Application Documentation

## 1. Project Overview

**App Name:** NepaliDate

**Core Mission:** To provide a user-friendly and reliable tool for converting dates between Bikram Sambat (BS) and Gregorian (AD) calendars, and to offer information about Nepali holidays and events for specific BS months. The application also exposes a Nepali Calendar API (protected by an API key) for programmatic access to this Bikram Sambat calendar data.

**Tech Stack:**
*   **Framework:** Next.js (with App Router)
*   **Language:** TypeScript
*   **UI Library:** React
*   **Component Library:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **AI Integration:** Genkit (for potential future AI-driven features, currently includes a holiday/event summarizer flow)
*   **Data Storage:** JSON files for Bikram Sambat calendar data

## 2. Core Features

*   **Date Conversion (Website Use Only):**
    *   Bikram Sambat (BS) to Gregorian (AD) Converter (Implemented via Server Actions, intended for website UI use)
    *   Gregorian (AD) to Bikram Sambat (BS) Converter (Implemented via Server Actions, intended for website UI use)
    *   *Data Access Note:* The conversion Server Actions directly access the local Bikram Sambat calendar data (JSON files) for event information. This access is internal to the application server.
*   **Date Validation:** Input validation notifies users of impossible date inputs (e.g., BS day exceeding days in the month).
*   **Date Picker:** User-friendly date picker components (including Combobox for year input) for easy date selection in both BS and AD converters.
*   **Event Display:** For a selected/converted BS month, the application displays Nepali holidays and events:
    *   Holidays and Festivals (`holiFest`) from the Nepali Patro
    *   Auspicious Marriage Dates (`marriage`)
    *   Auspicious Bratabandha Dates (`bratabandha`)
*   **Nepali Calendar API Access (API Key Protected):**
    *   `/api/calendar/info`: Provides detailed API documentation for the Bikram Sambat calendar data. Requires an API key.
    *   `/api/calendar/{YYYY}`: Fetches all calendar data for a specific BS year (YYYY). Requires an API key.
    *   `/api/calendar/{YYYY}/{MM}`: Fetches calendar data for a specific BS year (YYYY) and month (MM). Requires an API key.
*   **API Playground:** Interactive UI to test all available Nepali Calendar API endpoints (`/api/calendar/info`, `/api/calendar/{YYYY}`, and `/api/calendar/{YYYY}/{MM}`), including a field to input the required API key. Displays request and response details, including headers and body. Provides example code snippets in JavaScript, Python, and Node.js for the selected endpoint and parameters. Provides a link to the "Get API Key" page.
*   **Get API Key Page:** A dedicated page (`/get-api-key`) providing instructions on how to request an API key by emailing `contact@sevenx.com.np`.
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

## 4. API Endpoints (Nepali Calendar API - API Key Protected)

All `/api/calendar/*` endpoints require a valid API key to be sent in the `X-API-Key` request header.
The API key can be set in the `.env` file as `API_KEY_NEPALIDATE="your_secret_api_key_here"`.
Users can request an API key by following the instructions on the `/get-api-key` page.

### 4.1. API Information

*   **Route:** `/api/calendar/info`
*   **Method:** `GET`
*   **Authentication:** Requires `X-API-Key` header.
*   **Description:** Provides comprehensive documentation about the Bikram Sambat Calendar API, including endpoint details, data structures, data coverage, and usage notes.
*   **Implementation:** `src/app/api/calendar/info/route.ts` (Uses `src/lib/apiInfoGenerator.ts`)

### 4.2. Get BS Year Data (Nepali Patro Data for entire year)
*   **Route:** `/api/calendar/{YYYY}`
    *   `{YYYY}`: Bikram Sambat year (e.g., 2079)
*   **Method:** `GET`
*   **Authentication:** Requires `X-API-Key` header.
*   **Description:** Retrieves all calendar data for the specified BS year, including all 12 months. Each month's data includes daily details, Nepali holidays, festivals, and other events.
*   **Response:** An array of `BsMonthData` objects, one for each month of the specified year.
*   **Implementation:** `src/app/api/calendar/[year]/route.ts`

### 4.3. Get BS Month Data (Nepali Patro Data for specific month)

*   **Route:** `/api/calendar/{YYYY}/{MM}`
    *   `{YYYY}`: Bikram Sambat year (e.g., 2079)
    *   `{MM}`: Bikram Sambat month (1 for Baishakh, 12 for Chaitra)
*   **Method:** `GET`
*   **Authentication:** Requires `X-API-Key` header.
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
    *   Includes `experimental.outputFileTracingIncludes` to ensure the `data` directory is included in Vercel builds.
*   **`package.json`**:
    *   Lists project dependencies (e.g., `next`, `react`, `tailwindcss`, `lucide-react`, `genkit`, ShadCN UI components, `date-fns`, `zod`, `cmdk`). `axios` is in devDependencies for API Playground snippet example.
    *   Defines scripts for development (`dev`), building (`build`), starting (`start`), linting (`lint`), type checking (`typecheck`), and running the data scraper (`scrape`) for Bikram Sambat data. The `build` script is `"npm run scrape && next build"`.
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
    *   Used for environment variables (e.g., `NEXT_PUBLIC_APP_URL`, `API_KEY_NEPALIDATE`).
*   **`.vscode/settings.json`**:
    *   VSCode editor settings, enabling IDX AI features.
*   **`public/manifest.json`**: Basic web app manifest file.

### 5.2. Root Application Files (`src/app/`)

*   **`src/app/layout.tsx`**:
    *   The root layout component for the entire application.
    *   Sets up the `<html>` and `<body>` tags.
    *   Imports global CSS (`globals.css`) and custom fonts ('Inter' and 'Alegreya').
    *   Includes `<AppHeader />`, `<AppFooter />`, and `<Toaster />` for consistent layout and notifications.
    *   Defines global SEO metadata (title, description, keywords, Open Graph, Twitter cards) that can be overridden by individual pages. It sets `metadataBase` for correct Open Graph URL generation. Keywords include "BS to AD converter," "AD to BS converter," "Nepali Calendar," "Bikram Sambat," "NepaliDate." Includes a link to `manifest.json`.
    *   Configures the viewport theme color.
*   **`src/app/globals.css`**:
    *   Imports Tailwind CSS base, components, and utilities.
    *   Defines CSS variables for the ShadCN UI theme, including colors for light and dark modes, based on the PRD's style guidelines.
    *   Applies base styles to the body and heading elements.
*   **`src/app/actions.ts`**:
    *   Contains Next.js Server Actions used by the converter pages.
    *   `convertBsToAdWithEvents(bsDate)`: Converts BS to AD. Internally calls `fetchEventData` which directly uses `getBsCalendarData()` from local JSONs to fetch associated events (Nepali holidays, marriage, bratabandha) for the target BS month.
    *   `convertAdToBsWithEvents(adDate)`: Converts AD to BS. Internally calls `fetchEventData` which directly uses `getBsCalendarData()` from local JSONs to fetch associated events for the resulting BS month.
    *   `fetchEventData(bsYear, bsMonth)`: Helper function that now directly uses `getBsCalendarData()` to retrieve event data from local JSON files.
    *   **Security Note on Server Actions:** Next.js Server Actions are invoked via HTTP POST requests by the application's frontend. The `/api/calendar/*` endpoints are separately protected by an API key for external use.

### 5.3. Page Routes (`src/app/.../page.tsx`)

#### 5.3.1. `src/app/page.tsx` (Route: `/`)
*   The homepage of the application, a central hub for date conversion tools.
*   Provides a welcoming message and navigation links to the BS-to-AD and AD-to-BS converters, and the Nepali Calendar API documentation.
*   Uses ShadCN `Card` and `Button` components for layout.
*   Includes page-specific SEO metadata for title, description, keywords, Open Graph, and Twitter cards, optimized with terms like "BS to AD converter," "Nepali Calendar API," and "Bikram Sambat."

##### Key Page Content (for SEO Analysis):
*   **Route:** `/`
*   **Main Heading (H1 Equivalent - Visual):** "Welcome to NepaliDate" (Accompanied by `CalendarDays` icon)
*   **Main Descriptive Paragraph:** "Your one-stop solution for Bikram Sambat (BS) and Gregorian (AD) date conversions, enriched with holiday and event insights for the Nepali calendar. Use our BS to AD converter, AD to BS converter, or explore the Nepali Calendar API."
*   **Section Cards:**
    *   **Card 1: BS to AD Converter**
        *   **Heading (H2 Equivalent - CardTitle):** "BS to AD Converter" (Accompanied by `ArrowRightLeft` icon)
        *   **Description (CardDescription):** "Convert Bikram Sambat (BS) dates to Gregorian (AD) dates and see relevant Nepali calendar events using our accurate converter."
        *   **Button Text:** "Go to BS to AD Converter"
        *   **Button Link:** `/bs-to-ad`
    *   **Card 2: AD to BS Converter**
        *   **Heading (H2 Equivalent - CardTitle):** "AD to BS Converter" (Accompanied by `ArrowRightLeft` icon)
        *   **Description (CardDescription):** "Convert Gregorian (AD) dates to Bikram Sambat (BS) dates and explore Nepali Patro events with our reliable tool."
        *   **Button Text:** "Go to AD to BS Converter"
        *   **Button Link:** `/ad-to-bs`
    *   **Card 3: Nepali Calendar API**
        *   **Heading (H2 Equivalent - CardTitle):** "Nepali Calendar API" (Accompanied by `ServerIcon` icon)
        *   **Description (CardDescription):** "Explore our comprehensive API for Bikram Sambat calendar data, including Nepali holidays, festivals, and events. Perfect for developers."
        *   **Button Text:** "View API Details"
        *   **Button Link:** `/api-info`

#### 5.3.2. `src/app/bs-to-ad/page.tsx` (Route: `/bs-to-ad`)
*   Client component (`'use client'`). Allows users to convert Bikram Sambat (BS) dates to Gregorian (AD).
*   Users input BS year using a `Combobox` (type or select), and month/day via `Select`. BS year range: 1992-2110.
*   Uses `react-hook-form` and `zod` for form handling and validation. Zod schema uses `CLIENT_SIDE_BS_YEARS` for year range and `getClientSafeDaysInBsMonth` for day validation.
*   On submission, calls `convertBsToAdWithEvents` server action.
*   Displays converted AD date and Nepali events. Handles loading/errors.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/bs-to-ad`
*   **Main Heading (Card Title - H1 equivalent):** "Bikram Sambat (BS) to Gregorian (AD) Converter"
*   **Description (Card Description):** "Use this BS to AD converter to accurately change Bikram Sambat dates to Gregorian (AD) and discover associated Nepali holidays and events for the chosen BS month from the Nepali Patro."
*   **Form Labels:** "BS Year", "BS Month", "BS Day"
*   **Button Text:** "Convert BS to AD"
*   **Result Display (Dynamic):** "Gregorian (AD) Date", "{AD_Day} {AD_Month_Name} {AD_Year}", "{AD_Day_Of_Week}"
*   **Event Summary Display (Dynamic):** "Events & Holidays: {BS_Month_Name} {BS_Year}"

#### 5.3.3. `src/app/ad-to-bs/page.tsx` (Route: `/ad-to-bs`)
*   Client component (`'use client'`). Converts Gregorian (AD) to Bikram Sambat (BS).
*   Users input AD year using a `Combobox` (type or select), and month/day via `Select`. AD year range: 1930 - (current year + 10).
*   Uses `react-hook-form` and `zod` for form handling. Zod schema validates against days in AD month.
*   On submission, calls `convertAdToBsWithEvents` server action.
*   Displays converted BS date and Nepali events. Handles loading/errors.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/ad-to-bs`
*   **Main Heading (Card Title - H1 equivalent):** "Gregorian (AD) to Bikram Sambat (BS) Converter"
*   **Description (Card Description):** "Use our AD to BS converter to easily change Gregorian dates to Bikram Sambat (BS). This tool also displays relevant Nepali holidays and events from the Nepali Patro for the converted BS month."
*   **Form Labels:** "AD Year", "AD Month", "AD Day"
*   **Button Text:** "Convert AD to BS"
*   **Result Display (Dynamic):** "Bikram Sambat (BS) Date", "{BS_Day} {BS_Month_Name} {BS_Year}", "{BS_Day_Of_Week}"
*   **Event Summary Display (Dynamic):** "Events & Holidays: {BS_Month_Name} {BS_Year}"

#### 5.3.4. `src/app/api-info/page.tsx` (Route: `/api-info`)
*   Server Component that now directly calls `generateApiInfoObject` from `src/lib/apiInfoGenerator.ts` to get API documentation data.
*   Displays detailed information about the Nepali Calendar API.
*   Uses ShadCN components for structured display. Links to API Playground and "Get API Key" page.
*   Includes page-specific SEO metadata. Data coverage section will reflect actual scraped years.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/api-info`
*   **Main Title (H1, Dynamic from generator):** e.g., "NepaliDate: Nepali Calendar & Bikram Sambat API"
*   **Main Description (Dynamic from generator):** Mentions API Key requirement.
*   **Authentication Section (Dynamic from generator):** Links to `/get-api-key`.
*   **Section Titles (H2/Card Titles):** "Nepali Calendar API Endpoints", "API Data Structures (BS Calendar)", "Data Coverage & Notes (Nepali Patro)"
*   **Data Coverage Section (Dynamic from generator):** "Available Bikram Sambat Years in Data:" (Shows years from `getBsYears()`)

#### 5.3.5. `src/app/api-playground/page.tsx` (Route: `/api-playground`)
*   Client component (`'use client'`).
*   Interactive interface for testing Nepali Calendar API endpoints. BS Year input uses `Select` populated by `CLIENT_SIDE_BS_YEARS` (1992-2110).
*   Includes API key input, request/response display, and code snippets.
*   Links to `/api-info` and `/get-api-key`.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/api-playground`
*   **Main Heading (Card Title - H1 equivalent):** "Nepali Calendar API Playground"
*   **Description (Card Description):** Links to `/api-info` and `/get-api-key`.
*   **Form Labels:** "API Key", "Bikram Sambat Year (YYYY)", "Bikram Sambat Month (MM)"
*   **Request Details Section (Dynamic):** Shows URL and `X-API-Key` usage.
*   **Button Texts:** "Send API Request", "Open"
*   **API Response Section (Dynamic):** Status, headers, body.
*   **Code Snippets Section (Dynamic):** JS, Python, Node.js examples.

#### 5.3.6. `src/app/get-api-key/page.tsx` (Route: `/get-api-key`)
*   Server Component.
*   Provides instructions on requesting an API key by emailing `contact@sevenx.com.np`.
*   Outlines required information (name, use case).
*   Includes SEO metadata. Uses ShadCN `Card`, `Button`.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/get-api-key`
*   **Main Heading (H1 Equivalent - CardTitle):** "Request Your NepaliDate API Key"
*   **Description (CardDescription):** "Unlock access to our comprehensive Bikram Sambat calendar data..."
*   **Section Headings:** "How to Request an API Key", "What to Expect"
*   **Button Text (Call to Action):** "Request API Key Now" (mailto link)
*   **Footer Text:** Links to `/api-info`.

### 5.4. API Route Handlers (`src/app/api/.../route.ts`)

*   **`src/app/api/calendar/info/route.ts`**:
    *   `GET` handler that calls `generateApiInfoObject` from `src/lib/apiInfoGenerator.ts`.
    *   Checks for `X-API-Key`. Returns 401 if invalid/missing.
*   **`src/app/api/calendar/[year]/route.ts`**:
    *   `GET` handler for BS year data. Checks `X-API-Key`. Uses `getBsCalendarData()`.
*   **`src/app/api/calendar/[...params]/route.ts`**:
    *   `GET` handler for BS year/month data. Checks `X-API-Key`. Uses `getBsCalendarData()`.
*   **`src/app/api/data/*`**: Deprecated, return 410.

### 5.5. Library Files (`src/lib/`)

*   **`src/lib/utils.ts`**: `cn` utility.
*   **`src/lib/date-converter.ts`**: Conversion logic. Uses `getBsCalendarData()`.
*   **`src/lib/bsCalendarData.ts`**: Manages loading/accessing calendar data from JSONs. Functions: `loadCalendarDataFromFileSystem`, `getBsCalendarData`, `getDaysInBsMonth`, `getBsYears`.
*   **`src/lib/apiInfoGenerator.ts`**: Logic to generate the API documentation object used by `/api/calendar/info` route and `/api-info` page.

### 5.6. UI Components (`src/components/`)

*   **`src/components/ui/`**: ShadCN UI components, including the new `Combobox`.
*   **`src/components/layout/AppHeader.tsx` & `AppFooter.tsx`**: Standard layout.
*   **`src/components/converters/DateConverterFormFields.tsx`**: `BsDateFormFields` (uses `Combobox` for year), `ResultDisplay`.
*   **`src/components/converters/EventSummaryDisplay.tsx`**: Displays Nepali events.
*   **`src/components/playground/CodeSnippetDisplay.tsx`**: Client component for API Playground code snippets.

### 5.7. TypeScript Types (`src/types/index.ts`)

*   Defines data structures (`BsDayData`, `BsMonthData`, `NepaliDate`, `EnglishDate`, API info types).
*   Includes `CLIENT_SIDE_BS_YEARS` (1992-2110) and `DAYS_IN_BS_MONTH` map (user to extend for full 2110 client validation accuracy).

### 5.8. Hooks (`src/hooks/`)

*   **`src/hooks/use-toast.ts`**: Custom hook for toast notifications.
*   **`src/hooks/use-mobile.tsx`**: Custom hook for mobile detection.

### 5.9. Data Files (`data/`)

*   Contains Bikram Sambat calendar data in `YYYY/M.json` format. Target range up to 2110.

### 5.10. Scraper Scripts (`scripts/`)

*   **`scripts/calendar-scraper.js`**: Node.js script to scrape calendar data.
*   **`scripts/run-scraper.js`**: Automates the scraper for BS years 1992 to 2110.

### 5.11. AI Integration (Genkit - `src/ai/`)

*   **`src/ai/genkit.ts`**: Initializes Genkit.
*   **`src/ai/flows/holiday-event-analyzer.ts`**: Genkit flow for summarizing BS events.
*   **`src/ai/dev.ts`**: Development entry point for Genkit.

This detailed breakdown should provide a good understanding of the NepaliDate application's architecture, features, and codebase, with a focus on its date conversion capabilities and Nepali Calendar API.
    
