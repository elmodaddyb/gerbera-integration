const {expect} = require('chai');
const {webServer, newRemoteDriver} = require('./test-utils');
const {audio} = require('./test-data');
let driver;

const LoginPage = require('./page/login.page');
const HomePage = require('./page/home.page');

describe('UI Suite', () => {
  let loginPage;
  let homePage;

  before(async () => {
    driver = await newRemoteDriver();
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
        const item = await homePage.getItemByText('crowd-cheering.mp3');
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
        expect(tree.length).to.equal(audio.navAudioTreeItems);
      });

      it('mp3 audio creates a container called `All - full name`', async () => {
        await homePage.clickTree('All - full name');
        const items = await homePage.items();
        expect(items.length).to.equal(audio.allFullNameItems);
      });

      it('mp3 audio is available by the full name', async () => {
        const item = await homePage.getItem(audio.firstItem);
        const text = await item.getText();
        expect(text).to.equal('- crowd-cheering.mp3');
      });

      it('mp3 audio creates a container called `All Audio`', async () => {
        await homePage.clickTree('All Audio');
        const items = await homePage.items();
        expect(items.length).to.equal(audio.allAudioItems);
      });

      it('mp3 audio is available by the title name', async () => {
        const item = await homePage.getItem(audio.firstItem);
        const text = await item.getText();
        expect(text).to.equal('crowd-cheering.mp3');
      });

      it('mp3 audio creates a container called `Artists` with containers by artists name', async () => {
        await homePage.clickTree('Artists');
        const artists = await homePage.getTreeItem('Artists');
        let tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.artistsItems);

        await homePage.expandBelow(artists, 'Unknown');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.unknownItems);

        const meArtist = await homePage.getTreeItem('Unknown');
        await homePage.expandBelow(meArtist, 'All Songs');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.allSongs);

        const item = await homePage.getItem(audio.firstItem);
        const text = await item.getText();
        expect(text).to.equal('crowd-cheering.mp3');
      });
    });

    describe('Gerbera Trail', () => {
      it('allows user to delete the tree item from the PC Directory', async () => {
        await homePage.clickMenu('nav-db');
        let tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.navDbTreeItems);

        await homePage.clickTree('PC Directory');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.pcDirectoryItems);

        await homePage.clickTree('gerbera-media');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.gerberaTreeItems);

        const items = await homePage.items();
        expect(items.length).to.equal(audio.gerberaMediaItems);

        await homePage.clickTrailDelete();
        await homePage.closeToast();
      });
    });
  });
});