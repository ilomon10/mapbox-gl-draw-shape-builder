import Constants from './constants'
import dragPan from './drag_pan'
import pcf from './polygonCoordFixer'
import * as turf from '@turf/turf'
import _ from 'lodash'

const ShapeBuilder = {

  onSetup: function (opts) {
    console.log('setup baru');
    return {
      drawMoving: false
    };
  },

  onTap: function (state, e) { this.onClick(state, e) },

  onClick: function (state, e) {
    console.log(this.getSelected());
    if (this.getSelected().length !== 2) { this.changeMode('simple_select'); return; };
    const coord = [_(e).get('lngLat.lng'), _(e).get('lngLat.lat')];
    const compFeature = _.map(this.getSelected(), (v) =>
      ({ ...turf.polygon(pcf(v).coordinates, { ...v.properties, id: v.id }) }))
    const contain = _.chain(compFeature)
      .filter((v) => {
        const point = turf.point(coord);
        return turf.booleanPointInPolygon(point, v);
      }).chunk(2).get('[0]').value();

    let feature;
    switch (contain.length) {
      case 1:
        const poly1 = contain[0];
        const poly2 = _.chain(compFeature)
          .filter((v) => _(v).get('properties.id') !== _(poly1).get('properties.id'))
          .get('[0]').value();
        feature = turf.difference(poly1, poly2);
        const newPoly1 = turf.difference(poly1, turf.transformScale({ ...feature }, 1.00000001));
        this.deleteFeature(poly1.properties.id);
        const drawPoly1 = this.newFeature(newPoly1);
        this.addFeature(drawPoly1);
        break;
      case 2:
        feature = turf.intersect(...contain);
        break;
    }
    const drawFeature = this.newFeature({
      ...feature, properties: {
        ...feature.properties, id: undefined
      }
    });
    this.addFeature(drawFeature);

    this.changeMode('simple_select');
  },

  toDisplayFeatures: function (state, geojson, display) {
    return display(geojson);
  },

  onKeyUp: function (state, e) {
    console.log('keyup', e);
    if (e.keyCode === 27 || e.code === 'Escape') this.changeMode('simple_select');
  },

  onStop: function () {
    this.clearSelectedFeatures();
    console.log('stop');
  }
};

export default ShapeBuilder;