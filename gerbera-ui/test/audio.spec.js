const {expect} = require('chai');
const {webServer, newRemoteDriver} = require('./utils/test-utils');
const {audio} = require('./utils/test-data');
let driver;

const HomePage = require('./page/home.page');

describe('UI Suite', () => {
  let homePage;

  before(async () => {
    driver = await newRemoteDriver();
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
      await homePage.get(webServer + '/index.html');
    });

    describe('Gerbera Audio', () => {
      it('is added from the filesystem view', async () => {
        await homePage.clickMenu('nav-fs');
        await homePage.clickTree('gerbera-media');
        const item = await homePage.getItemByText('crowd-cheering.mp3');
        await homePage.clickItemAdd(item);

        let result = await homePage.waitForToastMessage('Successfully added item', 2000);
        expect(result).to.equal('Successfully added item');
        await homePage.closeToast();
      });
    });

    describe('Virtual Objects in Database view', () => {
      let tree;
      let artists;

      it('mp3 audio adds a virtual item found in the Audio folder', async () => {
        await homePage.clickMenu('nav-db');
        await homePage.clickTree('Audio');
        tree = await homePage.treeItems();
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
      it('mp3 audio creates a container called `Artists`', async () => {
        await homePage.clickTree('Artists');
        artists = await homePage.getTreeItem('Artists');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.artistsItems);
      });
      it('contains an `Unknown` category', async () => {
        await homePage.expandBelow(artists, 'Unknown');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.unknownItems);
      });
      it('contains `All Songs` under `Unknown` category', async () => {
        const unknownArtist = await homePage.getTreeItem('Unknown');
        await homePage.expandBelow(unknownArtist, 'All Songs');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.allSongs);
      });
      it('lists the item in the items view by proper text name', async () => {
        const item = await homePage.getItem(audio.firstItem);
        const text = await item.getText();
        expect(text).to.equal('crowd-cheering.mp3');
      });
    });

    describe('Gerbera Trail', () => {
      let tree;
      it('loads database view', async () => {
        await homePage.clickMenu('nav-db');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.navDbTreeItems);
      });
      it('loads the PC Directory items', async () => {
        await homePage.clickTree('PC Directory');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.pcDirectoryItems);
      });
      it('loads the gerbera-media items under PC Directory', async () => {
        await homePage.clickTree('gerbera-media');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(audio.gerberaTreeItems);
      });
      it('shows gerbera-media items in items view', async () => {
        const items = await homePage.items();
        expect(items.length).to.equal(audio.gerberaMediaItems);
      });
      it('allows user to delete the tree item using trail', async () => {
        await homePage.clickTrailDelete();
        await homePage.closeToast();
      });
    });
  });
});