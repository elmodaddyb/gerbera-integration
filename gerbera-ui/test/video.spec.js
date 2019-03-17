const {expect} = require('chai');
const {webServer, newRemoteDriver} = require('./test-utils');
const {video} = require('./test-data');
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
        expect(tree.length).to.equal(video.navDbVideoTreeItems);
      });

      it('mp4 video creates a container called `All Video`', async () => {
        await homePage.clickTree('All Video');
        const items = await homePage.items();
        expect(items.length).to.equal(video.allVideoItems);
      });

      it('mp4 video is available by the file name', async () => {
        const item = await homePage.getItem(video.firstItem);
        const text = await item.getText();
        expect(text).to.equal('big_buck_bunny_720p_1mb.mp4');
      });

      it('mp4 video creates a container matching the `Directories`', async () => {
        await homePage.clickTree('Directories');
        const directories = await homePage.getTreeItem('Directories');
        let tree = await homePage.treeItems();
        expect(tree.length).to.equal(video.videoDirectories);

        await homePage.expandBelow(directories, 'gerbera-media');
        const item = await homePage.getItem(video.firstItem);
        const text = await item.getText();
        expect(text).to.equal('big_buck_bunny_720p_1mb.mp4');
      });
    });

    describe('Gerbera Trail', () => {
      it('allows user to delete the tree item from the PC Directory', async () => {
        await homePage.clickMenu('nav-db');
        let tree = await homePage.treeItems();
        expect(tree.length).to.equal(video.trailDbItems);

        await homePage.clickTree('PC Directory');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(video.trailPcDirectoryTreeItems);

        await homePage.clickTree('gerbera-media');
        tree = await homePage.treeItems();
        expect(tree.length).to.equal(video.trailGerberaMediaTreeItems);

        const items = await homePage.items();
        expect(items.length).to.equal(video.trailGerberaMediaItems);

        await homePage.clickTrailDelete();
        await homePage.closeToast();
      });
    });
  });
});