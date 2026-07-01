# Foundry Home | Product Discovery Catalog

An elegant, high-performance product discovery page built for a catalog of over 4,000 home goods items using Next.js (App Router) and Vanilla CSS. 

## Key Features

- **Instant, Real-time Search:** Tokenized fuzzy search across titles, brands, categories, tags, and descriptions.
- **Multi-faceted Filtering:** Filter dynamically by Category, Brand (multi-select), Price Range, Minimum Rating, and In-Stock status.
- **Quick-View Modal:** Deep dive into product descriptions, metadata tags, and release dates with an overlay interface.
- **Rendering Optimization (Pagination):** Handled large dataset performance by implementing chunked loading (24 items per page) with visual progress feedback, keeping DOM rendering times extremely low.
- **Double Theme Option:** Complete dark mode toggle styling using modern HSL CSS variables.
- **Fully Responsive Layout:** Supports grid and list views on mobile and desktop viewports.

## Core Engineering Decisions

1. **Hybrid Architecture (Next.js):** 
   The catalog uses a Next.js Server Component to import the static JSON file at build time, passing it down to a Client Component. This avoids any runtime fetch latency while maintaining instant client-side interactivity.
2. **Data Sanitization & Cleaning:**
   Cleaned uppercase string values (e.g. `"  VINTAGE OAK BIN "`) to title case, parsed inconsistent pricing fields (strings with commas vs floats vs nulls), and handled empty images by rendering inline SVG placeholders.
3. **No Mismatch Hydration Shield:**
   Used an early mount check in React to bypass SSR hydration discrepancies regarding locale/currency formatting.
4. **No Tailwind / Pure CSS:**
   Implemented custom HSL variables, smooth bounce curves, and viewport-aware layouts to present a premium feel tailored for home goods catalogs.

## How to Run the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

3. Build for production:
   ```bash
   npm run build
   ```
