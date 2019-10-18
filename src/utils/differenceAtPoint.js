import * as turf from '@turf/turf';
import _ from 'lodash';

export default function (PolyA, PolyB, point) {
  let feature = turf.difference(PolyA, PolyB);
  if (turf.getType(feature) === 'MultiPolygon') {
    feature = _.chain(feature).get('geometry.coordinates')
      .map(function (v) {
        const properties = _(feature).get('properties');
        return turf.polygon(v, properties);
      })
      .filter(function (v) {
        return turf.booleanPointInPolygon(point, v);
      }).get('[0]').value();
  }
  return _.create(feature);
}
