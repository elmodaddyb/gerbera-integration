// TODO: Smartly identify the correct UPNP server that is Gerbera
// Taken from gerbera-home/config.default.xml
const GERBERA_SERVER_UUID = process.env.GERBERA_SERVER_UUID;

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

module.exports = {
  GERBERA_SERVER_UUID,
  hasProperArgument,
};