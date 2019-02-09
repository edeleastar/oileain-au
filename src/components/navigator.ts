import {LeafletMap} from "../services/leaflet-map";

export class Navigator {
  title = "Olieain Navigator View";
  mapId = "nav-map-id";
  mapHeight = 200;
  map: LeafletMap;

  constructor() {}

  activate(params) {}

  attached() {
    this.map = new LeafletMap(
      this.mapId,
      { lat: 53.2734, long: -7.7783203 },
      8,
      7
    );
    this.map.addControl();
  }
}
