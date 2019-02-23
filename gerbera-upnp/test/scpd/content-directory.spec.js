const {expect} = require('chai');
const ScpdUtils = require('../utils/scpd-utils');
const {GERBERA_SERVER_UUID} = require('../utils/test-utils');

describe('The UPNP Content Directory XML', () => {
  let xml;
  let json;

  before((done) => {
    ScpdUtils.lookup({
      serviceType: 'urn:schemas-upnp-org:device:MediaServer:1',
      waitTime: 5000,
      udn: GERBERA_SERVER_UUID,
      serviceId: 'urn:upnp-org:serviceId:ContentDirectory',
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
    const specVersion = json.scpd.specVersion[0];
    const major = specVersion.major[0];
    const minor = specVersion.minor[0];
    expect(major).to.equal('1');
    expect(minor).to.equal('0');
  });
  describe('contains an Action List', () => {
    let actionList;
    before(() => {
      actionList = json.scpd.actionList[0];
    });
    it('with multiple actions', () => {
      const actions = actionList.action;
      expect(actions.length).to.be.above(0);
    });
    it('and has a Browse Action', () => {
      const result = ScpdUtils.findActionByName(actionList, 'Browse');
      expect(result.name[0]).to.equal('Browse');
    });
    it('and has a Search Action', () => {
      const result = ScpdUtils.findActionByName(actionList, 'Search');
      expect(result.name[0]).to.equal('Search');
    });
    it('and has a GetSearchCapabilities Action', () => {
      const result = ScpdUtils.findActionByName(actionList, 'GetSearchCapabilities');
      expect(result.name[0]).to.equal('GetSearchCapabilities');
    });
    it('and has a GetSortCapabilities Action', () => {
      const result = ScpdUtils.findActionByName(actionList, 'GetSortCapabilities');
      expect(result.name[0]).to.equal('GetSortCapabilities');
    });
    it('and has a GetSystemUpdateID Action', () => {
      const result = ScpdUtils.findActionByName(actionList, 'GetSystemUpdateID');
      expect(result.name[0]).to.equal('GetSystemUpdateID');
    });
  });
  describe('contains a Service State Table', () => {
    let serviceStateTable;
    before(() => {
      serviceStateTable = json.scpd.serviceStateTable[0];
    });
    it('with multiple state variables', () => {
      const stateVariable = serviceStateTable.stateVariable;
      expect(stateVariable.length).to.be.above(0);
    });
    describe('the Browse Flag variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'BrowseFlag');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_BrowseFlag');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
      it('has allowed value list', () => {
        const allowedValue = stateVariable.allowedValueList[0].allowedValue;
        expect(allowedValue).to.include.members(['BrowseMetadata', 'BrowseDirectChildren']);
      });
    });
    describe('the SearchCriteria variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'SearchCriteria');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_SearchCriteria');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
    describe('the SystemUpdateID variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'SystemUpdateID');
      });
      it('has sendEvents equal to yes', () => {
        expect(stateVariable['$'].sendEvents).to.equal('yes');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('SystemUpdateID');
      });
      it('has dataType of ui4', () => {
        expect(stateVariable.dataType[0]).to.equal('ui4');
      });
    });
    describe('the ContainerUpdateIDs variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'ContainerUpdateIDs');
      });
      it('has sendEvents equal to yes', () => {
        expect(stateVariable['$'].sendEvents).to.equal('yes');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('ContainerUpdateIDs');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
    describe('the Count variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'Count');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_Count');
      });
      it('has dataType of ui4', () => {
        expect(stateVariable.dataType[0]).to.equal('ui4');
      });
    });
    describe('the SortCriteria variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'SortCriteria');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_SortCriteria');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
    describe('the SortCapabilities variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'SortCapabilities');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('SortCapabilities');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
    describe('the Index variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'Index');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_Index');
      });
      it('has dataType of ui4', () => {
        expect(stateVariable.dataType[0]).to.equal('ui4');
      });
    });
    describe('the ObjectID variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'ObjectID');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_ObjectID');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
    describe('the UpdateID variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'UpdateID');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_UpdateID');
      });
      it('has dataType of ui4', () => {
        expect(stateVariable.dataType[0]).to.equal('ui4');
      });
    });
    describe('the Result variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'Result');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_Result');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
    describe('the SearchCapabilities variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'SearchCapabilities');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('SearchCapabilities');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
    describe('the Filter variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'Filter');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_Filter');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
  })
});