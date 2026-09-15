# Blog API

A RESTful Blog API built with **Express**, **MongoDB (Atlas)**, and **Mongoose**, with **Joi** validation, pagination, and keyword search. Follows separation of concerns: routes -> controllers -> models, plus middleware.

## Features

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/articles` | Create an article |
| GET | `/api/articles?page=1&limit=10&sort=latest` | Get all articles (paginated) |
| GET | `/api/articles/search?q=keyword` | Search articles by keyword |
| GET | `/api/articles/:id` | Get one article |
| PUT | `/api/articles/:id` | Update an article (partial allowed) |
| DELETE | `/api/articles/:id` | Delete an article |

## Schema (creative — beyond the basics)

- `title` (required, 5–120 chars)
- `subheading` (optional)
- `content` (required, min 20 chars)
- `author` (default: "Guest")
- `category` (default: "General")
- `tags` (array of strings)
- `isPublished` (boolean, default false)
- `readMinutes` (auto-computed from content length)
- `likes` (number)
- `comments` (embedded array: author + content, with timestamps)
- `createdAt` / `updatedAt` (auto timestamps)

## Local setup

```bash
npm install
cp .env.example .env        # then paste your Atlas MONGO_URI
npm run dev
```

## Testing with Postman / Thunder Client

Create:
```
POST http://localhost:5000/api/articles
Body (JSON):
{
  "title": "Backend Weekly",
  "subheading": "Week 9 recap",
  "content": "This week we connected our Express API to MongoDB Atlas.",
  "author": "Michael",
  "category": "Tech",
  "tags": ["nodejs", "mongodb"],
  "isPublished": true
}
```

Try these edge cases:
- Missing title -> `400`
- Title shorter than 5 chars -> `400`
- Invalid ObjectId in URL -> `400`
- Update a non-existent ID -> `404`

Pagination & search:
```
GET http://localhost:5000/api/articles?page=2&limit=2
GET http://localhost:5000/api/articles/search?q=backend
```

## Deploy to Render

1. Push this folder to a GitHub repo.
2. On [Render](https://render.com): **New +** -> **Web Service** -> connect the repo.
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. In **Environment**, add:
   - `MONGO_URI` = your Atlas connection string (whitelist Render IPs: `0.0.0.0/0` in Atlas -> Network Access)
   - `PORT` = `5000` (Render also injects its own; the code falls back to 5000)
5. Deploy and copy the live URL (e.g. `https://blog-api-xxxx.onrender.com`).

## Project structure

```
blog-api/
├── index.js
├── config/
│   └── db.js
├── models/
│   └── article.model.js
├── controllers/
│   └── article.controller.js
├── routes/
│   └── article.route.js
├── middleware/
│   ├── logger.js
│   └── errorHandler.js
├── .env.example
├── .gitignore
└── package.json
```
