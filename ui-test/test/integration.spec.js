const {expect} = require('chai');
const {Builder} = require('selenium-webdriver');
const {suite} = require('selenium-webdriver/testing');
let chrome = require('selenium-webdriver/chrome');
const webServer = process.env.GERBERA_BASE_URL;
let driver;

const LoginPage = require('./page/login.page');
const HomePage = require('./page/home.page');

suite(() => {
  let loginPage, homePage;

  before(async () => {
    console.log('Gerbera Web UI URL --> ' + webServer);
    driver = new Builder()
      .forBrowser('chrome')
      .usingServer('http://' + process.env.HUB_HOST + ':' + process.env.HUB_PORT + '/wd/hub')
      .build();
    loginPage = new LoginPage(driver);
    homePage = new HomePage(driver);
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

    it('enables the database and filetype menus upon login', async () => {
      let menu = await homePage.getDatabaseMenu();
      let menuClass = await menu.getAttribute('class');
      expect(menuClass).to.equal('nav-link');

      menu = await homePage.getFileSystemMenu();
      menuClass = await menu.getAttribute('class');
      expect(menuClass).to.equal('nav-link');
    });

    it('loads the parent database container and PC Directory when clicking Database', async () => {
      await homePage.clickMenu('nav-db');
      const tree = await homePage.treeItems();
      expect(tree.length).to.equal(2);
    });

  });
});
