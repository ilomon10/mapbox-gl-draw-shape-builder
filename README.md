## Mapbox GL Draw Shape Builder
This is a custom mode for (Mapbox GL Draw) [https://github.com/mapbox/mapbox-gl-draw] that adds the functionality to build new shape from selected shape.

[![npm version](https://badge.fury.io/js/mapbox-gl-draw-shape-builder.svg)](https://badge.fury.io/js/mapbox-gl-draw-shape-builder)

### Install
```bash
npm install mapbox-gl-draw-shape-builder@next
```

### Usage
```js
import ShapeBuilder from 'mapbox-gl-draw-shape-builder';
mapboxgl.accessToken = '';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'https://tilemaps.icgc.cat/tileserver/styles/water.json',
	center: [2.278507, 41.594896],
	zoom: 16
});
var modes = MapboxDraw.modes;
modes.shape_builder = ShapeBuilder.default;
var draw = new MapboxDraw({
	modes: modes
});
map.addControl(draw);
draw.changeMode('shape_builder');
map.on('draw.create', function (feature) {
	console.log(feature);
});
```

### Build
`npm build-web` with browsify
`npm build-all` with babel

### License
MIT

### Credits
Developed by @tagconn

Project template:
https://github.com/geostarters/mapbox-gl-draw-assisted-rectangle-mode