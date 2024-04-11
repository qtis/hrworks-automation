const puppeteer = require('puppeteer');


if (!process.env.HRWORKS_USERNAME || !process.env.HRWORKS_PASS) {
    console.log('Env variables not set');
    process.exit(1);
}

function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        args: [`--window-size=1920,1080`],
        defaultViewport: {
            width:1080,
            height:1920
        }
    })
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);

    console.log('Navigating to hrworks login page');
    await page.goto('https://login.hrworks.de/?redirect=q%2Ftime-management%2Fworking-times', {
        waitUntil: 'networkidle0'
    });

    console.log('Logging in...');

    await page.waitForSelector('input[name="company"]');
    await page.waitForSelector('input[name="login"]');
    await page.waitForSelector('input[type="password"]');

    await page.evaluate(() => document.querySelector('input[name="company"]').value = 'cid');
    await page.evaluate((username) => (document.querySelector('input[name="login"]').value = username), process.env.HRWORKS_USERNAME);
    await page.evaluate((password) => (document.querySelector('input[type="password"]').value = password), process.env.HRWORKS_PASS);

    await page.click('button[type="button"]');

    console.log('Clicked LogIn, Waiting for working time page to load...');

    await page.waitForSelector('.m-accordion__item-body.show .hrw-me-working-time-day-header-row a:not([disabled]) .icon-streamline-add');

    console.log('Working time page to loaded, filling time log');

    await delay(5000);
    await page.waitForNetworkIdle();
    
    await page.evaluate(() => {
      document.querySelector('.m-accordion__item-body.show .hrw-me-working-time-day-header-row a:not([disabled]) .icon-streamline-add').click();
    });

    await page.waitForSelector('.m-accordion__item-body.show .hrw-me-object-holder-without-separator-line>.row:not(.bs-hide) input');

    await page.evaluate(() => document.querySelectorAll('.m-accordion__item-body.show .hrw-me-object-holder-without-separator-line>.row:not(.bs-hide) input')[0].value = '09:00');
    await page.evaluate(() => document.querySelectorAll('.m-accordion__item-body.show .hrw-me-object-holder-without-separator-line>.row:not(.bs-hide) input')[1].value = '17:30');
   
    await delay(5000); // For previous toast to disappear

    console.log('Clicking save');

    await page.click('button.hrw-me-primary-btn');

    // ENABLE TWO DIALOG STEPS IF YOUR LOGGED TIME OUTSIDE OF WORKING HOURS
    // 
    // await page.waitForSelector('.modal-dialog button');
    // await page.click('.modal-dialog button');

    await page.waitForSelector('#toast-container .toast-success');

    console.log('Done! log successfull');
    await browser.close();;

})();