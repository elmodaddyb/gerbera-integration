const {expect} = require('chai');
const CORE_SERVER_UUID = process.env.CORE_SERVER_UUID;
const {ScpdUtils} = require('../utils');

describe('The UPNP Microsoft Media Receiver Registrar XML', () => {
  let xml;
  let json;

  before((done) => {
    ScpdUtils.lookup({
      serviceType: 'urn:schemas-upnp-org:device:MediaServer:1',
      waitTime: 5000,
      udn: CORE_SERVER_UUID,
      serviceId: 'urn:microsoft.com:serviceId:X_MS_MediaReceiverRegistrar',
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
    describe('and has a IsAuthorized Action', () => {
      let action;
      before(() => {
        action = ScpdUtils.findActionByName(actionList, 'IsAuthorized');
      });

      it('contains an argument list', () => {
        const args = action.argumentList[0].argument;
        expect(action.name[0]).to.equal('IsAuthorized');
        expect(ScpdUtils.hasProperArgument(args, 'DeviceID', 'in', 'A_ARG_TYPE_DeviceID')).to.equal(true);
        expect(ScpdUtils.hasProperArgument(args, 'Result', 'out', 'A_ARG_TYPE_Result')).to.equal(true);
      });
    });
    describe('and has a RegisterDevice Action', () => {
      let action;
      before(() => {
        action = ScpdUtils.findActionByName(actionList, 'RegisterDevice');
      });

      it('contains an argument list', () => {
        const args = action.argumentList[0].argument;
        expect(action.name[0]).to.equal('RegisterDevice');
        expect(ScpdUtils.hasProperArgument(args, 'RegistrationReqMsg', 'in', 'A_ARG_TYPE_RegistrationReqMsg')).to.equal(true);
        expect(ScpdUtils.hasProperArgument(args, 'RegistrationRespMsg', 'out', 'A_ARG_TYPE_RegistrationRespMsg')).to.equal(true);
      });
    });
    describe('and has a IsValidated Action', () => {
      let action;
      before(() => {
        action = ScpdUtils.findActionByName(actionList, 'IsValidated');
      });

      it('contains an argument list', () => {
        const args = action.argumentList[0].argument;
        expect(action.name[0]).to.equal('IsValidated');
        expect(ScpdUtils.hasProperArgument(args, 'DeviceID', 'in', 'A_ARG_TYPE_DeviceID')).to.equal(true);
        expect(ScpdUtils.hasProperArgument(args, 'Result', 'out', 'A_ARG_TYPE_Result')).to.equal(true);
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
    describe('the DeviceID variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'DeviceID');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_DeviceID');
      });
      it('has dataType of string', () => {
        expect(stateVariable.dataType[0]).to.equal('string');
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
      it('has dataType of int', () => {
        expect(stateVariable.dataType[0]).to.equal('int');
      });
    });
    describe('the RegistrationReqMsg variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'RegistrationReqMsg');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_RegistrationReqMsg');
      });
      it('has dataType of bin.base64', () => {
        expect(stateVariable.dataType[0]).to.equal('bin.base64');
      });
    });
    describe('the RegistrationRespMsg variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'RegistrationRespMsg');
      });
      it('has sendEvents equal to no', () => {
        expect(stateVariable['$'].sendEvents).to.equal('no');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('A_ARG_TYPE_RegistrationRespMsg');
      });
      it('has dataType of bin.base64', () => {
        expect(stateVariable.dataType[0]).to.equal('bin.base64');
      });
    });
    describe('the AuthorizationDeniedUpdateID variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'AuthorizationDeniedUpdateID');
      });
      it('has sendEvents equal to yes', () => {
        expect(stateVariable['$'].sendEvents).to.equal('yes');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('AuthorizationDeniedUpdateID');
      });
      it('has dataType of ui4', () => {
        expect(stateVariable.dataType[0]).to.equal('ui4');
      });
    });
    describe('the ValidationSucceededUpdateID variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'ValidationSucceededUpdateID');
      });
      it('has sendEvents equal to yes', () => {
        expect(stateVariable['$'].sendEvents).to.equal('yes');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('ValidationSucceededUpdateID');
      });
      it('has dataType of ui4', () => {
        expect(stateVariable.dataType[0]).to.equal('ui4');
      });
    });
    describe('the ValidationRevokedUpdateID variable', () => {
      let stateVariable;
      before(() => {
        stateVariable = ScpdUtils.findStateVariable(serviceStateTable.stateVariable, 'ValidationRevokedUpdateID');
      });
      it('has sendEvents equal to yes', () => {
        expect(stateVariable['$'].sendEvents).to.equal('yes');
      });
      it('has name', () => {
        expect(stateVariable.name[0]).to.equal('ValidationRevokedUpdateID');
      });
      it('has dataType of ui4', () => {
        expect(stateVariable.dataType[0]).to.equal('ui4');
      });
    });
  });
});