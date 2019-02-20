const ssdpHelper = require('./ssdp-client');
const {parseString} = require('xml2js');
const request = require('request');

const findServiceById = (serviceList, serviceId) => {
  const services = serviceList.service;
  let result;
  services.forEach((service) => {
    if(service.serviceId[0] === serviceId) {
      result = service;
    }
  });
  return result;
};

const findActionByName = (list, name) => {
  const actions = list.action;
  let result;
  actions.forEach((action) => {
    if(action.name[0] === name) {
      result = action;
    }
  });
  return result;
};

const findStateVariable = (list, name) => {
  let result;
  list.forEach((variable) => {
    if(variable.name[0].includes(name)) {
      result = variable;
    }
  });
  return result;
};

const parseScdpUrlForServiceId = (json, serviceId) => {
  const URLBase = json.root.URLBase[0];
  const serviceList = json.root.device[0].serviceList[0];
  const service = findServiceById(serviceList, serviceId);
  const SCDPURL = service.SCPDURL;
  return URLBase + SCDPURL;
};

const lookup = (upnpConfig) => {
  return new Promise((resolve, reject) => {
    ssdpHelper.client()
      .then(client => ssdpHelper.search(client, upnpConfig.serviceType, upnpConfig.waitTime))
      .then(responses => ssdpHelper.filterByUSN(responses, upnpConfig.udn))
      .then(servers => ssdpHelper.parseHeader(servers[0], upnpConfig.header))
      .then(locationHdr => retrieveDescriptionSCDP(locationHdr))
      .then((descSCDP) => {
        if(upnpConfig.serviceId) {
          retrieveServiceSCDP(descSCDP.json, upnpConfig.serviceId).then(result => resolve(result));
        } else {
          resolve(descSCDP);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const retrieveDescriptionSCDP = (locationHeader) => {
  return new Promise((resolve, reject) => {
    const scdpUrl = locationHeader.split(': ')[1].trim();
    console.log('\tCalling SCDP XML --> ' + scdpUrl);
    request(scdpUrl, function (error, response, body) {
      parseString(body, (err, result) => {
        if(err) {
          reject(err);
        }
        resolve({
          xml: body,
          json: result
        });
      });
    });
  });
};

const retrieveServiceSCDP = (descJson, serviceId) => {
  return new Promise((resolve, reject) => {
    const url = parseScdpUrlForServiceId(descJson, serviceId);
    console.log('\tService SCDP URL ---> ' + url);
    request(url, function (error, response, body) {
      parseString(body, (err, result) => {
        if(err) {
          reject(err);
        }
        resolve({
          xml: body,
          json: result
        });
      });
    });
  });
};


export {
  findServiceById,
  findActionByName,
  findStateVariable,
  parseScdpUrlForServiceId,
  lookup
}