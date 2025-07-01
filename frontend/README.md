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

src/
assets/ _Static files (images, icons, localization files)_

    locales/ _JSON files for multi-language support (i18n)_

components/

    layout/ _App layout components_

    sections/ _Page-specific sections_

    ui/ _Reusable atomic components_

config/ _Centralized app configuration_

context/ _\_Global state_

hooks/ _Custom React hooks_

i18n/ _Internationalization setup_

lib/ _Third-party library wrappers_

pages/ _Route entrypoints_

    index/ Main SPA entry (rendered by Vite)\_

renderer/ _SSR logic and meta tag rendering_

services/ _API interaction layer_

styles/ _Global stylesheets_

utils/ _Utility functions_

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
```

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
