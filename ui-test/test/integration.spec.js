const {expect} = require('chai');
const {Builder} = require('selenium-webdriver');
const {suite} = require('selenium-webdriver/testing');
let chrome = require('selenium-webdriver/chrome');
const webServer = process.env.GERBERA_BASE_URL;
let driver;

const LoginPage = require('./page/login.page');

suite(() => {
  let loginPage;

  before(async () => {
    console.log('Gerbera Web UI URL --> ' + webServer);
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments(['--headless', '--window-size=1280,1024']);
    driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
    loginPage = new LoginPage(driver);
  });

  after(() => driver && driver.quit());

  describe('The Gerbera UI', () => {

    beforeEach(async () => {
      await driver.get(webServer + '/disabled.html');
      await driver.manage().deleteAllCookies();
      await loginPage.get(webServer + '/index.html');
    });

    it('requires user name and password to submit the login form', async () => {
      await loginPage.password('gerbera');
      await loginPage.username('gerbera');
      await loginPage.submitLogin();
    });

  });
});
