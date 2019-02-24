const {expect} = require('chai');
const GERBERA_SERVER_UUID = process.env.GERBERA_SERVER_UUID;
const {ScpdUtils} = require('../utils');

describe('The UPNP SCPD Description XML', () => {
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
  it('is accessible at the root of the web server', () => {
    expect(xml).not.to.be.undefined;
  });
  it('supports specVersion `1.0`', () => {
    const major = json.root.specVersion[0].major[0];
    const minor = json.root.specVersion[0].minor[0];
    expect(major).to.equal('1');
    expect(minor).to.equal('0');
  });
  it('provides URLBase', () => {
    const result = json.root.URLBase[0]
    expect(result).to.be.not.undefined;
  });
  describe('provides the device information', () => {
    let device;

    before(() => {
      device = json.root.device[0];
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
      let service;
      before(() => {
        serviceList = device.serviceList[0];
      });
      it('contains a list of services provided by the UPNP server', () => {
        expect(serviceList.service.length).to.be.above(0);
      });
      it('supports ConnectionManager service', () => {
        service = ScpdUtils.findServiceById(serviceList, 'urn:upnp-org:serviceId:ConnectionManager');
        expect(service.serviceType[0]).to.equal('urn:schemas-upnp-org:service:ConnectionManager:1');
        expect(service.serviceId[0]).to.equal('urn:upnp-org:serviceId:ConnectionManager');
        expect(service.SCPDURL[0]).to.equal('cm.xml');
        expect(service.controlURL[0]).to.equal('/upnp/control/cm');
        expect(service.eventSubURL[0]).to.equal('/upnp/event/cm');
      });
      it('supports ContentDirectory service', () => {
        service = ScpdUtils.findServiceById(serviceList, 'urn:upnp-org:serviceId:ContentDirectory');
        expect(service.serviceType[0]).to.equal('urn:schemas-upnp-org:service:ContentDirectory:1');
        expect(service.serviceId[0]).to.equal('urn:upnp-org:serviceId:ContentDirectory');
        expect(service.SCPDURL[0]).to.equal('cds.xml');
        expect(service.controlURL[0]).to.equal('/upnp/control/cds');
        expect(service.eventSubURL[0]).to.equal('/upnp/event/cds');
      });
      it('supports Microsoft MediaReceiverRegistrar service', () => {
        service = ScpdUtils.findServiceById(serviceList, 'urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar');
        expect(service.serviceType[0]).to.equal('urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1');
        expect(service.serviceId[0]).to.equal('urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar');
        expect(service.SCPDURL[0]).to.equal('mr_reg.xml');
        expect(service.controlURL[0]).to.equal('/upnp/control/mr_reg');
        expect(service.eventSubURL[0]).to.equal('/upnp/event/mr_reg');
      });
    });
  });
});