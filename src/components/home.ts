import { LeafletMap } from "../services/leaflet-map";
import { Coast, PointOfInterest } from "../services/poi";
import { inject } from 'aurelia-framework';
import { Oileain } from "../services/oileain";
import * as L from "leaflet";
import Marker = L.Marker;
import {App} from "../app";
import {CoastalLeafletMap} from "../services/coastal-leaflet-map";

@inject(Oileain)
export class Home {
  title = 'Olieain Main View';

  mapDescriptor = {
    id: 'home-map-id',
    height: 1200,
    location: { lat: 53.2734, long: -7.7783203 },
    zoom: 8,
    minZoom: 7,
    activeLayer: ''
  };

  map: CoastalLeafletMap;
  coasts: Array<Coast>;

  constructor(private oileain: Oileain) {}

  async activate(params) {
    this.coasts = await this.oileain.getCoasts();
  }

  attached() {
    this.map = new CoastalLeafletMap(this.mapDescriptor);
    if (this.coasts) {
      this.map.populateCoasts(this.coasts);
    }
  }
}
