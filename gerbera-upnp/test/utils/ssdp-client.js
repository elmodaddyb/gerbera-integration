const dgram = require('dgram');
const headers = {
  'LOCATION': /^LOCATION:.*$/
};
const multicast = {
  ip: '239.255.255.250',
  port: 1900
};

/**
 * Create an MSEARCH request protocol
 * given a multicast address with IP and PORT
 * @param multicast
 * @returns {string}
 * @constructor
 */
const MSEARCH = (multicast) => {
  const msg = [
    'M-SEARCH * HTTP/1.1',
    `HOST: ${multicast.ip}:${multicast.port}`,
    'MAN: "ssdp:discover"',
    'ST: urn:schemas-upnp-org:device:MediaServer:1',
    'MX: 5',
    '\r\n'
  ];
  return msg.join('\r\n');
};

/**
 * Perform a MSEARCH SSDP request using the UDP client provided
 * Waits a period of time to allow collection of responses
 * @param client
 * @param serviceType
 * @param wait
 * @returns {Promise<any>}
 */
const search = (client, serviceType, wait) => {
  return new Promise((resolve, reject) => {
    const endpoints = [];
    client.on('message', (msg, rinfo) =>  {
      console.log(`\tReceived UDP response from: ${rinfo.address}`);
      endpoints.push(msg);
    });

    const message = Buffer.from(MSEARCH(multicast), 'utf-8');
    client.send(message, 0, message.length, multicast.port, multicast.ip, function(err, bytes) {
      if (err) throw err;
      console.log('\tUDP message sent to ' + multicast.ip +':'+ multicast.port);
    });

    // UDP responses take 1-2 seconds to return, so wait a time amount
    // to allow for all responses to be recorded.
    setTimeout(() => {
      client.close();
      resolve(endpoints);
    }, wait)
  });
};

/**
 * Returns a UDP4 Datagram Socket
 * @returns {Promise<*>}
 */
const client = async () => {
  return dgram.createSocket('udp4');
};

/**
 * Given several UDP responses to an ssdp:discover returns those found
 * matching USN based on the serverUUID
 * @param responses
 * @param serverUUID
 * @returns {Promise<Array>}
 */
const filterByUSN = async (responses, serverUUID) => {
  const servers = [];
  const USN_HEADER = new RegExp('^USN: '+ serverUUID +'::urn:schemas-upnp-org:device:MediaServer:1$', 'i');
  for(let y = 0; y < responses.length; y++) {
    const response = responses[y];
    const lines = response.toString().split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (USN_HEADER.test(line)) {
        servers.push(response);
      }
    }
  }
  if(servers.length === 0) {
    throw new Error('No server found with header: ' + USN_HEADER);
  } else {
    return servers;
  }
};

/**
 * Given a response with headers, returns full header by name
 * @param resp
 * @param headerName
 * @returns {Promise<string>}
 */
const parseHeader = async (resp, headerName) => {
  try {
    const lines = resp.toString().split('\r\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (headers[headerName].test(line)) {
        return line;
      }
    }
  } catch(err) {
    throw err;
  }
};

export {
  client,
  filterByUSN,
  parseHeader,
  search
}