const {By, until} = require('selenium-webdriver');

module.exports = function (driver) {

  this.get = async (url) => {
    await driver.get(url);
    try {
      // when reloading session, errorCheck refreshes via JS here....check for staleness first
      await driver.wait(until.stalenessOf(driver.findElement(By.id('navbarContent'))), 2000);
    } catch (e) {
      // the default `page is ready` check...
      await driver.wait(until.elementIsVisible(driver.findElement(By.id('nav-home'))), 5000);
    }
    await driver.executeScript('$(\'body\').toggleClass(\'notransition\');');
    return await driver.wait(until.elementIsVisible(driver.findElement(By.id('navbarContent'))), 2000);
  };

  this.getDatabaseMenu = async () => {
    return await driver.findElement(By.id('nav-db'));
  };

  this.getFileSystemMenu = async () => {
    return await driver.findElement(By.id('nav-fs'));
  };

  this.clickMenu = async (menuId) => {
    const tree = await driver.findElement(By.id('tree'));
    if (menuId === 'nav-home') {
      return await driver.findElement(By.id(menuId)).click()
    } else {
      await driver.findElement(By.id(menuId)).click();
      return await driver.wait(until.elementIsVisible(tree), 5000)
    }
  };

  this.items = async () => {
    await driver.wait(until.elementLocated(By.id('datagrid')), 1000);
    return await driver.findElements(By.className('grb-item'));
  };

  this.treeItems = async () => {
    return await driver.findElements(By.css('#tree li'));
  };

  this.clickTree = async (text) => {
    const elem = await driver.findElement(By.xpath('//span[contains(text(),\'' + text + '\')]'));
    await driver.wait(until.elementIsVisible(elem), 5000);
    await elem.click();
    return await driver.sleep(500); // todo use wait...
  };

  this.getTreeItem = async (text) => {
    return await driver.findElement(By.xpath('//span[contains(text(),\'' + text + '\')]'));
  };

  this.expandBelow = async (treeItem, text) => {
    const elem = await treeItem.findElement(By.xpath('//span[contains(text(),\'' + text + '\')]'));
    await driver.wait(until.elementIsVisible(elem), 5000);
    await elem.click();
    return await driver.sleep(500); // todo use wait...
  };

  this.getItem = async (idx) => {
    await driver.wait(until.elementLocated(By.id('datagrid'), 5000));
    const items = await driver.findElements(By.className('grb-item'));
    return items[idx];
  };

  this.getItemLink = async (idx) => {
    await driver.wait(until.elementLocated(By.id('datagrid'), 5000));
    const items = await driver.findElements(By.className('grb-item-url'));
    return items[idx];
  };

  this.getItemByText = async (text) => {
    await driver.wait(until.elementLocated(By.id('datagrid'), 5000));
    const datagrid = await driver.findElement(By.id('datagrid'));
    const spanElement = await datagrid.findElement(By.xpath('//span[contains(text(),\'' + text + '\')]'));
    return await spanElement.findElement(By.xpath('..'));
  };

  this.editItem = async (idx) => {
    const items = await driver.findElements(By.css('.grb-item span.grb-item-edit'));
    await items[idx].click();
    return await driver.wait(until.elementIsVisible(driver.findElement(By.id('editModal'))), 5000);
  };

  this.editOverlayDisplayed = async () => {
    await driver.sleep(1000); // allow for animation
    return await driver.findElement(By.id('editModal')).isDisplayed();
  };

  this.editOverlayFieldValue = async (fieldName) => {
    const el = await driver.findElement(By.id(fieldName));
    return await el.getAttribute('value');
  };

  this.editorOverlayField = async (fieldName) => {
    return await driver.findElement(By.id(fieldName));
  };

  this.setEditorOverlayField = async (fieldName, value) => {
    const field = await this.editorOverlayField(fieldName);
    await field.clear();
    return await field.sendKeys(value);
  };

  this.cancelEdit = async () => {
    await driver.sleep(200); // slow down with animations
    await driver.findElement(By.id('editCancel')).click();
    await driver.sleep(1000);
    return await driver.wait(until.elementIsNotVisible(driver.findElement(By.id('editModal'))), 5000);
  };

  this.submitEditor = async () => {
    await driver.findElement(By.id('editSave')).click();
    await driver.sleep(2000); // await animation
    return await driver.wait(until.elementIsNotVisible(driver.findElement(By.id('editModal'))), 5000);
  };

  this.hasAddIcon = async (grbItem) => {
    try {
      return grbItem.findElement(By.css('.grb-item-add')).isDisplayed();
    } catch (e) {
      return false;
    }
  };

  this.clickItemAdd = async (grbItem) => {
      return await grbItem.findElement(By.css('.grb-item-add')).click();
  };

  this.clickTrailDelete = async () => {
    const el = await driver.findElement(By.css('.grb-trail-delete'));
    return await el.click();
  };

  this.getToastMessage = async () => {
    await driver.wait(until.elementIsVisible(driver.findElement(By.id('toast'))), 5000);
    return await driver.findElement(By.css('#grb-toast-msg')).getText();
  };

  this.waitForToastMessage = async (msg, wait) => {
    await driver.wait(until.elementTextIs(driver.findElement(By.css('#grb-toast-msg')), msg), wait);
    return await driver.findElement(By.css('#grb-toast-msg')).getText();
  };

  this.closeToast = async () => {
    await driver.sleep(1000); // allow for animation
    await driver.findElement(By.css('#toast button.close')).click();
    return await driver.wait(until.elementIsNotVisible(driver.findElement(By.id('toast'))), 2000);
  };
};
