# ShiftBoard — Job Listings Page (multi-file version)

A fully responsive job listings page, split into separate component files instead of one large single-file build.

## Setup instructions

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:
```bash
npm run build
npm run preview
```

## Project structure

```
job-listings-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                     // Vite/React entry point
    ├── App.jsx                      // renders <JobListingsPage />
    ├── data/
    │   └── jobs.js                  // JOBS, CATEGORIES, LOCATIONS, BUDGET_RANGES
    ├── components/
    │   ├── Header.jsx
    │   ├── SearchFilterBar.jsx
    │   ├── JobList.jsx
    │   ├── JobCard.jsx
    │   ├── LoadingSkeleton.jsx
    │   └── EmptyState.jsx
    ├── pages/
    │   └── JobListingsPage.jsx      // container — owns all state, wires everything together
    └── styles/
        └── job-listings.css
```

This is a pure refactor of the single-file `job-listings-page.jsx` build — same components, same props, same state, same parent/child relationships. Nothing about the architecture changed, only where each piece lives on disk.

## Component architecture

```
JobListingsPage (src/pages/JobListingsPage.jsx — owns all state)
 ├── Header
 ├── SearchFilterBar
 ├── LoadingSkeleton   (shown while isLoading)
 ├── EmptyState        (shown when filteredJobs is empty)
 └── JobList
      └── JobCard (× filteredJobs.length)
```

| Component | File | Props in | State owned | Parent |
|---|---|---|---|---|
| `JobListingsPage` | `pages/JobListingsPage.jsx` | — | `isLoading`, `searchTerm`, `category`, `location`, `budgetIndex` (`filteredJobs` derived via `useMemo`) | — |
| `Header` | `components/Header.jsx` | — | `menuOpen` | `JobListingsPage` |
| `SearchFilterBar` | `components/SearchFilterBar.jsx` | filter values + `on*Change` callbacks | none | `JobListingsPage` |
| `JobList` | `components/JobList.jsx` | `jobs` | none | `JobListingsPage` |
| `JobCard` | `components/JobCard.jsx` | `job` | none | `JobList` |
| `LoadingSkeleton` | `components/LoadingSkeleton.jsx` | `count` | none | `JobListingsPage` |
| `EmptyState` | `components/EmptyState.jsx` | `onReset` | none | `JobListingsPage` |

## Features implemented

- Sticky header with logo, nav links, Sign In button; collapses to a hamburger menu on mobile.
- Search bar + Category / Location / Budget-range filters, combined in real time via `useMemo`.
- 12 mock job cards (title, employer, budget, location, skill tags, posted date, proposal count, Apply button).
- "Showing X of Y jobs" counter, updates live with filters.
- Responsive grid: 3 columns (desktop) → 2 columns (≤768px) → 1 column (≤480px).
- Loading skeleton: simulated 1.5s delay on mount, shimmering placeholder cards.
- Empty state with a "Clear filters" action when no jobs match.

## AI tools used

- **Claude (Anthropic)** — used to plan the component architecture, generate components/mock data/CSS/filtering logic, refactor the original single-file build into this multi-file structure, and write this README. All code was reviewed and adjusted by hand.
