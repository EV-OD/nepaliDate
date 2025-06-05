
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
    *   *Data Access Note:* The conversion Server Actions internally fetch event data by calling the application's own `/api/calendar/{YYYY}/{MM}` endpoint, which requires the server-configured `API_KEY_NEPALIDATE` for access. This ensures calendar data is centrally managed and secured.
*   **Date Validation:** Input validation notifies users of impossible date inputs (e.g., BS day exceeding days in the month).
*   **Date Picker:** User-friendly date picker components for easy date selection in both BS and AD converters.
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
*   **Implementation:** `src/app/api/calendar/info/route.ts`

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
*   **`package.json`**:
    *   Lists project dependencies (e.g., `next`, `react`, `tailwindcss`, `lucide-react`, `genkit`, ShadCN UI components, `date-fns`, `zod`). `axios` is in devDependencies for API Playground snippet example.
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
    *   Used for environment variables (e.g., `NEXT_PUBLIC_APP_URL`, `API_KEY_NEPALIDATE`).
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
    *   `convertBsToAdWithEvents(bsDate)`: Converts BS to AD. Internally calls the app's API-key-protected `/api/calendar/{YYYY}/{MM}` endpoint to fetch associated events (Nepali holidays, marriage, bratabandha) for the target BS month.
    *   `convertAdToBsWithEvents(adDate)`: Converts AD to BS. Internally calls the app's API-key-protected `/api/calendar/{YYYY}/{MM}` endpoint to fetch associated events for the resulting BS month.
    *   `fetchEventData(bsYear, bsMonth)`: A helper function that now makes an authenticated internal API call to retrieve event data.
    *   **Security Note on Server Actions:** Next.js Server Actions are invoked via HTTP POST requests by the application's frontend. While they have built-in mechanisms (like unique action IDs) that deter casual external calls, dedicated scripts can potentially invoke them if the action ID and payload structure are known. The event data these actions consume is fetched from API-key-protected endpoints. For truly "website-only" execution of the actions themselves, more advanced techniques like strict CSRF token validation beyond Next.js defaults, session-based checks (if users were authenticated), or WAF rules would be needed. Rate limiting is a recommended general security measure.

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
*   Allows users to input a Bikram Sambat date (year, month, day) using `Select` components.
*   Uses `react-hook-form` and `zod` for form handling and validation.
*   The Zod schema includes a `refine` function to validate that the selected day is valid for the chosen BS month and year using `getClientSafeDaysInBsMonth`.
*   On submission, calls the `convertBsToAdWithEvents` server action.
*   Displays the converted AD date and relevant Nepali holidays and events using `ResultDisplay` and `EventSummaryDisplay` components.
*   Handles loading states (`useTransition`) and displays errors using `toast`.
*   This page does not export its own `metadata` or `generateMetadata` function due to being a client component. It inherits metadata from `layout.tsx`. On-page H1 and descriptions are optimized for "BS to AD converter" and related terms.

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
*   This page does not export its own `metadata` or `generateMetadata` function due to being a client component. It inherits metadata from `layout.tsx`. On-page H1 and descriptions are optimized for "AD to BS converter" and related terms.

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
*   Server Component that fetches API documentation details from `/api/calendar/info` using the server-configured API key.
*   Displays detailed information about the Nepali Calendar API, including endpoints, data structures, data coverage for Bikram Sambat years, usage notes, and API key authentication requirements.
*   Uses ShadCN `Card`, `Accordion`, `Badge`, and custom table rendering for a structured and readable documentation page.
*   Provides links to the API Playground and the "Get API Key" page.
*   Includes page-specific SEO metadata for title, description, keywords (e.g., "Nepali Calendar API", "Bikram Sambat API", "API Documentation"), Open Graph, and Twitter cards. Content is optimized for these terms.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/api-info`
*   **Main Title (H1, Dynamic from API):** e.g., "NepaliDate: Nepali Calendar & Bikram Sambat API"
*   **Main Description (Dynamic from API):** e.g., "A comprehensive API for Bikram Sambat (BS) to Gregorian (AD) date conversions and Nepali calendar event data... Requires API Key authentication via 'X-API-Key' header."
*   **Badges (Dynamic from API):** "Version: {version}", "Status: {status}"
*   **Authentication Section (Dynamic from API):**
    *   Type: `API Key`
    *   Header Name: `X-API-Key`
    *   Description: "A valid API key must be provided in the 'X-API-Key' request header for all /api/calendar/* endpoints. If you don't have one, you can [request an API key here](/get-api-key)."
*   **Contact (Dynamic from API):** "Contact: {contact@sevenx.com.np}" (with mailto link)
*   **Button Texts:** "Go to API Playground" (Links to `/api-playground`), "Request an API Key" (Links to `/get-api-key`)
*   **Section Titles (H2/Card Titles):**
    *   "Nepali Calendar API Endpoints"
    *   "API Data Structures (BS Calendar)"
    *   "Data Coverage & Notes (Nepali Patro)"
*   **Endpoint Accordion Triggers (Dynamic):**
    *   `GET /api/calendar/info`
    *   `GET /api/calendar/{YYYY}`
    *   `GET /api/calendar/{YYYY}/{MM}`
*   **Key Descriptions within Endpoints (Dynamic from API, examples):**
    *   "Provides detailed information about the Nepali Calendar API..." (mentions API Key requirement)
    *   "Retrieves all Bikram Sambat (BS) calendar data for a specific BS year (YYYY), including all 12 months. Requires API Key."
    *   "Retrieves Bikram Sambat (BS) calendar data for a specific BS year (YYYY) and month (MM, 1-12). Includes daily details, Nepali holidays, festivals, and other events. Requires API Key."
    *   Parameter names and descriptions (e.g., "YYYY", "MM")
    *   "Example Request:", "Example Response:", "Example Response Summary:", "Possible Error Responses:" (followed by code blocks or lists, error responses include 401 Unauthorized)
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
    *   "Important Notes for API Users:" (followed by a list of notes, dynamic from API, now including API key usage and link to `/get-api-key`)
*   **Footer Note (Dynamic):** "Nepali Calendar API Documentation last updated: {current date}" (generated on page render)
*   **Icons:** `Network`, `ListTree`, `Database`, `Info`, `AlertCircle`, `KeyRound` (for authentication), `Send` (for API key request) are used with section titles.

#### 5.3.5. `src/app/api-playground/page.tsx` (Route: `/api-playground`)
*   Client component (`'use client'`).
*   Provides an interactive interface for users to test the Nepali Calendar API endpoints: `/api/calendar/info`, `/api/calendar/{YYYY}`, and `/api/calendar/{YYYY}/{MM}`.
*   Users can select the endpoint and relevant BS Year/Month.
*   Includes an input field for the `X-API-Key`.
*   Dynamically displays the request URL, request headers (including API key), and allows users to send the request.
*   Shows the API response status code, response headers, and the JSON response body.
*   Provides example code snippets in JavaScript (Fetch), Python (requests), and Node.js (axios) for the selected endpoint and parameters, with a copy-to-clipboard feature.
*   Uses `react-hook-form`, `zod`, ShadCN components (including `RadioGroup` for endpoint selection, `Input` for API key, `Tabs` for code snippets).
*   This page does not export its own `metadata` or `generateMetadata` function due to being a client component. It inherits metadata from `layout.tsx`. On-page H1 and descriptions are optimized for "API Playground," "Nepali Calendar API," and "Bikram Sambat." Links to `/api-info` and `/get-api-key`.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/api-playground`
*   **Main Heading (Card Title - H1 equivalent):** "Nepali Calendar API Playground" (Accompanied by `TestTube2` icon)
*   **Description (Card Description):** "Test the NepaliDate Bikram Sambat (BS) calendar API endpoints. Select an endpoint, provide parameters and your API key. View the full <Link href='/api-info' class='...'>Nepali Calendar API documentation here</Link>, or <Link href='/get-api-key' class='...'>request an API key</Link> if you don't have one."
*   **Form Label:** "API Key" (Associated with an `Input` field for X-API-Key)
*   **Endpoint Selection Label:** "Select API Endpoint:"
*   **Endpoint Radio Options & Labels:**
    *   `/api/calendar/info`
    *   `/api/calendar/[YYYY]`
    *   `/api/calendar/[YYYY]/[MM]`
*   **Form Labels (conditional):**
    *   "Bikram Sambat Year (YYYY)"
    *   "Bikram Sambat Month (MM)"
*   **Request Details Section (Dynamic):**
    *   "Request URL for API:" (followed by the URL)
    *   "Request Headers:" (showing `X-API-Key` usage)
*   **Button Texts:**
    *   "Send API Request"
    *   "Open" (next to request URL, to open in new tab)
*   **API Response Section (Dynamic):**
    *   "API Response" (section title)
    *   "Status: {statusCode}"
    *   "Response Headers:" (listing key headers like Content-Type)
    *   "Error: {errorMessage}" (if an error occurs)
    *   "Response Body:" (followed by JSON data or error object)
*   **Code Snippets Section (Dynamic):**
    *   "Code Snippets" (section title)
    *   Tabs for JavaScript, Python, Node.js with copy buttons.
*   **Toast Messages (Dynamic, on action):**
    *   Success: "Success", "API request successful."
    *   Error: "Error: {statusCode}", "{error_message}" or "Fetch Error", "{error_message}"
    *   URL Error: "Error", "Could not construct request URL. Please select valid parameters."
    *   API Key Error: "Error", "API Key is required."
    *   Copy Snippet: "Copied!", "Snippet copied to clipboard."
*   **Icons:** `TestTube2` (main title), `Code` (response section title), `CodeXml` (snippets section title), `PlayCircle` (button), `ExternalLink` (button), `FileText`, `List`, `CalendarClock` (endpoint selection), `KeyRound` (API Key label), `Copy` (copy button).

#### 5.3.6. `src/app/get-api-key/page.tsx` (Route: `/get-api-key`)
*   Server Component.
*   Provides detailed instructions on how to request an API key by emailing `contact@sevenx.com.np`.
*   Outlines required information for the request (name, use case, etc., excluding expected volume).
*   Includes SEO metadata optimized for "get api key," "NepaliDate API key," etc.
*   Uses ShadCN `Card`, `Button`, and relevant icons for a clear, user-friendly layout.

##### Key Page Content (for SEO Analysis):
*   **Route:** `/get-api-key`
*   **Main Heading (H1 Equivalent - CardTitle):** "Request Your NepaliDate API Key" (Accompanied by `Mail` icon)
*   **Description (CardDescription):** "Unlock access to our comprehensive Bikram Sambat calendar data by requesting your personal API key."
*   **Section Heading 1:** "How to Request an API Key" (Accompanied by `Send` icon)
    *   Paragraph: "To obtain an API key for the NepaliDate service, please send an email to our support team with the following details..."
    *   Step 1 Heading: "Step 1: Compose Your Email" (Icon: `Info`)
    *   Step 2 Heading: "Step 2: Recipient & Subject" (Icon: `Mail`)
        *   Text: "Address the email to: {contact@sevenx.com.np}"
        *   Text: "Use the subject line: {API Key Request for NepaliDate}"
    *   Step 3 Heading: "Step 3: Provide Required Information" (Icon: `FileText`)
        *   List items: "Your Name / Company Name", "Contact Email", "Intended Use Case", "Application/Website URL (if applicable)"
*   **Section Heading 2:** "What to Expect" (Accompanied by `ShieldCheck` icon)
    *   List items: "We aim to review API key requests and respond within 2-3 business days.", "Once approved, your unique API key... will be sent...", "Please ensure our emails are not going to your spam folder."
*   **Button Text (Call to Action):** "Request API Key Now" (Links to mailto: `contact@sevenx.com.np` with pre-filled subject)
*   **Footer Text:** "If you have any questions... visit the [API Documentation page](/api-info)."

### 5.4. API Route Handlers (`src/app/api/.../route.ts`)

*   **`src/app/api/calendar/info/route.ts`**:
    *   `GET` handler that returns a JSON object containing detailed API documentation for the Nepali Calendar API.
    *   Checks for a valid `X-API-Key` header. Returns 401 if invalid/missing.
    *   Dynamically fetches available BS years using `getBsYears()` to include in the documentation.
    *   Constructs example request URLs based on the current request's origin.
    *   Defines the structure of `BsMonthData` and `BsDayData` and explains each field. Includes comprehensive descriptions, notes on delimiters (`_::_`), and the `ne` field for Nepali dates in English numerals. Content is optimized for keywords like "Nepali Calendar API", "Bikram Sambat API", and "event data". Its `apiName` is "NepaliDate: Nepali Calendar & Bikram Sambat API". Contact email is `contact@sevenx.com.np`. Mentions API key requirement.
*   **`src/app/api/calendar/[year]/route.ts`**:
    *   `GET` handler for fetching all calendar data for a specific BS year.
    *   Checks for a valid `X-API-Key` header. Returns 401 if invalid/missing.
    *   Extracts the `year` from the dynamic path parameter.
    *   Uses `getBsCalendarData()` and filters for the specific year.
    *   Returns an array of `BsMonthData` objects for the year, or a 404 if no data.
*   **`src/app/api/calendar/[...params]/route.ts`**:
    *   `GET` handler for fetching calendar data for a specific BS year and month.
    *   Checks for a valid `X-API-Key` header. Returns 401 if invalid/missing.
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
*   **`src/components/playground/CodeSnippetDisplay.tsx` (New)**:
    *   Client component for displaying dynamic code snippets (JS, Python, Node.js) for API calls in the API Playground. Includes copy-to-clipboard functionality.

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
    
