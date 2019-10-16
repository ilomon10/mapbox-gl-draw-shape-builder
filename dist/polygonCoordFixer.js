'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (raw) {
  if ((0, _lodash2.default)(raw).get('type') !== 'Polygon') return raw;
  var polygon = _extends({}, raw);
  var coordinates = (0, _lodash2.default)(polygon).get('coordinates[0]');

  if (!_lodash2.default.isEqual((0, _lodash2.default)(coordinates).head(), (0, _lodash2.default)(coordinates).last())) {
    coordinates.push((0, _lodash2.default)(coordinates).head());
    polygon = _lodash2.default.set(polygon, 'coordinates[0]', coordinates);
  }
  return polygon;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }