"use strict";

exports.__esModule = true;
exports.prefix = prefix;
exports.unprefix = unprefix;
exports.pickErrors = pickErrors;
exports.filter = filter;
exports.filterAndMapErrors = filterAndMapErrors;
exports.remove = remove;
exports.shift = shift;
exports.unshift = unshift;
exports.move = move;
exports.swap = swap;
exports.inclusiveMapErrors = inclusiveMapErrors;
exports.isChildPath = exports.EMPTY_ERRORS = void 0;

var _omitBy = _interopRequireDefault(require("lodash/omitBy"));

var _pick = _interopRequireDefault(require("lodash/pick"));

var _paths = require("./paths");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EMPTY_ERRORS = Object.freeze({});
exports.EMPTY_ERRORS = EMPTY_ERRORS;

var isChildPath = function isChildPath(basePath, path) {
  return path !== basePath && (0, _paths.inPath)(basePath, path);
};

exports.isChildPath = isChildPath;

function mapKeys(errors, baseName, fn) {
  if (errors === EMPTY_ERRORS) return errors;
  var newErrors = {};
  var workDone = false;
  Object.keys(errors).forEach(function (path) {
    var newKey = path;

    if (isChildPath(baseName, path)) {
      var matches = path.slice(baseName.length).match(/\[(\d+)\](.*)$/);
      newKey = fn(+matches[1], matches[2] || '', path);
      if (!workDone && newKey !== path) workDone = true;
    }

    newErrors[newKey] = errors[path];
  });
  return workDone ? newErrors : errors;
}

var prefixName = function prefixName(name, baseName) {
  return baseName + (!name || name[0] === '[' ? '' : '.') + name;
};

function prefix(errors, baseName) {
  var paths = Object.keys(errors);
  var result = {};
  paths.forEach(function (path) {
    result[prefixName(path, baseName)] = errors[path];
  });
  return result;
}

function unprefix(errors, baseName) {
  var paths = Object.keys(errors);
  var result = {};
  paths.forEach(function (path) {
    var shortened = path.slice(baseName.length).replace(/^\./, '');
    result[shortened] = errors[path];
  });
  return result;
}

function pickErrors(errors, names) {
  if (!names.length) return errors;
  return (0, _pick.default)(errors, names);
}

function filter(errors, baseName) {
  var paths = Object.keys(errors);
  var result = {};
  paths.forEach(function (path) {
    if (isChildPath(baseName, path)) {
      result[path] = errors[path];
    }
  });
  return result;
}

function filterAndMapErrors(_ref) {
  var errors = _ref.errors,
      names = _ref.names,
      resolveNames = _ref.resolveNames,
      _ref$mapErrors = _ref.mapErrors,
      mapErrors = _ref$mapErrors === void 0 ? pickErrors : _ref$mapErrors;
  if (!errors || errors === EMPTY_ERRORS) return errors;
  names = resolveNames ? resolveNames() : names;
  return mapErrors(errors, names ? [].concat(names) : []);
}

function remove(errors) {
  for (var _len = arguments.length, basePaths = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    basePaths[_key - 1] = arguments[_key];
  }

  return (0, _omitBy.default)(errors, function (_, path) {
    return basePaths.some(function (b) {
      return (0, _paths.inPath)(b, path);
    });
  });
}

function shift(errors, baseName, atIndex) {
  var current = baseName + "[" + atIndex + "]";
  return mapKeys(remove(errors, current), baseName, function (index, tail) {
    if (index > atIndex) {
      return baseName + "[" + (index - 1) + "]" + tail;
    }

    return null;
  });
}

function unshift(errors, baseName, atIndex) {
  return mapKeys(errors, baseName, function (index, tail) {
    if (index > atIndex) {
      return baseName + "[" + (index + 1) + "]" + tail;
    }

    return null;
  });
}

function move(errors, baseName, fromIndex, toIndex) {
  return mapKeys(errors, baseName, function (index, tail) {
    if (fromIndex > toIndex) {
      if (index === fromIndex) return baseName + "[" + toIndex + "]" + tail; // increment everything above the pivot

      if (index >= toIndex && index < fromIndex) return baseName + "[" + (index + 1) + "]" + tail;
    } else if (fromIndex < toIndex) {
      if (index === fromIndex) return baseName + "[" + toIndex + "]" + tail; // decrement everything above the from item we moved

      if (index >= fromIndex && index < toIndex) return baseName + "[" + (index - 1) + "]" + tail;
    }

    return null;
  });
}

function swap(errors, baseName, indexA, indexB) {
  return mapKeys(errors, baseName, function (index, tail) {
    if (index === indexA) return baseName + "[" + indexB + "]" + tail;
    if (index === indexB) return baseName + "[" + indexA + "]" + tail;
    return null;
  });
}

function inclusiveMapErrors(errors, names) {
  if (!names.length || errors === EMPTY_ERRORS) return EMPTY_ERRORS;
  var activeErrors = {};
  var paths = Object.keys(errors);
  names.forEach(function (name) {
    paths.forEach(function (path) {
      if (errors[path] && (0, _paths.inPath)(name, path)) {
        activeErrors[path] = errors[path];
      }
    });
  });
  return activeErrors;
}