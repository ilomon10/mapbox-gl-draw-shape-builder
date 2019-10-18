import _ from 'lodash';
import * as turf from '@turf/turf';
import pcf from './utils/polygonCoordinateFixer';
import differenceAtPoint from './utils/differenceAtPoint';

const ShapeBuilder = {
  onSetup: function () {
    this.updateUIClasses({
      mouse: 'add'
    });
    return {};
  },

  onTap: function (state, e) {
    this.onClick(state, e);
  },

  onClick: function (state, e) {
    if (this.getSelected().length !== 2) {
      this.changeMode('simple_select');
      return;
    }
    const coord = [_(e).get('lngLat.lng'), _(e).get('lngLat.lat')];
    const compFeature = _.map(this.getSelected(), function (v) {
      const coordinates = pcf(v).coordinates;
      const properties = _.create(v.properties, { id: v.id });
      const polygon = turf.polygon(coordinates, properties);
      return _.create(polygon);
    });
    if (!turf.booleanOverlap(...compFeature)) {
      this.changeMode('simple_select');
      return;
    }
    const contain = _.chain(compFeature)
      .filter(function (v) {
        const point = turf.point(coord);
        return turf.booleanPointInPolygon(point, v);
      }).chunk(2).get('[0]').value();

    let feature, poly1, poly2;
    switch (contain.length) {
      case 1:
        poly1 = contain[0];
        poly2 = _.chain(compFeature)
          .filter(function (v) {
            return _(v).get('properties.id') !== _(poly1).get('properties.id');
          }).get('[0]').value();
        feature = differenceAtPoint(poly1, poly2, turf.point(coord));
        this.deleteFeature(poly1.properties.id);
        let drawPoly1 = _.create(feature);
        drawPoly1 = turf.transformScale(drawPoly1, 1.00000001);
        drawPoly1 = turf.difference(poly1, drawPoly1);
        drawPoly1 = this.newFeature(drawPoly1);
        this.addFeature(drawPoly1);
        break;
      case 2:
        feature = turf.intersect(...contain);
        break;
      default: break;
    }
    let drawFeature = _.create(feature);
    _.unset(drawFeature, 'properties.id');
    drawFeature = this.newFeature(drawFeature);
    this.addFeature(drawFeature);
    this.clearSelectedFeatures();
    this.changeMode('direct_select', {
      featureId: _(drawFeature).get('id')
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
    this.updateUIClasses({
      mouse: "none"
    });
    this.activateUIButton();
    this.clearSelectedFeatures();
  }
};

export default ShapeBuilder;
