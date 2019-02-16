import { LeafletMap } from '../services/leaflet-map';
import { Coast, PointOfInterest } from '../services/poi';
import { inject } from 'aurelia-framework';
import { Oileain } from '../services/oileain';
import * as L from 'leaflet';
import Marker = L.Marker;
import {CoastalLeafletMap, PoiSelect} from "../services/coastal-leaflet-map";

@inject(Oileain)
export class Navigator implements PoiSelect {
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

  mainMap: CoastalLeafletMap;
  islandMap: LeafletMap;
  coasts: Array<Coast>;
  poi: PointOfInterest;
  poiSelected = false;
  id : string;

  constructor(private oileain: Oileain) {}

  moveToRegion(regionId:string) {
    this.mainMap.moveTo(12, this.oileain.regionMap.get(regionId).location);
  }

  async activate(params) {
    this.coasts = await this.oileain.getCoasts();
    this.id = params.id
    if (this.id && this.mainMap) {
      this.moveToRegion(this.id);
    }
  }

  attached() {
    this.mainMap = new CoastalLeafletMap(this.mainMapDescriptor);
    this.islandMap = new LeafletMap(this.islandMapDescriptor);
    if (this.id) {
      this.moveToRegion(this.id);
      this.id = "";
    }
    if (this.coasts) {
      this.mainMap.populateCoasts(this.coasts, false, this);
    }
  }

  async onSelect(id: string) {
    this.poi = await this.oileain.getIslandById(id);
    if (this.islandMap) {
      this.islandMap.addPopup('Islands', this.poi.name, this.poi.coordinates.geo);
      this.islandMap.moveTo(15, this.poi.coordinates.geo);
      this.islandMap.invalidateSize();
      this.poiSelected = true;
    }
  }
}
