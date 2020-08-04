// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const config = require('./config');

function d(s) { // Helper function for debugging
    (async () => {
        s();
    })
}

(async () => {

  const keyword = config.keyword;

  const browser = await puppeteer.launch({
      headless:true,
      devtools:true,
    });
  const page = await browser.newPage();
  Object.assign(global, {browser, page, d});
  await page.setViewport({ width: 1366, height: 768});
  await page.goto('https://moz.com/login', {waitUntil: 'load'});
  await page.type('input.forge-form-control:nth-child(2)', config.credentials.email);
  await page.type('input.forge-form-control:nth-child(3)', config.credentials.password);
  await page.keyboard.press('Enter');
  console.log("Finished entering credentials...");
  

  // await page.click('.forge-btn');
  await page.waitForNavigation();

  await page.goto('https://analytics.moz.com/pro/keyword-explorer/keyword/overview?locale=en-US');
  console.log("Starting process keyword results...");

  //Get how many queries are available...
  let element = await page.$('#app > div > div > div:nth-child(2) > div.omnisearch > span');
  let value = await page.evaluate(el => el.textContent, element);
  console.log(value);

  await page.type('#app > div > div > div:nth-child(2) > div.omnisearch > form > div > input', keyword);
  //Click dropdown
  await page.click('#app > div > div > div:nth-child(2) > div.omnisearch > form > div > div > div');
  //Choose Puerto Rico Spanish in dropdown (This could later be changed accordingly)
  await page.click('body > div.MuiPopover-root > div.MuiPaper-root.jss153.MuiPaper-elevation8.MuiPopover-paper > ul > li:nth-child(129) > span');
  //Click analyze to get moz results
  await page.click('#app > div > div > div:nth-child(2) > div.omnisearch > form > button > span')

  //Go to keyword suggestions results page and export results
  await page.goto('https://analytics.moz.com/pro/keyword-explorer/keyword/suggestions?locale=es-PR&q=' + keyword)
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: './moz_downloads/'
  });
  await page.waitForSelector('#app > div > div > div:nth-child(2) > div:nth-child(7) > span > div.table-upper > div > button');
  await page.click('#app > div > div > div:nth-child(2) > div:nth-child(7) > span > div.table-upper > div > button');
  console.log("Finished downloading keyword suggestions...");

  //Go to serp analysis results page and export results
  await page.goto('https://analytics.moz.com/pro/keyword-explorer/keyword/serp-analysis?locale=es-PR&q=' + keyword);
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: './moz_downloads/'
  });
  await page.waitForSelector('#app > div > div > div:nth-child(2) > div:nth-child(7) > span > div > button');
  await page.click('#app > div > div > div:nth-child(2) > div:nth-child(7) > span > div > button');
  console.log("Finished downloading SERP analysis...")

  console.log("Closing browser...");
  await browser.close();

})();