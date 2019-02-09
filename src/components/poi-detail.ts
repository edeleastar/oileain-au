import {LeafletMap} from "../services/leaflet-map";

export class PoiDetail {
  title = "Olieain POI View";
  mapId = "poi-map-id";
  mapHeight = 300;
  map: LeafletMap;

  constructor() {
  }

  activate(params) {}

  attached() {
    this.map = new LeafletMap(
      "poi-map-id",
      { lat: 53.2734, long: -7.7783203 },
      8,
      7
    );
    this.map.addControl();
   }
}
