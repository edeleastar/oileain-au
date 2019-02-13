import { LeafletMap } from '../services/leaflet-map';
import { Coast, PointOfInterest } from '../services/poi';
import { inject } from 'aurelia-framework';
import { Oileain } from '../services/oileain';
import * as L from 'leaflet';
import Marker = L.Marker;

@inject(Oileain)
export class Navigator {
  mainMapDescriptor = {
    id: 'home-map-id',
    height: 650,
    location: { lat: 53.2734, long: -7.7783203 },
    zoom: 7,
    minZoom: 7,
    activeLayer: ''
  };

  islandMapDescriptor = {
    id: 'island-map-id',
    height: 250,
    location: { lat: 53.2734, long: -7.7783203 },
    zoom: 8,
    minZoom: 7,
    activeLayer: 'Satellite'
  };

  mainMap: LeafletMap;
  islandMap: LeafletMap;
  coasts: Array<Coast>;
  populated = false;
  markerMap = new Map<Marker, PointOfInterest>();
  poi: PointOfInterest;
  poiSelected = false;

  constructor(private oileain: Oileain) {}

  async onClick(markerEvent) {
    const marker = markerEvent.popup._source;
    const shortPoi = this.markerMap.get(marker);
    this.poi = await this.oileain.getIslandById(shortPoi.safeName);
    if (this.islandMap) {
      this.islandMap.addPopup('Islands', this.poi.name, this.poi.coordinates.geo);
      this.islandMap.moveTo(15, this.poi.coordinates.geo);
      this.islandMap.invalidateSize();
      this.poiSelected = true;
    }
  }

  populateCoast(coast: Coast) {
    let group = L.layerGroup([]);
    coast.pois.forEach(poi => {
      let marker = L.marker([poi.coordinates.geo.lat, poi.coordinates.geo.long]);
      this.markerMap.set(marker, poi);
      var newpopup = L.popup({
        autoClose: true,
        closeOnClick: false
      }).setContent(`${poi.name}`);
      marker.bindPopup(newpopup);
      marker.addTo(group);
      marker.addTo(group).on('popupopen', event => {
        this.onClick(event);
      });
    });

    this.mainMap.addLayer(coast.title, group);
    this.mainMap.control.addOverlay(group, coast.title);
  }

  populateCoasts(coasts: Array<Coast>) {
    if (this.mainMap && !this.populated) {
      this.populated = true;
      coasts.forEach(coast => {
        this.populateCoast(coast);
      });
      this.mainMap.invalidateSize();
    }
  }

  async activate(params) {
    this.coasts = await this.oileain.getCoasts();
  }

  attached() {
    this.mainMap = new LeafletMap(this.mainMapDescriptor);
    this.islandMap = new LeafletMap(this.islandMapDescriptor);
    if (this.coasts) {
      this.populateCoasts(this.coasts);
    }
  }
}
