import _map from 'lodash/map';
import _chunk from 'lodash/chunk';
import _get from 'lodash/get';
import _concat from 'lodash/concat';
import _filter from 'lodash/filter';
import _assign from 'lodash/assign';
import _unset from 'lodash/unset';
import * as turf from '@turf/turf';
import { polygon as turfPolygon } from '@turf/helpers';
import turfBooleanOverlap from '@turf/boolean-overlap';
import differenceAtPoint from './utils/differenceAtPoint';

const ShapeBuilder = {
  onSetup: function () {
    console.log(this);
    this.updateUIClasses({
      mouse: 'add'
    });
    const selected = this.getSelected();
    const feature = this.newFeature(turfPolygon([]));
    return {
      selected,
      feature,
      changed: []
    };
  },

  onMouseMove: function (state) {
    if (state.selected && state.selected.length !== 2) {
      this.changeMode('simple_select');
      return {};
    }
  },

  onTap: function (state, e) {
    this.onClick(state, e);
  },

  onClick: function (state, e) {
    if (state.selected && state.selected.length !== 2) {
      this.changeMode('simple_select');
      return;
    }
    const coord = [_get(e, 'lngLat.lng'), _get(e, 'lngLat.lat')];
    const features = _map(state.selected, function (v) {
      return _assign({}, v.toGeoJSON());
    });
    if (!turfBooleanOverlap(...features)) {
      this.changeMode('simple_select');
      return;
    }
    let contain = _filter(features, function (v) {
      const point = turf.point(coord);
      return turf.booleanPointInPolygon(point, v);
    });
    contain = _chunk(contain, 2)[0];
    let feature, poly1, poly2;
    switch (contain.length) {
      case 1:
        poly1 = contain[0];
        poly2 = _filter(features, function (v) {
          return v.id !== poly1.id;
        })[0];
        feature = differenceAtPoint(poly1, poly2, turf.point(coord));
        this.deleteFeature(poly1.id);
        let drawPoly1 = _assign({}, feature);
        drawPoly1 = turf.transformScale(drawPoly1, 1.00000001);
        drawPoly1 = turf.difference(poly1, drawPoly1);
        drawPoly1.id = poly1.id;
        drawPoly1 = this.newFeature(drawPoly1);
        this.addFeature(drawPoly1);
        state.changed.push(drawPoly1.toGeoJSON());
        break;
      case 2:
        feature = turf.intersect(...contain);
        break;
      default: break;
    }
    state.feature.setCoordinates(_get(feature, 'geometry.coordinates'));
    this.addFeature(state.feature);
    this.changeMode('direct_select', {
      featureId: state.feature.id
    });
  },

  onKeyUp: function (...args) {
    if (args[1].keyCode === 27 || args[1].code === 'Escape') {
      this.changeMode('simple_select');
    }
  },

  toDisplayFeatures: function (...args) {
    return args[2](args[1]);
  },

  onStop: function (state, e) {
    if (state.feature.isValid()) {
      this.map.fire('draw.create', {
        features: _concat([state.feature.toGeoJSON()], state.changed)
      });
    }
    this.updateUIClasses({
      mouse: 'none'
    });
    this.activateUIButton();
    this.clearSelectedFeatures();
  }
};

export default ShapeBuilder;
