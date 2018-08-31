import Stream from "mithril/stream";

const lazyMap = signature => {
  var _map = {};
  return function(key) {
    if (!_map[key]) {
      _map[key] = {};
      for (var prop in signature) _map[key][prop] = Stream(signature[prop]());
    }
    return _map[key];
  };
};

const log = msg => val => {
  console.log(msg, val);
  return val;
};

const searchListById = x => xs => find(propEq("id", x), xs);

export { log, lazyMap, searchListById };
