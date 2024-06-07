Fullstack Scraper App
This repository contains a full stack scraping application created on 07-06-2024. The application is designed to scrape data from the Medium.com website using Puppeteer and provide API endpoints for handling user input and displaying scraped data on the frontend.

Files and Directory Structure
Backend
server.js:

This file contains API endpoints for handling POST requests from the frontend.
It processes user input and triggers scraping operations.
scraper.js:

This file houses the logic for scraping Medium.com using the Puppeteer npm package.
Key functions include:
startScraping(userInput): Generates Medium search URLs based on user input.
getDateTimeOfPublish(publishedDate): Formats published dates like "1 day ago", "1 month ago" to precise date and time.
Frontend
/frontend/src/components/Home/index.js:

This JSX file serves as the main component for the application's home page.
It handles user input, displays output articles, and manages pagination.
/frontend/src/components/Article/index.js:

This JSX file is responsible for rendering individual Article components.
Each Article component receives article information as props and renders it accordingly.
