# RayVerse Backtend – Node.js API

[Base API URL](https://rayverse.onrender.com/api/v1)

## Overview

This is the backend service for my personal portfolio SPA. It provides RESTful API endpoints for blog posts, gallery media, and contact form handling. The backend uses **Node.js + Express**, with **MongoDB Atlas** as the primary cloud database, and **Cloudflare R2** for media storage via S3-compatible API.

## Tech Stack

- Language: Node.js (ESM)
- Framework: Express.js
- Database: MongoDB Atlas (cloud-hosted)
- File Storage: Cloudflare R2 (S3-compatible)
- Middleware: `cors`, `morgan`, `express-validator`, `express-rate-limit`
- Deployment: Render / UptimeRobot

## Project Structure

This project follows the **MVC** (Model-View-Controller) pattern using Express.js. All backend API endpoints are structured for clarity, scalability, and separation of concerns.

backend/
  controllers _Define request handlers for each route (business logic)_
  middlewares _Custom middleware functions_
  models _Mongoose schemas or database models_
  routes _API route definitions and route-level middleware_
  utils/ _Utility functions_
  app.js _Main Express app configuration (middleware, routes, etc.)_
  server.js _Entry point: starts the server and connects to the database_

## API Endpoints

Public `GET` requests (e.g., blog articles, gallery media) are accessible without authentication.

Protected routes (`POST`, `PUT`, `DELETE`, etc.) will return `401` Unauthorized if the token is missing or invalid.

- `GET /articles` — Fetch paginated list of articles posts
- `POST /articles` — Post mata data of a articles post
- `GET /articles/slug/` — Fetch single article by slug
- `GET /images/thumbnails` — Retrieve gallery image's thumbnails
- `GET /images/slug/` — Fetch single image by slug
- `POST /images` — Post mata data of a image
- `GET /video` — Retrieve gallery videos
- `POST /video` — Post mata data of a video

## Database Schema (Mongoose)

```js
// Article Schema
{
  title.en/title.jp/title.zhHans: String,
  slug: String,
  contentUrl.en/contentUrl.jp/contentUrl.zhHans: String,
  categories: String,
  publishedAt: Date,
  visible: bollean,
  like: Number,
  likedByIPs: String Array
}

//Image Schema
{
  description:String,
  slug: String,
  imageUrl: String,
  thumbnailUrl: String,
  category: String,
  like: Number,
  likedByIPs: String Array
}

// Resume Schema
{
  contentUrl:String,
  language: String,
}

//Video Schema
{
  title: String,
  description:String,
  slug: String,
  videoUrl: String,
  thumbnailUrl: String,
  publishedDate: Date,
  like: Number,
  likedByIPs: String Array
}
```

## Cloudflare R2 Integration

This project uses **Cloudflare R2** as a remote object storage service for image and video hosting.

- Only **read access** is required. The backend **generates pre-signed URLs** to retrieve objects securely from the R2 bucket.
- Clients never directly access the bucket or see the R2 credentials.
- No file upload functionality is implemented on the server side.

Required environment variables:

```env
R2_ACCESS_KEY=your-access-key
R2_SECRET_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_REGION=auto
R2_PUBLIC_URL=https://<your-worker-subdomain>.r2.dev
```

## Deployment Instructions

```bash
git clone https://github.com/yourname/rayverse-backend
cd rayverse-backend
npm install
npm start
```
