const {expect} = require('chai');
const {webServer, loadTestData, newRemoteDriver} = require('./utils/test-utils');
let driver;

const HomePage = require('./page/home.page');

describe('UI Suite @Simple', () => {
  let homePage;
  let testData;

  before(async () => {
    driver = await newRemoteDriver();
    homePage = new HomePage(driver);
    testData = loadTestData('video');
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

    describe('Gerbera Video', () => {
      it('is added from the filesystem view', async () => {
        await homePage.clickMenu('nav-fs');
        await homePage.clickTree('gerbera-media');
        const item = await homePage.getItemByText('big_buck_bunny_720p_1mb.mp4');
        await homePage.clickItemAdd(item);

        let result = await homePage.waitForToastMessage('Successfully added item', 2000);
        expect(result).to.equal('Successfully added item');
        await homePage.closeToast();
      });
    });

    describe('Virtual Objects in Database view', () => {
      let directories;

      it('mp4 video adds a virtual item found in the Video folder', async () => {
        await homePage.clickMenu('nav-db');
        await homePage.clickTree('Video');
        const tree = await homePage.treeItems();
        expect(tree.length).to.equal(testData.navDbVideoTreeItems);
      });
      it('mp4 video creates a container called `All Video`', async () => {
        await homePage.clickTree('All Video');
        const items = await homePage.items();
        expect(items.length).to.equal(testData.allVideoItems);
      });
      it('mp4 video is available by the file name', async () => {
        const item = await homePage.getItem(testData.firstItem);
        const text = await item.getText();
        expect(text).to.equal('big_buck_bunny_720p_1mb.mp4');
      });
      it('mp4 video creates a container matching the `Directories`', async () => {
        await homePage.clickTree('Directories');
        directories = await homePage.getTreeItem('Directories');
        let tree = await homePage.treeItems();
        expect(tree.length).to.equal(testData.videoDirectories);
      });
      it('contains a container matching `gerbera-media`', async () => {
        await homePage.expandBelow(directories, 'gerbera-media');
        const item = await homePage.getItem(testData.firstItem);
        const text = await item.getText();
        expect(text).to.equal('big_buck_bunny_720p_1mb.mp4');
      });
    });

    describe('Gerbera Trail', () => {
      let tree;
      it('loads the database menu', async () => {
        await homePage.clickMenu('nav-db');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(testData.trailDbItems);
      });
      it('loads the PC Directory when clicked', async () => {
        await homePage.clickTree('PC Directory');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(testData.trailPcDirectoryTreeItems);
      });
      it('loads the gerbera-media when clicked', async () => {
        await homePage.clickTree('gerbera-media');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(testData.trailGerberaMediaTreeItems);
      });
      it('loads the gerbera-media items', async () => {
        const items = await homePage.items();
        expect(items.length).to.equal(testData.trailGerberaMediaItems);
      });
      it('deletes the item from the trail', async () => {
        await homePage.clickTrailDelete();
        await homePage.closeToast();
      });
    });
  });
});