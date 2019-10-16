'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _drag_pan = require('./drag_pan');

var _drag_pan2 = _interopRequireDefault(_drag_pan);

var _polygonCoordFixer = require('./polygonCoordFixer');

var _polygonCoordFixer2 = _interopRequireDefault(_polygonCoordFixer);

var _turf = require('@turf/turf');

var turf = _interopRequireWildcard(_turf);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ShapeBuilder = {

  onSetup: function onSetup(opts) {
    console.log('setup baru');
    // this.setSelected(opts)
    // const line = this.newFeature({
    //   type: Constants.geojsonTypes.FEATURE,
    //   properties: {},
    //   geometry: {
    //     type: Constants.geojsonTypes.LINE_STRING,
    //     coordinates: [[]]
    //   }
    // })
    // this.addFeature(line);
    // dragPan.disable(this);
    // this.setActionableState();
    return {
      // line,
      drawMoving: false
    };
  },

  onTap: function onTap(state, e) {
    this.onClick(state, e);
  },

  onClick: function onClick(state, e) {
    console.log(this.getSelected());
    if (this.getSelected().length !== 2) {
      this.changeMode('simple_select');return;
    };
    var coord = [(0, _lodash2.default)(e).get('lngLat.lng'), (0, _lodash2.default)(e).get('lngLat.lat')];
    var compFeature = _lodash2.default.map(this.getSelected(), function (v) {
      return _extends({}, turf.polygon((0, _polygonCoordFixer2.default)(v).coordinates, _extends({}, v.properties, { id: v.id })));
    });
    var contain = _lodash2.default.chain(compFeature).filter(function (v) {
      var point = turf.point(coord);
      return turf.booleanPointInPolygon(point, v);
    }).chunk(2).get('[0]').value();

    var feature = void 0;
    switch (contain.length) {
      case 1:
        var poly1 = contain[0];
        var poly2 = _lodash2.default.chain(compFeature).filter(function (v) {
          return (0, _lodash2.default)(v).get('properties.id') !== (0, _lodash2.default)(poly1).get('properties.id');
        }).get('[0]').value();
        feature = turf.difference(poly1, poly2);
        var newPoly1 = turf.difference(poly1, turf.transformScale(_extends({}, feature), 1.00000001));
        this.deleteFeature(poly1.properties.id);
        var drawPoly1 = this.newFeature(newPoly1);
        this.addFeature(drawPoly1);
        break;
      case 2:
        feature = turf.intersect.apply(turf, _toConsumableArray(contain));
        break;
    }
    var drawFeature = this.newFeature(_extends({}, feature, { properties: _extends({}, feature.properties, { id: undefined
      })
    }));
    this.addFeature(drawFeature);

    this.changeMode('simple_select');
  },

  toDisplayFeatures: function toDisplayFeatures(state, geojson, display) {
    return display(geojson);
  },

  onKeyUp: function onKeyUp(state, e) {
    console.log('keyup', e);
    if (e.keyCode === 27 || e.code === 'Escape') this.changeMode('simple_select');
  },

  onStop: function onStop() {
    this.clearSelectedFeatures();
    console.log('stop');
  }
};

exports.default = ShapeBuilder;