import { LeafletMap } from "../services/leaflet-map";
import { Coast, PointOfInterest } from "../services/poi";
import { inject } from "aurelia-framework";
import { Oileain } from "../services/oileain";
import * as L from "leaflet";
import Marker = L.Marker;

@inject(Oileain)
export class Home {
  title = "Olieain Main View";

  mapDescriptor = {
    id: "home-map-id",
    height: 1200,
    location: { lat: 53.2734, long: -7.7783203 },
    zoom: 8,
    minZoom: 7,
    activeLayer: ""
  };

  map: LeafletMap;
  populated = false;
  markerMap = new Map<Marker, PointOfInterest>();

  coasts: Array<Coast>;

  constructor(private oileain: Oileain) {}

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

  async activate(params) {
    this.coasts = await this.oileain.getCoasts()
  }

  attached() {
    this.map = new LeafletMap(this.mapDescriptor);
    if (this.coasts) {
      this.populateCoasts(this.coasts);
    }
  }
}
