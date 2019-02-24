const SSDPClient = require('./ssdp-client');
const {parseString} = require('xml2js');
const request = require('request');

/**
 * Given a SCPD Service List, finds one by Service ID
 * @param serviceList
 * @param serviceId
 * @returns {*}
 */
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

/**
 * Given a list of SCPD Actions, finds one by name
 * @param list
 * @param name
 * @returns {*}
 */
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

/**
 * Given a list of SCPD state variables finds one by name
 * @param list
 * @param name
 * @returns {*}
 */
const findStateVariable = (list, name) => {
  let result;
  const regex = new RegExp('.*'+ name + '$');
  list.forEach((variable) => {
    if(variable.name[0].match(regex)) {
      result = variable;
    }
  });
  return result;
};

/**
 * Given a SCPD Description JSON, find the associated SCPD URL for a Service ID
 * @param json
 * @param serviceId
 * @returns {*}
 */
const parseScpdUrlForServiceId = (json, serviceId) => {
  const URLBase = json.root.URLBase[0];
  const serviceList = json.root.device[0].serviceList[0];
  const service = findServiceById(serviceList, serviceId);
  const SCPDURL = service.SCPDURL;
  return URLBase + SCPDURL;
};

/**
 * Given a UPNP Configuration (i.e. Known Host) find associated service information or description
 * @param upnpConfig
 * @returns {Promise<any>}
 */
const lookup = (upnpConfig) => {
  return new Promise((resolve, reject) => {
    SSDPClient.client()
      .then(client => SSDPClient.search(client, upnpConfig.serviceType, upnpConfig.waitTime))
      .then(responses => SSDPClient.filterByUSN(responses, upnpConfig.udn))
      .then(servers => SSDPClient.parseHeader(servers[0], upnpConfig.header))
      .then(locationHdr => retrieveDescriptionSCPD(locationHdr))
      .then((descSCPD) => {
        if(upnpConfig.serviceId) {
          retrieveServiceSCPD(descSCPD.json, upnpConfig.serviceId).then((result) =>  {
            resolve(result);
          });
        } else {
          resolve(descSCPD);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Given a SSDP LOCATION header, call for the Description SCPD XML
 * returns the result in both JSON and XML
 * @param locationHeader
 * @returns {Promise<any>}
 */
const retrieveDescriptionSCPD = (locationHeader) => {
  return new Promise((resolve, reject) => {
    const scpdUrl = locationHeader.split(': ')[1].trim();
    console.log('\tCalling SCPD XML --> ' + scpdUrl);
    request(scpdUrl, function (error, response, body) {
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

/**
 * Given a Description SCPD output, return a service
 * based on the service ID provided
 * @param descJson
 * @param serviceId
 * @returns {Promise<any>}
 */
const retrieveServiceSCPD = (descJson, serviceId) => {
  return new Promise((resolve, reject) => {
    const url = parseScpdUrlForServiceId(descJson, serviceId);
    console.log('\tService SCPD URL ---> ' + url);
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

/**
 * Check a list of arguments for existence of a given argument
 * with related state variable matching.
 * @param args
 * @param name
 * @param direction
 * @param relatedStateVariable
 * @returns {*}
 */
const hasProperArgument = (args, name, direction, relatedStateVariable) => {
  let result;
  args.forEach((arg) => {
    if(arg.name[0] === name
      && arg.direction[0] === direction
      && arg.relatedStateVariable[0] === relatedStateVariable) {
      result = true;
    }
  });
  return result;
};

export {
  findServiceById,
  findActionByName,
  findStateVariable,
  hasProperArgument,
  parseScpdUrlForServiceId,
  lookup
}