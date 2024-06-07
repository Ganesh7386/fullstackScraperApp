# fullstackScraperApp
created on 07-06-2024 for pushing full stack scraping application

-> /server.js   
      This file has API's related to POST request to get details what user has given as input from frontend side
-> /scraper.js 
      This file has Logic of Scraping of Medium.com website using puppeteer npm package
-> /scraper.js
  Major Functions :
      startScraping -> is a function which takes userInput text as argument , append it to "https://medium.com/search/q={userInput}
      getDateTimeOfPublish -> is a function which takes the published dates like "1 day ago" , "1 month ago" according to texts like "day" or "month" , date and time is formatted from present day to previous ago                                   dates
-> "/frontend/src/components/Home/index.js" is jsx file for serving component related to taking input , showing output articles and also for pagination
-> "/frontend/src/components/Article/index.js" is jsx file for rendering each Article component which takes each article information as props and renders the taken information thorugh props.
