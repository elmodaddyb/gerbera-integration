const {expect} = require('chai');
const CORE_SERVER_UUID = process.env.CORE_SERVER_UUID;
const {SSDPClient} = require('../utils');

describe('Gerbera SSDP Broadcast', () => {
  describe('M-SEARCH', () => {
    it('returns the LOCATION header of the Gerbera MediaServer', (done) => {
      SSDPClient.client()
        .then(client => SSDPClient.search(client, 'urn:schemas-upnp-org:device:MediaServer:1', 5000))
        .then(responses => SSDPClient.filterByUSN(responses, CORE_SERVER_UUID))
        .then(servers => SSDPClient.parseHeader(servers[0], 'LOCATION'))
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