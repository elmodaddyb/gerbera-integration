const {expect} = require('chai');
const ssdpHelper = require('../utils/ssdp-client');
const {GERBERA_SERVER_UUID} = require('../utils/test-utils');

describe('Gerbera SSDP Broadcast', () => {
  describe('M-SEARCH', () => {
    it('returns the LOCATION header of the Gerbera MediaServer', (done) => {
      ssdpHelper.client()
        .then(client => ssdpHelper.search(client, 'urn:schemas-upnp-org:device:MediaServer:1', 5000))
        .then(responses => ssdpHelper.filterByUSN(responses, GERBERA_SERVER_UUID))
        .then(servers => ssdpHelper.parseHeader(servers[0], 'LOCATION'))
        .then((locationHdr) => {
          console.log('\tSCPD XML Location --> '+ locationHdr);
          expect(locationHdr.includes('/description.xml'), 'Gerbera should return SCPD XML location').to.be.true;
          done();
        })
        .catch((err) => {
          done(err)
        });
    });
  });
});