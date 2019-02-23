const {parseString} = require('xml2js');
const request = require('request');
const fs = require('fs');



const browseContentDirectory = (endpoint, serviceType, message) => {
  return new Promise((resolve, reject) => {
    const options = {
      url: endpoint,
      body : message,
      headers: {
        'User-Agent': 'request',
        'Content-Type': 'text/xml',
        'SOAPAction': '"'+ serviceType + '#Browse"'
      }
    };
    console.log('\tCalling Browse Service Type: ' + endpoint);
    request.post(options, function (error, response, body) {
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

const templateSOAP = (template, params) => {
  return new Promise((resolve, reject) => {
    fs.readFile(template, (err, data) => {
      if(err) {
        reject(err);
      } else {
        let template = data.toString();
        Object.keys(params).forEach(function(key,index) {
          template = template.replace('{{'+key+'}}', params[key]);
        });
        resolve(template);
      }
    });
  });
};

const asJson = (didlLite) => {
  return new Promise((resolve, reject) => {
    parseString(didlLite, (err, result) => {
      if(err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

const findContainer = (didlJson, params) => {
  const containers = didlJson['DIDL-Lite'].container;
  let result;
  for(let i = 0; i < containers.length; i++) {
    let hasAll = true;
    let hasMiss = false;
    const container = containers[i];
    Object.keys(params).forEach((key, idx) => {
      if(container[key] && container[key][0] && container[key][0] === params[key] && !hasMiss) {
        hasAll = true;
      } else {
        hasMiss = true;
      }
    });
    if(hasAll && !hasMiss) {
      result = container;
      break;
    }
  }
  return result;
};


export {
  asJson,
  browseContentDirectory,
  findContainer,
  templateSOAP,
}