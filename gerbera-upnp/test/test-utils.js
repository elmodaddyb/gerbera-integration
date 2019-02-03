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

if(baseUrl.lastIndexOf('/') === baseUrl.length - 1) {
  baseUrl = baseUrl.substring(0, baseUrl.length - 1);
}

module.exports = {
  baseUrl,
  findActionByName,
  findServiceById,
  findStateVariable,
  hasProperArgument
};