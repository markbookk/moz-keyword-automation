const puppeteer = require('puppeteer');


function d(s) { //Debug function for console
    (async () => {
        s();
    })
}

(async () => {

  keyword = "fashion";

  const browser = await puppeteer.launch({
      headless:false,
      devtools:true,
    });
  const page = await browser.newPage();
  Object.assign(global, {browser, page, d});
  await page.setViewport({ width: 1366, height: 768});
  await page.goto('https://moz.com/login');
  await page.type('input.forge-form-control:nth-child(2)', 'ttestasa@yandex.com');
  await page.type('input.forge-form-control:nth-child(3)', 'ttestasa123');
  

  await page.click('.forge-btn');

  await page.waitForNavigation();

  await page.goto('https://analytics.moz.com/pro/keyword-explorer/keyword/overview?locale=en-US');
  await page.type('#app > div > div > div:nth-child(2) > div.omnisearch > form > div > input', keyword);
  //Click dropdown
  await page.click('#app > div > div > div:nth-child(2) > div.omnisearch > form > div > div > div');
  //Choose Puerto Rico Spanish in dropdown (This could later be changed accordingly)
  await page.click('body > div.MuiPopover-root > div.MuiPaper-root.jss153.MuiPaper-elevation8.MuiPopover-paper > ul > li:nth-child(129) > span');
  //Click analyze to get moz results
  await page.click('#app > div > div > div:nth-child(2) > div.omnisearch > form > button > span')

  //Go to keyword analysis results page and export results
  await page.goto('https://analytics.moz.com/pro/keyword-explorer/keyword/suggestions?locale=es-PR&q=' + keyword)
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: './'
  });
  await page.waitForSelector('#app > div > div > div:nth-child(2) > div:nth-child(7) > span > div.table-upper > div > button');
  await page.click('#app > div > div > div:nth-child(2) > div:nth-child(7) > span > div.table-upper > div > button');

  //Go to keyword analysis results page and export results
  await page.goto('https://analytics.moz.com/pro/keyword-explorer/keyword/serp-analysis?locale=es-PR&q=' + keyword);
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: './'
  });
  await page.waitForSelector('#app > div > div > div:nth-child(2) > div:nth-child(7) > span > div > button');
  await page.click('#app > div > div > div:nth-child(2) > div:nth-child(7) > span > div > button');

//   await browser.close()
})();