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
    driver = new Builder()
      .forBrowser('chrome')
      .usingServer('http://' + process.env.HUB_HOST + ':' + process.env.HUB_PORT + '/wd/hub')
      .build();
    loginPage = new LoginPage(driver);
  });

  after(() => driver && driver.quit());

  describe('The Gerbera UI', () => {

    it('gets the disabled page to clear cookies', async () => {
      await driver.get(webServer + '/disabled.html');
    });

    it('deletes all cookies for a fresh start', async () => {
      await driver.manage().deleteAllCookies();
    });

    it('loads the home page', async () => {
      await loginPage.get(webServer + '/index.html');
    });

    it('requires user name and password to submit the login form', async () => {
      await loginPage.password('gerbera');
      await loginPage.username('gerbera');
      await loginPage.submitLogin();
    });

  });
});
