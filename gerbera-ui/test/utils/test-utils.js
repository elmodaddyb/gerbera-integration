const {Builder} = require('selenium-webdriver');
let webServer = process.env.GERBERA_BASE_URL;
const seleniumHub = `http://${process.env.HUB_HOST}:${process.env.HUB_PORT}/wd/hub`;
const testData = process.env.UI_TEST_DATA;

if(webServer.lastIndexOf('/') === webServer.length - 1) {
  webServer = webServer.substring(0, webServer.length - 1);
}

const newRemoteDriver = async () => {
  console.log(`\n\tGerbera Web UI URL --> ${webServer}`);
  console.log(`\tSelenium Hub URL   --> ${seleniumHub}\n`);
  return new Builder().usingServer(seleniumHub).build();
};

const loadTestData = (dataName) => {
  return require(__dirname + '/data/' + testData)[dataName];
};

module.exports = {
  newRemoteDriver,
  loadTestData,
  webServer
};