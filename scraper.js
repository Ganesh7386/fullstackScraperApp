const puppeteer = require("puppeteer")
const {v4 : uuidv4} = require("uuid"); 


function getDateTimeOfPublish(datetimeString) {
    let parts = datetimeString.split(" ");
    let unit = parts[1];
    let nums = parseInt(parts[0]);
    
    let presentDateTime = new Date();

    switch(unit) {
        case 'days':
        case 'day':
            const daysToSubtract = nums;
            //console.log("It is day");
            presentDateTime.setDate(presentDateTime.getDate() - daysToSubtract);
            break;
        case 'hours':
        case 'hour':
            const hoursToSubtract = nums;
            //console.log("It is hours");
            presentDateTime.setHours(presentDateTime.getHours() - hoursToSubtract);
            break;
        case 'months':
        case 'month' :
            const monthsToSubtract = nums;
            //console.log("it is month")
            presentDateTime.setMonth(presentDateTime.getMonth()-monthsToSubtract);
        default:
            console.log("Modified");
    }
    //console.log('Date and Time after modification:', presentDateTime);
    const day = presentDateTime.getDate();
    const month = presentDateTime.getMonth();
    const year  = presentDateTime.getFullYear();
    const hours = presentDateTime.getHours();
    const minutes = presentDateTime.getMinutes();
    const seconds = presentDateTime.getMinutes()
    const formattedDateTime = `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
    // console.log(formattedDateTime)

    return formattedDateTime;
}


const startScraping = async (searchValue)=> {
    const browser = await puppeteer.launch();
    // console.log(browser)
    console.log("browser launched")
    const page = await browser.newPage();
    await page.goto(`https://medium.com/search?q=${searchValue}`);
    let scrapedDataList = []

    try {
        /* allArticleElements variable stores multiple all div ontainers with tag name as article
            async page.$$() retrieves all article tags
        */
        const allArticleElements = await page.$$('article');
        for(let eachArticle of allArticleElements) {
            let eachArticleInfoObj = {}
            /*
                async eachArticle.$() retireves pragraph element
                page.evaluate() is for extracting text Content present in Paragraph element
            */
            const authorName = await eachArticle.$('p')
            const authorNameText = await page.evaluate(el => el.textContent , authorName)

            /*
                async eachArticle.$() retireves h2 element
                async page.evaluate() is for extracting text Content present in h2 element
            */
            
            const highlightText = await eachArticle.$('h2')
            const highlightTextContent = await page.evaluate(el=>el.textContent , highlightText)
            
            /*
                await eachArticle.$() retrieves img element which has profile image url of each author in an article
                await profileImgElement.evaluateHandle() takes callback and returns src attribute value in form of jsHandle object
                with the use of jsonValue() method , extracts reference value which was stored in src

            */
            const  profileImgElement= await eachArticle.$("img");
            const imageUrl = await profileImgElement.evaluateHandle(img => img.getAttribute('src'));
            const extractedProfileImgUrl = await imageUrl.jsonValue();
            
            /*
                I have used child tag selectors to navigate to the element , where published date is stored
                due to usage of this much hierarchy tracing , some times it fails and returns error , but retrying again from forntend side , it could get results
            */
            const mainCont = await eachArticle.$("div > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a > span > div");
            const mainContSelector = "div > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a > span > div";
            await page.waitForSelector(mainContSelector);
            // waitForSelector is used to make control to wait untill document element is getting loaded

            const delayText = await mainCont.getProperty('innerText')
            const text = await delayText.jsonValue();
            // text is a jsHandle object , which stored two values like "2min read" and "2 day ago" for each artcle element
            const parts = text.split('\n').map(part => part.trim());
            // console.log(parts)
            const filteredList = parts.filter((eachText)=>(!eachText.includes(".")))
            const postedAgo = filteredList[filteredList.length - 1];
            const calculatedPostedDate = getDateTimeOfPublish(postedAgo)


            // const dayAgoPart = parts.find(part => part.includes('day ago'));

            // below await eachArticle.$('div[data-href]') is used for getting container which has dats-href attribute to get navigation links to actual website
            const divElement = await eachArticle.$('div[data-href]');
            const dataHrefValue = await divElement.evaluateHandle(div => div.getAttribute('data-href'));
            const linkValue = await dataHrefValue.jsonValue();

            // all vallues like authorName , title , publicationDate , navigationLinks , profile imageurls of author are stores in an object
            eachArticleInfoObj = {"id" : uuidv4() ,"authorName" : authorNameText , "title" : highlightTextContent , "publicationDate" : calculatedPostedDate , "navigationLink" : linkValue , "profileImgUrl" : extractedProfileImgUrl};
            console.log(eachArticleInfoObj)
            scrapedDataList.push(eachArticleInfoObj)

        }
        // console.log("getting authors");
    }
    catch(e) {
        console.log(e.message)
        return {ok : false , scrapedDataList}
    }


    // here , if the above statements make any failures , then the below object is sent as return value which is used in serv side
    await browser.close();
    if(scrapedDataList.length === 0) {
        return {ok : false , scrapedDataList}
    }
    return {ok : true , scrapedDataList}
}


/*
// obtainedScrapedDataList = startScraping("machine learning")
// console.log(obtainedScrapedDataList)


// getDateTimeOfPublish("1 day ago");
// getDateTimeOfPublish("3 hours ago");
// getDateTimeOfPublish("3 months ago");

*/

module.exports = {startScraping}
// startScraping function is exported

