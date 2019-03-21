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

  describe('Loading Gerbera UI', () => {
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

  describe('Streaming Playlists Tree', () => {
    let tree;

    it('shows Playlists in the Database view', async () => {
      await homePage.clickMenu('nav-db');
      await homePage.clickTree('Playlists');
      tree = await homePage.treeItems();
      expect(tree.length).to.equal(testData.navPlaylistTree);
    });
    it('shows Radio Playlists in the Database view', async () => {
      const playlists = await homePage.getTreeItem('Playlists');
      await homePage.expandBelow(playlists, 'Radio Playlists');
      tree = await homePage.treeItems();
      expect(tree.length).to.equal(testData.navRadioPlaylistTree);
    });
  });
  describe('Classic Rock Playlist items', () => {
    it('shows playlist item name parsed as items', async () => {
      await homePage.clickTree('Classic Rock 109');
      const totalItems = await homePage.items();
      expect(totalItems.length).to.equal(testData.classicRockItems);
    });
    it('shows playlist item name parsed as items', async () => {
      const item = await homePage.getItem(testData.firstItem);
      const text = await item.getText();
      expect(text).to.match(/\(.*\)\sClassic\sRock\s109/);
    });
    it('each playlist item references an external url', async () => {
      const item = await homePage.getItemLink(testData.firstItem);
      const href = await item.getAttribute('href');
      expect(href).to.match(/http:\/\/.*\/stream/);
    });
  });
  describe('Dance Wave Playlist items', () => {
    it('shows playlist item name parsed as items', async () => {
      await homePage.clickTree('Dance Wave!');
      const totalItems = await homePage.items();
      expect(totalItems.length).to.equal(testData.danceWaveItems);
    });
    it('shows playlist item name parsed as items', async () => {
      const item = await homePage.getItem(testData.firstItem);
      const text = await item.getText();
      expect(text).to.equal('Dance Wave!');
    });
    it('each playlist item references an external url', async () => {
      const item = await homePage.getItemLink(testData.firstItem);
      const href = await item.getAttribute('href');
      expect(href).to.match(/http:\/\/.*\/dance.mp3/);
    });
  });
  describe('SmoothLounge.com Global Playlist items', () => {
    it('shows playlist item name parsed as items', async () => {
      await homePage.clickTree('SmoothLounge.com Global');
      const totalItems = await homePage.items();
      expect(totalItems.length).to.equal(testData.smoothLoungeItems);
    });
    it('shows playlist item name parsed as items', async () => {
      const item = await homePage.getItem(testData.firstItem);
      const text = await item.getText();
      expect(text).to.match(/\(.*\)\sSmoothLounge.com\sGlobal/);
    });
    it('each playlist item references an external url', async () => {
      const item = await homePage.getItemLink(testData.firstItem);
      const href = await item.getAttribute('href');
      expect(href).to.match(/http:\/\/.*\/stream/);
    });
  });
});