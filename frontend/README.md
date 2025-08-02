# RayVerse Frontend – React SPA

[Visit Live Site](https://rayverse.pages.dev/)

## Overview

This is the frontend SPA of my personal website, showcasing my developer portfolio, blog, and hobbies gallery. It is built with React and Tailwind CSS, and deployed via Cloudflare Pages. The frontend interacts with a Node.js + Express backend through RESTful APIs and uses Cloudflare R2 and MongoDB Atlas as storage solutions.

## Design

This frontend is fully designed and prototyped in Figma:
[Figma Design File](https://www.figma.com/design/LJxmbUxktw9hDvroCbiaLK/protfolio-of-myself?node-id=0-1&t=FyQPzsDKEQvxn5i2-1)

## Tech Stack

- Framework: React + Vite
- Styling: Tailwind CSS + shadcn/ui
- State Management: Local state, Context API
- API Communication: Fetch/Promise
- Deployment: Cloudflare Pages

## Project Structure

````text
src/
├── assets/                       # Static files (images, icons, localization files)
│   └── locales/                  # JSON files for multi-language support (i18n)
├── components/
│   ├── layout/                   # App layout components
│   ├── sections/                 # Page-specific sections
│   └── ui/                       # Reusable atomic components
├── config/                       # Centralized app configuration
├── context/                      # Global state
├── hooks/                        # Custom React hooks
├── i18n/                         # Internationalization setup
├── lib/                          # Third-party library wrappers
├── pages/                        # Route entrypoints
│   └── index/                    # Main SPA entry (rendered by Vite)
├── renderer/                     # SSR logic and meta tag rendering
├── services/                     # API interaction layer
├── styles/                       # Global stylesheets
└── utils/                        # Utility functions
````

## Routing

All sections are rendered under `/` and accessed via hash-based scrolling. Navigation is handled via anchor links and smooth scrolling behavior. No separate routes or reloads are required.

- `/#stack` — Technical stack showcase
- `/#whyme` — Self-introduction with skill radar
- `/#takes` — My Takes: blog section with filters and popup reading
- `/#gallery` — Hobbies Gallery with media viewer
- `/#contact` — Contact section with form and resume download

Some dynamic routes are used to fetch specific content from the backend:

- `/articles` — Fetch a specific page of blog summaries
- `/articles/slug/slug-name?lang=en` — Fetch content of a specific article
- `/images/thumbnails` — Fetch all image thumbnails in the gallery
- `/images/slug/slug-name` — Fetch a high-resolution image
- `/video` — Fetch all video resources

## API Integration

The frontend communicates with the backend via a set of RESTful endpoints:

- `GET /api/version/articles` — Fetch paginated list of blog posts
- `GET /api/version/articles/slug/slug-name` — Fetch single blog by slug
- `GET /api/version/images/thumbnails` — Retrieve gallery image's thumbnails
- `GET /api/version/images/slug/slug-name` — Fetch single image by slug
- `GET /api/version/video` — Retrieve gallery videos
- `POST /api/version/contact` — Submit contact form data

Fetch/Promise is used for all HTTP requests. API base URL is set via `.env`:

```env
VITE_API_BASE_URL=https://rayverse.onrender.com/api/v1
````

## State & User Experience

- SSR support is used for meta tags and critical content blocks
- Preloading process displays a loading prompt
- Blog filters and pagination are fully client-managed via local state
- Form abuse is mitigated with localStorage-based cooldown timers
- Loading and error states are handled with animated feedback UI

## Deployment Instructions

```bash
git clone https://github.com/Ray-817/rayverse-frontend
cd rayverse-frontend
npm install
npm run dev
```
