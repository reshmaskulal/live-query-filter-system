# Live Query Filter System

A full-stack web application with live search, debounced API requests, multi-category filtering, and pagination.

## Features

- Live search
- Debounced search input
- Multiple category filtering
- REST API
- Pagination
- Responsive result cards
- Loading state

## API Endpoint

GET /api/items

## Query Parameters

- search
- category
- page
- limit

## Example

/api/items?search=laptop&page=1&limit=6

## Multiple Categories

/api/items?category=Electronics,Sports&page=1&limit=10

## Project Structure

live-query-filter-system/
- package.json
- package-lock.json
- server.js
- data.json
- README.md
- public/
  - index.html
  - style.css
  - script.js

## Technologies Used

- Node.js
- Express.js
- HTML5
- CSS3
- JavaScript
- REST API

## How to Run

Install dependencies:

npm install

Start the server:

npm start

Open:

http://localhost:3000
