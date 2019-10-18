import { polygon } from '@turf/helpers';
import { getType } from '@turf/invariant';
import difference from '@turf/difference';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import _assign from 'lodash/assign';
import _find from 'lodash/find';
import _map from 'lodash/map';
import _get from 'lodash/get';

export default function (PolyA, PolyB, point) {
  let feature = difference(PolyA, PolyB);
  if (getType(feature) === 'MultiPolygon') {
    feature = _get(feature, 'geometry.coordinates');
    feature = _map(feature, function (v) {
      const properties = _get(feature, 'properties');
      return polygon(v, properties);
    });
    feature = _find(feature, function (v) {
      return booleanPointInPolygon(point, v);
    });
  }
  return _assign({}, feature);
}
