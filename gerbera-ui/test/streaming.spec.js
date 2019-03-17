const {expect} = require('chai');
const {webServer, loadTestData, newRemoteDriver} = require('./utils/test-utils');
let driver;

const HomePage = require('./page/home.page');

describe('UI Suite @Streaming', () => {
  let homePage;
  let testData;

  before(async () => {
    driver = await newRemoteDriver();
    homePage = new HomePage(driver);
    testData = loadTestData('streaming');
  });

  after(() => driver && driver.quit());

  describe('Video Integration Test', () => {
    it('gets the disabled page to clear cookies', async () => {
      await driver.get(webServer + '/disabled.html');
    });
    it('deletes all cookies for a fresh start', async () => {
      await driver.manage().deleteAllCookies();
    });
    it('loads the home page', async () => {
      await homePage.get(webServer + '/index.html');
    });
  });
});