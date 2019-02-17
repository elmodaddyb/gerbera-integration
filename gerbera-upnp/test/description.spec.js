const {expect} = require('chai');
const {parseString} = require('xml2js');
const request = require('request');
const {findServiceById, GERBERA_SERVER_UUID} = require('./test-utils');
const ssdpHelper = require('./ssdp-client');

describe('The UPNP SCDP Description XML', () => {
  let descriptionXml;
  let descriptionJson;

  before((done) => {
    ssdpHelper.client()
      .then(client => ssdpHelper.search(client, 'urn:schemas-upnp-org:device:MediaServer:1', 5000))
      .then(responses => ssdpHelper.filterByUSN(responses, GERBERA_SERVER_UUID))
      .then(servers => ssdpHelper.parseHeader(servers[0], 'LOCATION'))
      .then((locationHdr) => {
        const scdpUrl = locationHdr.split(': ')[1].trim();
        console.log('\tCalling SCDP XML --> ' + scdpUrl);
        request(scdpUrl, function (error, response, body) {
          parseString(body, (err, result) => {
            descriptionXml = body;
            descriptionJson = result;
            done();
          });
        });
      })
      .catch((err) => {
        done(err)
      });
  });
  it('is accessible at the root of the web server', () => {
    expect(descriptionXml).not.to.be.undefined;
  });
  it('supports specVersion `1.0`', () => {
    const major = descriptionJson.root.specVersion[0].major[0];
    const minor = descriptionJson.root.specVersion[0].minor[0];
    expect(major).to.equal('1');
    expect(minor).to.equal('0');
  });
  it('provides URLBase', () => {
    const result = descriptionJson.root.URLBase[0]
    expect(result).to.be.not.undefined;
  });
  describe('provides the device information', () => {
    let device;

    before(() => {
      device = descriptionJson.root.device[0];
    });

    it('contains a device type for UPNP', () => {
      const result = device.deviceType[0];
      expect(result).to.equal('urn:schemas-upnp-org:device:MediaServer:1');
    });
    it('contains a presentation URL', () => {
      const result = device.presentationURL[0];
      expect(result).to.be.not.undefined;
    });
    it('contains a friendly name', () => {
      const result = device.friendlyName[0];
      expect(result).to.equal('Gerbera');
    });
    it('contains a manufacturer', () => {
      const result = device.manufacturer[0];
      expect(result).to.equal('Gerbera Contributors');
    });
    it('contains a manufacturerURL', () => {
      const result = device.manufacturerURL[0];
      expect(result).to.equal('http://gerbera.io/');
    });
    it('contains a modelDescription', () => {
      const result = device.modelDescription[0];
      expect(result).to.equal('Free UPnP AV MediaServer, GNU GPL');
    });
    it('contains a modelName', () => {
      const result = device.modelName[0];
      expect(result).to.equal('Gerbera');
    });
    it('contains a UDN', () => {
      const result = device.UDN[0];
      expect(result).to.be.not.undefined;
    });

    describe('that provides a service list', () => {
      let serviceList;
      before(() => {
        serviceList = device.serviceList[0];
      });
      it('contains a list of services provided by the UPNP server', () => {
        expect(serviceList.service.length).to.be.above(0);
      });
      it('supports ConnectionManager service', () => {
        const service = findServiceById(serviceList, 'urn:upnp-org:serviceId:ConnectionManager');
        expect(service.serviceType[0]).to.equal('urn:schemas-upnp-org:service:ConnectionManager:1');
        expect(service.serviceId[0]).to.equal('urn:upnp-org:serviceId:ConnectionManager');
        expect(service.SCPDURL[0]).to.equal('cm.xml');
        expect(service.controlURL[0]).to.equal('/upnp/control/cm');
        expect(service.eventSubURL[0]).to.equal('/upnp/event/cm');
      });
      it('supports ContentDirectory service', () => {
        const service = findServiceById(serviceList, 'urn:upnp-org:serviceId:ContentDirectory');
        expect(service.serviceType[0]).to.equal('urn:schemas-upnp-org:service:ContentDirectory:1');
        expect(service.serviceId[0]).to.equal('urn:upnp-org:serviceId:ContentDirectory');
        expect(service.SCPDURL[0]).to.equal('cds.xml');
        expect(service.controlURL[0]).to.equal('/upnp/control/cds');
        expect(service.eventSubURL[0]).to.equal('/upnp/event/cds');
      });
      it('supports Microsoft MediaReceiverRegistrar service', () => {
        const service = findServiceById(serviceList, 'urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar');
        expect(service.serviceType[0]).to.equal('urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1');
        expect(service.serviceId[0]).to.equal('urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar');
        expect(service.SCPDURL[0]).to.equal('mr_reg.xml');
        expect(service.controlURL[0]).to.equal('/upnp/control/mr_reg');
        expect(service.eventSubURL[0]).to.equal('/upnp/event/mr_reg');
      });
    });
  });
});