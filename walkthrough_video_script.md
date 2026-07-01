# Walkthrough Recording Script (Loom / Video)

Use this script to guide your voiceover walkthrough. It is structured to take roughly 5–8 minutes. Speak naturally, show the page dynamically, and perform the actions live as you talk.

---

## Part 1: Introduction & Goals (approx. 1 min)
**What to show:** Open the page in **Light Mode**. Hover over a few cards, and let the page sit clean.
**What to say:**
> *"Hi team, Manuel. I’m Yash. Today, I’m excited to show you the product discovery catalog I built for the Upwork task. 
> 
> My goal was to create a modern, high-end browsing experience for the home goods catalog that feels premium and instant, while making smart engineering decisions under the hood. 
> 
> I built this application using **Next.js (App Router)** and **TypeScript** for strict type safety, styled with **Vanilla CSS** to avoid heavy frameworks and have total control over the animations and warm home-decor aesthetic."*

---

## Part 2: Addressing Dataset Quirks (approx. 1 min)
**What to show:** Hover over a card that has no image (e.g. *Low Oak Bowl*, ID 13) and point out the clean fallback placeholder, then hover over a cleaned title.
**What to say:**
> *"Before starting, I spent time exploring the `items.json` dataset to get a feel for the data. I noticed a few data quirks that I wanted to clean up programmatically on load:
> 1. **Formatting:** Many product titles were sloppily formatted with leading/trailing spaces and random full uppercase (like `'  VINTAGE OAK BIN '`). I wrote a normalization utility to trim and convert these to clean title-case.
> 2. **Pricing anomalies:** Prices were structured inconsistently—some as floats, some as strings with commas, and some were null. I built sanitization logic to clean and parse them into a unified format.
> 3. **Missing assets & reviews:** For items without image URLs, rather than displaying broken links, I created a custom, modern SVG container. For items with null ratings, I display a clear 'No reviews yet' tag to avoid showing empty stars."*

---

## Part 3: Live Feature Demonstration (approx. 3 mins)
**What to show:** Perform these live actions on screen:
1. **Search:** Type `'Rattan'` in the search bar. Point out how fast the results list updates.
2. **Filtering:** Click on the `'Furniture'` category filter. Highlight that the brand checklist, counts, and items adjust dynamically.
3. **List/Grid Switcher:** Toggle the view switcher from grid to list layout.
4. **Theme Toggle:** Click the moon/sun icon at the top right to switch to **Dark Mode** and back.
5. **Quick View:** Click `'Quick View'` on the *Folding Rattan Bench*. Scroll through the details, tags, and click outside to close.
6. **Pagination:** Clear the filters and scroll to the bottom. Highlight the progress bar showing *"You've viewed 24 of 4000 items"* and click `'Load More Products'`.

**What to say:**
> *"Let me show you how it feels in action. 
> 
> First, search is incredibly fast because it uses **fuzzy token matching**. If I type 'Rattan', it instantly screens the title, brand, description, and tags.Fuzzy token matching splits your search query into individual words and finds products containing all those words in any order or field (e.g. title, category, or brand), even if you only type partial words.
> 
> Next, I've implemented multi-faceted filtering. I can filter by category—like clicking 'Furniture'—or multi-select specific brands, slide the price ranges, or filter by minimum star ratings. Notice that the category counts update dynamically as I search.
> 
> To enhance the premium user experience, I added a layout toggle to switch between a visual **Grid View** and a detailed **List View**. We also have a custom-tailored **Dark Mode** toggle that shifts the palette into an elegant deep charcoal.
> 
> When you click 'Quick View' on any item, it launches a smooth detail modal. It locks background scrolling, registers escape key presses, and displays full tags, dimensions, and descriptions.
> 
> Finally, because rendering 4,000 items in the browser at once would cause severe DOM lag, I designed a **Paginated Infinite Scroll**. It renders in batches of 24, backed by a sleek progress bar indicator."*

---

## Part 4: Technical Rationale & Trade-offs (approx. 2 mins)
**What to show:** Open `tsconfig.json` or `src/utils/sanitize.ts` briefly in your code editor.
**What to say:**
> *"Under the hood, I made a key architectural decision. Because this is a static home goods catalog, I loaded the 1.4 megabyte JSON file in a **Next.js Server Component** on initial render, and passed it to the client. This means the user gets **0ms search and filter latency** once loaded, without making continuous API database requests.
> 
> **What I would build next:**
> 1. **Search Indexing:** If this catalog scaled beyond 10,000 items, downloading the full JSON to the client would hurt initial load speeds. I would migrate the search logic to a server-side indexed search database, like Algolia or Meilisearch.
> 2. **Image CDN:** I'd pipe the images through a CDN using Next.js optimized `<Image>` tags for responsive resizing.
> 
> **The main trade-off to watch:**
> - The trade-off is **Initial Bundle Size vs. Search Latency**. Storing the dataset locally gives us a beautiful, instant search experience, but it increases the initial page weight. As the catalog grows, we will need to swap client-side sorting for paginated server API calls."*

---

## Part 5: Close (approx. 30 seconds)
**What to say:**
> *"That wraps up the walkthrough. The repository is fully ready, typed with TypeScript, and has a README explaining the setup. Let me know if you have any questions, and I look after hopping on a video call in a couple of days. Thank you!"*
