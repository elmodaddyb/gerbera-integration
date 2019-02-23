const {expect} = require('chai');
const ScpdUtils = require('./scpd-utils');
const {hasProperArgument, GERBERA_SERVER_UUID} = require('./test-utils');

describe('The UPNP Connection Manager XML', () => {
  let xml;
  let json;

  before((done) => {
    ScpdUtils.lookup({
      serviceType: 'urn:schemas-upnp-org:device:MediaServer:1',
      waitTime: 5000,
      udn: GERBERA_SERVER_UUID,
      serviceId: 'urn:upnp-org:serviceId:ConnectionManager',
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
    describe('and has a GetCurrentConnectionIDs Action', () => {
      let action;
      before(() => {
        action = ScpdUtils.findActionByName(actionList, 'GetCurrentConnectionIDs');
      });

      it('contains an argument list', () => {
        const args = action.argumentList[0].argument;
        expect(action.name[0]).to.equal('GetCurrentConnectionIDs');
        expect(hasProperArgument(args, 'ConnectionIDs', 'out', 'CurrentConnectionIDs')).to.equal(true);
      });
    });
    describe('and has a GetCurrentConnectionInfo Action', () => {
      let action;
      before(() => {
        action = ScpdUtils.findActionByName(actionList, 'GetCurrentConnectionInfo');
      });

      it('contains an argument list', () => {
        const args = action.argumentList[0].argument;
        expect(action.name[0]).to.equal('GetCurrentConnectionInfo');
        expect(hasProperArgument(args, 'ConnectionID', 'in', 'A_ARG_TYPE_ConnectionID'), 'ConnectionID').to.equal(true);
        expect(hasProperArgument(args, 'RcsID', 'out', 'A_ARG_TYPE_RcsID'), 'RcsID').to.equal(true);
        expect(hasProperArgument(args, 'AVTransportID', 'out', 'A_ARG_TYPE_AVTransportID'), 'AVTransportID').to.equal(true);
        expect(hasProperArgument(args, 'ProtocolInfo', 'out', 'A_ARG_TYPE_ProtocolInfo'), 'ProtocolInfo').to.equal(true);
        expect(hasProperArgument(args, 'PeerConnectionManager', 'out', 'A_ARG_TYPE_ConnectionManager'), 'PeerConnectionManager').to.equal(true);
        expect(hasProperArgument(args, 'PeerConnectionID', 'out', 'A_ARG_TYPE_ConnectionID'), 'PeerConnectionID').to.equal(true);
        expect(hasProperArgument(args, 'Direction', 'out', 'A_ARG_TYPE_Direction'), 'Direction').to.equal(true);
        expect(hasProperArgument(args, 'Status', 'out', 'A_ARG_TYPE_ConnectionStatus'), 'Status').to.equal(true);
      });
    });
    describe('and has a GetProtocolInfo Action', () => {
      let action;
      before(() => {
        action = ScpdUtils.findActionByName(actionList, 'GetProtocolInfo');
      });

      it('contains an argument list', () => {
        const args = action.argumentList[0].argument;
        expect(action.name[0]).to.equal('GetProtocolInfo');
        expect(hasProperArgument(args, 'Source', 'out', 'SourceProtocolInfo')).to.equal(true);
        expect(hasProperArgument(args, 'Sink', 'out', 'SinkProtocolInfo')).to.equal(true);
      });
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
    describe('the TYPE_ProtocolInfo variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'TYPE_ProtocolInfo');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_ProtocolInfo');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
    describe('the ConnectionStatus variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'ConnectionStatus');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_ConnectionStatus');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
      it('has allowed value list', () => {
        const allowedValue = stateVariable.allowedValueList[0].allowedValue;
        expect(allowedValue).to.include.members(['OK', 'ContentFormatMismatch', 'InsufficientBandwidth',
          'UnreliableChannel', 'Unknown']);
      });
    });
    describe('the AVTransportID variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'AVTransportID');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_AVTransportID');
      });
      it('has dataType of i4', () => {
        expect(stateVariable.dataType[0]).to.equal('i4');
      });
    });
    describe('the RcsID variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'RcsID');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_RcsID');
      });
      it('has dataType of i4', () => {
        expect(stateVariable.dataType[0]).to.equal('i4');
      });
    });
    describe('the ConnectionID variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'ConnectionID');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_ConnectionID');
      });
      it('has dataType of i4', () => {
        expect(stateVariable.dataType[0]).to.equal('i4');
      });
    });
    describe('the ConnectionManager variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'ConnectionManager');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_ConnectionManager');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
    describe('the SourceProtocolInfo variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'SourceProtocolInfo');
      });
      it('has sendEvents equal to yes', () => {
        expect(stateVariable['$'].sendEvents).to.equal('yes');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('SourceProtocolInfo');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
    describe('the SinkProtocolInfo variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'SinkProtocolInfo');
      });
      it('has sendEvents equal to yes', () => {
        expect(stateVariable['$'].sendEvents).to.equal('yes');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('SinkProtocolInfo');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
    describe('the Direction variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'Direction');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_Direction');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
      it('has allowed value list', () => {
        const allowedValue = stateVariable.allowedValueList[0].allowedValue;
        expect(allowedValue).to.include.members(['Input','Output']);
      });
    });
    describe('the CurrentConnectionIDs variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'CurrentConnectionIDs');
      });
      it('has sendEvents equal to yes', () => {
        expect(stateVariable['$'].sendEvents).to.equal('yes');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('CurrentConnectionIDs');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
      });
    });
  })
});
