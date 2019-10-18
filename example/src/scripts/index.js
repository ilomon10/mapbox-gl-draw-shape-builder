import '../styles/index.scss';
import MapboxGL from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGLDraw from '@mapbox/mapbox-gl-draw';
import Constants from '@mapbox/mapbox-gl-draw/src/constants';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import ShapeBuilder from 'mapbox-gl-draw-shape-builder';

import data from '../data/data.json';
import style from '../data/empty.json';

const mapContainer = document.getElementById('map');
const buttonContainer = document.getElementById('shapebuilderbutton');
const button = document.createElement('button');
buttonContainer.appendChild(button);
buttonContainer.className = `${Constants.classes.CONTROL_BASE} ${Constants.classes.CONTROL_GROUP} ${button.className}`;
button.className = `${Constants.classes.CONTROL_BUTTON} ${Constants.classes.CONTROL_BUTTON_POLYGON} ${button.className}`;

const map = new MapboxGL.Map({
  style,
  container: mapContainer,
  center: [124.83521, 1.47297],
  zoom: 16,
  hash: true
});

const modes = MapboxGLDraw.modes;
modes.shape_builder = ShapeBuilder;

const draw = new MapboxGLDraw({ modes });

button.addEventListener('click', () => {
  draw.changeMode('shape_builder');
});
map.addControl(draw);
map.on('load', function () {
  draw.add(data);
});
map.on('draw.create', function (e) {
  console.log(e);
});
map.on('click', function (e) {
  console.log(map.queryRenderedFeatures(e.point));
});
