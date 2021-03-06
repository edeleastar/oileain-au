import * as L from 'leaflet';
import Map = L.Map;
import Layer = L.Layer;
import LayersObject = L.Control.LayersObject;
import {Coast, Geodetic} from './poi';
import LayerGroup = L.LayerGroup;
import LayerControl = L.Control.Layers;
import {mapConfig} from '../../map-config';

export interface LeafletMapDescriptor {
  id: string;
  height: number;
  location: Geodetic;
  zoom: number;
  minZoom: number;
  activeLayer: string;
}

export class LeafletMap {
  imap: Map;
  populated = false;
  control: LayerControl;
  overlays: LayersObject = {};
  mbAttr = `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
            <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>`;

  mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapConfig.leafletKey;
  //mbUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  baseLayers = {
    Terrain: L.tileLayer(this.mbUrl, {
      id: 'mapbox.outdoors',
      attribution: this.mbAttr
    }),
    Satellite: L.tileLayer(this.mbUrl, {
      id: 'mapbox.satellite',
      attribution: this.mbAttr
    }),
    Pencil: L.tileLayer(this.mbUrl, {
      id: 'mapbox.pencil',
      attribution: this.mbAttr
    }),
    HighContrast: L.tileLayer(this.mbUrl, {
      id: 'mapbox.high-contrast',
      attribution: this.mbAttr
    }),
    RunBikeHike: L.tileLayer(this.mbUrl, {
      id: 'mapbox.run-bike-hike',
      attribution: this.mbAttr
    })
  };

  constructor(descriptor: LeafletMapDescriptor) {
    let defaultLayer = this.baseLayers.Terrain;
    if (descriptor.activeLayer) {
      defaultLayer = this.baseLayers[descriptor.activeLayer];
    }
    this.imap = L.map(descriptor.id, {
      center: [descriptor.location.lat, descriptor.location.long],
      zoom: descriptor.zoom,
      minZoom: descriptor.minZoom,
      layers: [defaultLayer]
    });
    this.addControl();
  }

  addLayer(title: string, layer: Layer) {
    this.overlays[title] = layer;
    this.imap.addLayer(layer);
  }

  addLayerGroup(title: string) {
    this.overlays[title] = L.layerGroup([]);
    this.imap.addLayer(this.overlays[title]);
  }

  addControl() {
    this.control = L.control.layers(this.baseLayers, this.overlays).addTo(this.imap);
  }

  moveTo(zoom: number, location: Geodetic) {
    this.imap.setZoom(zoom);
    this.imap.panTo(new L.LatLng(location.lat, location.long));
  }

  zoomTo(location: Geodetic) {
    this.imap.setView(new L.LatLng(location.lat, location.long), 8);
  }

  addPopup(layerTitle: string, content: string, location: Geodetic) {
    let popupGroup: LayerGroup;
    if (!this.overlays[layerTitle]) {
      popupGroup = L.layerGroup([]);
      this.overlays[layerTitle] = popupGroup;
      this.imap.addLayer(popupGroup);
    } else {
      popupGroup = this.overlays[layerTitle] as LayerGroup;
    }
    const popup = L.popup({
      closeOnClick: false,
      closeButton: false
    })
      .setLatLng({lat: location.lat, lng: location.long})
      .setContent(content);
    popup.addTo(popupGroup);
  }

  invalidateSize() {
    this.imap.invalidateSize();
    let hiddenMethodMap = this.imap as any;
    hiddenMethodMap._onResize();
  }
}
