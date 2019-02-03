let baseUrl = process.env.GERBERA_BASE_URL;

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

if(baseUrl.lastIndexOf('/') === baseUrl.length - 1) {
  baseUrl = baseUrl.substring(0, baseUrl.length - 1);
}

module.exports = {
  baseUrl,
  findServiceById
};