import { LeafletMap } from "../services/leaflet-map";
import {Coast, PointOfInterest} from "../services/poi";
import { inject } from "aurelia-framework";
import { Oileain } from "../services/oileain";
import * as L from "leaflet";
import Marker = L.Marker;

@inject(Oileain)
export class Home {
  title = "Olieain Main View";
  mapId = "home-map-id";
  mapHeight = 1200;
  map: LeafletMap;
  populated = false;
  markerMap = new Map<Marker, PointOfInterest>();

  coasts: Array<Coast>;

  constructor(
    private oileain: Oileain,
  ) {}

  populateCoast(coast: Coast) {
    let group = L.layerGroup([]);
    coast.pois.forEach(poi => {
      let marker = L.marker([
        poi.coordinates.geo.lat,
        poi.coordinates.geo.long
      ]);
      var newpopup = L.popup({
        autoClose: false,
        closeOnClick: false
      }).setContent(
        `<a href='#/poi/${poi.safeName}'>${
          poi.name
          } <small>(click for details}</small></a>`
      );
      marker.bindPopup(newpopup);
      marker.addTo(group);
    });
    this.map.addLayer(coast.title, group);
    this.map.control.addOverlay(group, coast.title);
  }

  populateCoasts(coasts: Array<Coast>) {
    if (this.map && !this.populated) {
      this.populated = true;
      coasts.forEach(coast => {
        this.populateCoast(coast);
      });
      this.map.invalidateSize();
    }
  }

  activate(params) {
    console.log(params.zone);
    this.oileain.getCoasts().then(coasts => {
      this.coasts = coasts;
      this.populateCoasts(coasts);
    });
  }


  attached() {
    this.map = new LeafletMap(
      this.mapId,
      { lat: 53.2734, long: -7.7783203 },
      8,
      7
    );
    this.map.addControl();
    if (this.coasts) {
      this.populateCoasts(this.coasts);
    }
  }
}
