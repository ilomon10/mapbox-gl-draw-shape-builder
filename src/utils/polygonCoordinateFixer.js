import _ from 'lodash';

export default function (raw) {
  if (_(raw).get('type') !== 'Polygon') {
    return raw;
  }
  let polygon = _.create(raw);
  let coordinates = _(polygon).get('coordinates[0]');

  if (!_.isEqual(_(coordinates).head(), _(coordinates).last())) {
    coordinates.push(_(coordinates).head());
    polygon = _.set(polygon, 'coordinates[0]', coordinates);
  }
  return polygon;
}
