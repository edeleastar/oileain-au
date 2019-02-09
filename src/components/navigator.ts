import { LeafletMap } from '../services/leaflet-map';

export class Navigator {
  title = 'Olieain Navigator View';

  mapDescriptor = {
    id: 'nav-map-id',
    height: 200,
    location: { lat: 53.2734, long: -7.7783203 },
    zoom: 8,
    minZoom: 7,
    activeLayer: ''
  };

  map: LeafletMap;

  constructor() {}

  activate(params) {}

  attached() {
    this.map = new LeafletMap(this.mapDescriptor);
  }
}
