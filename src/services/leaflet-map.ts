import * as L from "leaflet";
import Map = L.Map;
import Layer = L.Layer;
import LayersObject = L.Control.LayersObject;
import { Geodetic } from "./poi";
import LayerGroup = L.LayerGroup;
import LayerControl = L.Control.Layers;

export class LeafletMap {
  imap: Map;
  populated = false;
  control: LayerControl;
  overlays: LayersObject = {};
  mbAttr = `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
            <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>`;

  mbUrl =
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw";

  baseLayers = {
    Terrain: L.tileLayer(this.mbUrl, {
      id: "mapbox.outdoors",
      attribution: this.mbAttr
    }),
    Satellite: L.tileLayer(this.mbUrl, {
      id: "mapbox.satellite",
      attribution: this.mbAttr
    })
  };

  constructor(
    id: string,
    location: Geodetic,
    zoom: number,
    minZoom: number,
    activeLayer: string = ""
  ) {
    let defaultLayer = this.baseLayers.Terrain;
    if (activeLayer) {
      defaultLayer = this.baseLayers[activeLayer];
    }
    this.imap = L.map(id, {
      center: [location.lat, location.long],
      zoom: zoom,
      minZoom: minZoom,
      layers: [defaultLayer]
    });
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
    this.control = L.control
      .layers(this.baseLayers, this.overlays)
      .addTo(this.imap);
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
      .setLatLng({ lat: location.lat, lng: location.long })
      .setContent(content);
    popup.addTo(popupGroup);
  }

  invalidateSize() {
    this.imap.invalidateSize();
    //this.imap.fitBounds(this.imap.getBounds());
    let hiddenMethodMap = this.imap as any;
    hiddenMethodMap._onResize();
  }
}
