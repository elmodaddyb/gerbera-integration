const {expect} = require('chai');
const {GERBERA_SERVER_UUID} = require('../utils/test-utils');
const ScpdUtils = require('../utils/scpd-utils');
const DidlUtils = require('../utils/didl-utils');
const path = require('path');

describe('The UPNP Content Directory Service', () => {
  let xml;
  let json;

  before((done) => {
    ScpdUtils.lookup({
      serviceType: 'urn:schemas-upnp-org:device:MediaServer:1',
      waitTime: 5000,
      udn: GERBERA_SERVER_UUID,
      header: 'LOCATION'
    }).then((scpd) => {
      xml = scpd.xml;
      json = scpd.json;
      done();
    })
      .catch((err) => {
        done(err)
      });
  });
  describe('Browse operation', () => {
    let urlBase;
    let service;
    let serviceList;
    let serviceType;
    let controlUrl;
    let didl;

    before((done) => {
      urlBase = json.root.URLBase[0];
      serviceList = json.root.device[0].serviceList[0];
      service = ScpdUtils.findServiceById(serviceList, 'urn:upnp-org:serviceId:ContentDirectory');
      serviceType = service.serviceType[0];
      controlUrl = service.controlURL[0];
      const endpoint = urlBase.replace(/\/$/, "") + controlUrl;
      const template = path.join(__dirname, path.sep, 'fixtures', path.sep, 'cds-browse.xml');
      const params = {
        serviceType : serviceType,
        ObjectId : '0',
        BrowseFlag : 'BrowseDirectChildren',
        Filter : '*',
        StartingIndex : '0',
        RequestedCount : '5000'
      };
      DidlUtils.templateSOAP(template, params)
        .then((message) => DidlUtils.browseContentDirectory(endpoint, serviceType, message))
        .then((didlResponse) => didl = didlResponse)
        .then(() => done())
        .catch((err) => done(err));
    });
    it('that provides BrowseResponse with Gerbera Top Listing', () => {
      expect(didl).to.not.be.undefined;
      const browseResponse = didl.json['s:Envelope']['s:Body'][0]['u:BrowseResponse'][0];
      expect(browseResponse).to.not.be.undefined;
      expect(browseResponse.Result).to.not.be.undefined;
      expect(browseResponse.NumberReturned[0]).to.equal("1");
      expect(browseResponse.TotalMatches[0]).to.equal("1");
    });
    it('with PC Directory container in the DIDL-Lite response', (done) => {
      let topItem;
      const browseResponse = didl.json['s:Envelope']['s:Body'][0]['u:BrowseResponse'][0];
      DidlUtils.asJson(browseResponse.Result[0]).then((didlJson) => {
        expect(didlJson).to.not.be.undefined;
        topItem = DidlUtils.findContainer(didlJson, {'dc:title' : 'PC Directory'});
        expect(topItem['dc:title'][0]).to.equal('PC Directory');
        expect(topItem['upnp:class'][0]).to.equal('object.container');
        done();
      }).catch((err) => done(err));
    });
  });
});