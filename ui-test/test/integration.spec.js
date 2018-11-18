const {expect} = require('chai');
const {Builder} = require('selenium-webdriver');
const {suite} = require('selenium-webdriver/testing');
let chrome = require('selenium-webdriver/chrome');
const webServer = 'http://' + process.env.npm_package_config_webserver_host + ':' + process.env.npm_package_config_webserver_port;
let driver;

const LoginPage = require('./page/login.page');

suite(() => {
  let loginPage;

  before(async () => {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments(['--window-size=1280,1024']);
    driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
    loginPage = new LoginPage(driver);
  });

  after(() => driver && driver.quit());

  describe('The login action', () => {

    beforeEach(async () => {
      await driver.get(webServer + '/disabled.html');
      await driver.manage().deleteAllCookies();
      await loginPage.get(webServer + '/index.html');
    });

    it('hides the login form when no authentication is required', async () => {
      const fields = await loginPage.loginFields();
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const style = await field.getAttribute('style');
        expect(style).to.equal('display: none;');
      }
    });

  });
});
