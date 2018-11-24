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

  describe('Audio Integration Test', () => {

    it('gets the disabled page to clear cookies', async () => {
      await driver.get(webServer + '/disabled.html');
    });

    it('deletes all cookies for a fresh start', async () => {
      await driver.manage().deleteAllCookies();
    });

    it('loads the home page', async () => {
      await loginPage.get(webServer + '/index.html');
    });

    describe('Gerbera Audio', () => {
      it('is added from the filesystem view', async () => {
        await homePage.clickMenu('nav-fs');
        await homePage.clickTree('gerbera-media');
        const item = await homePage.getItem(0);
        await homePage.clickItemAdd(item);

        let result = await homePage.getToastMessage();
        expect(result).to.equal('Successfully added item');
        await homePage.closeToast();
      });
    });

    describe('Virtual Objects in Database view', () => {
      it('mp3 audio adds a virtual item found in the Audio folder', async () => {
        await homePage.clickMenu('nav-db');
        await homePage.clickTree('Audio');
        const tree = await homePage.treeItems();
        expect(tree.length).to.equal(10);
      });

      it('mp3 audio creates a container called `All - full name`', async () => {
        await homePage.clickTree('All - full name');
        const items = await homePage.items();
        expect(items.length).to.equal(1);
      });

      it('mp3 audio is available by the full name', async () => {
        const item = await homePage.getItem(0);
        const text = await item.getText();
        expect(text).to.equal('Me - Me - Test of MP3 File');
      });

      it('mp3 audio creates a container called `All Audio`', async () => {
        await homePage.clickTree('All Audio');
        const items = await homePage.items();
        expect(items.length).to.equal(1);
      });

      it('mp3 audio is available by the title name', async () => {
        const item = await homePage.getItem(0);
        const text = await item.getText();
        expect(text).to.equal('Test of MP3 File');
      });

      it('mp3 audio creates a container called `Artists` with containers by artists name', async () => {
        await homePage.clickTree('Artists');
        const artists = await homePage.getTreeItem('Artists');
        let tree = await homePage.treeItems();
        expect(tree.length).to.equal(11);

        await homePage.expandBelow(artists, 'Me');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(14);

        const meArtist = await homePage.getTreeItem('Me');
        await homePage.expandBelow(meArtist, 'All Songs');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(14);

        const item = await homePage.getItem(0);
        const text = await item.getText();
        expect(text).to.equal('Test of MP3 File');
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