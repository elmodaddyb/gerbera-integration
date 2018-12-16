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

  describe('Basic Integration Test', () => {

    it('gets the disabled page to clear cookies', async () => {
      await driver.get(webServer + '/disabled.html');
    });

    it('deletes all cookies for a fresh start', async () => {
      await driver.manage().deleteAllCookies();
    });

    it('loads the home page', async () => {
      await loginPage.get(webServer + '/index.html');
    });

    describe('Gerbera Menu', () => {
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

      it('loads file system and all child directories', async () => {
        await homePage.clickMenu('nav-fs');
        const tree = await homePage.treeItems();
        expect(tree.length).to.equal(23);
      });
    });

    describe('Gerbera Tree & Items', () => {
      it('when clicking gerbera-media, contains the content downloaded', async () => {
        await homePage.clickTree('gerbera-media');
        const item = await homePage.getItemByText('crowd-cheering.mp3');
        const result = await homePage.hasAddIcon(item);
        expect(result).to.be.true;
      });

      it('adds the media when click of add in items list', async () => {
        await homePage.clickTree('gerbera-media');
        const item = await homePage.getItemByText('crowd-cheering.mp3');
        await homePage.clickItemAdd(item);

        let result = await homePage.getToastMessage();
        expect(result).to.equal('Successfully added item');
        await homePage.closeToast();
      });

      it('newly added content shows in the PC Directory', async () => {
        await homePage.clickMenu('nav-db');
        await homePage.clickTree('PC Directory');
        const tree = await homePage.treeItems();
        expect(tree.length).to.equal(4);
        await homePage.clickTree('gerbera-media');
        const items = await homePage.items();
        expect(items.length).to.equal(1);
      });

      it('when clicked shows the items added', async () => {
        await homePage.clickTree('gerbera-media');
        const items = await homePage.items();
        expect(items.length).to.equal(1);
      });
    });

    describe('Gerbera Edit Overlay', () => {
      it('opens overlay when clicking item edit', async () => {
        await homePage.editItem(0);
        const isDisplayed = await homePage.editOverlayDisplayed();
        expect(isDisplayed).to.be.true;
      });

      it('overlay fields populated with MP3 information', async () => {
        let value = await homePage.editOverlayFieldValue('editObjectType');
        expect(value).to.equal('item');

        value = await homePage.editOverlayFieldValue('editLocation');
        expect(value).to.equal('/gerbera-media/crowd-cheering.mp3');

        value = await homePage.editOverlayFieldValue('editClass');
        expect(value).to.equal('object.item.audioItem.musicTrack');

        value = await homePage.editOverlayFieldValue('editMime');
        expect(value).to.equal('audio/mpeg');
      });

      it('allows the user to save the description field', async () => {
        await homePage.setEditorOverlayField('editDesc', 'A Description');
        await homePage.submitEditor();
      });

      it('and the value saves to the gerbera database and can be seen on subsequent edit', async () => {
        await homePage.editItem(0);

        let value = await homePage.editOverlayFieldValue('editDesc');
        expect(value).to.equal('A Description');
        await homePage.cancelEdit();

        const isDisplayed = await homePage.editOverlayDisplayed();
        expect(isDisplayed).to.be.false;
      });
    });

    describe('Gerbera Trail', () => {
      it('allows user to delete the tree item from the PC Directory', async () => {
        await homePage.clickTrailDelete();
        let result = await homePage.getToastMessage();
        expect(result).to.equal('Successfully removed item');
        await homePage.closeToast();
      });
    });
  });
});
