const {expect} = require('chai');
const {Builder} = require('selenium-webdriver');
const {suite} = require('selenium-webdriver/testing');
const webServer = process.env.GERBERA_BASE_URL;
const seleniumHub = `http://${process.env.HUB_HOST}:${process.env.HUB_PORT}/wd/hub`;
let driver;

const LoginPage = require('./page/login.page');
const HomePage = require('./page/home.page');

suite(() => {
  let loginPage, homePage;

  before(async () => {
    console.log(`\n\tGerbera Web UI URL --> ${webServer}`);
    console.log(`\tSelenium Hub URL   --> ${seleniumHub}\n`);
    driver = new Builder().usingServer(seleniumHub).build();
    loginPage = new LoginPage(driver);
    homePage = new HomePage(driver);
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
      await loginPage.get(webServer + '/index.html');
    });

    describe('Gerbera Video', () => {
      it('is added from the filesystem view', async () => {
        await homePage.clickMenu('nav-fs');
        await homePage.clickTree('gerbera-media');
        const item = await homePage.getItemByText('big_buck_bunny_720p_1mb.mp4');
        await homePage.clickItemAdd(item);

        let result = await homePage.getToastMessage();
        expect(result).to.equal('Successfully added item');
        await homePage.closeToast();
      });
    });

    describe('Virtual Objects in Database view', () => {
      it('mp4 video adds a virtual item found in the Video folder', async () => {
        await homePage.clickMenu('nav-db');
        await homePage.clickTree('Video');
        const tree = await homePage.treeItems();
        expect(tree.length).to.equal(5);
      });

      it('mp4 video creates a container called `All Video`', async () => {
        await homePage.clickTree('All Video');
        const items = await homePage.items();
        expect(items.length).to.equal(1);
      });

      it('mp4 video is available by the file name', async () => {
        const item = await homePage.getItem(0);
        const text = await item.getText();
        expect(text).to.equal('big_buck_bunny_720p_1mb.mp4');
      });

      it('mp4 video creates a container matching the `Directories`', async () => {
        await homePage.clickTree('Directories');
        const directories = await homePage.getTreeItem('Directories');
        let tree = await homePage.treeItems();
        expect(tree.length).to.equal(6);

        await homePage.expandBelow(directories, 'gerbera-media');
        const item = await homePage.getItem(0);
        const text = await item.getText();
        expect(text).to.equal('big_buck_bunny_720p_1mb.mp4');
      });
    });

    describe('Gerbera Trail', () => {
      it('allows user to delete the tree item from the PC Directory', async () => {
        await homePage.clickMenu('nav-db');
        let tree = await homePage.treeItems();
        expect(tree.length).to.equal(3);

        await homePage.clickTree('PC Directory');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(4);

        await homePage.clickTree('gerbera-media');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(4);

        const items = await homePage.items();
        expect(items.length).to.equal(1);

        await homePage.clickTrailDelete();
        await homePage.closeToast();
      });
    });
  });
});