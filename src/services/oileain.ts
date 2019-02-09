import { inject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { Coast, PointOfInterest } from "./poi";
import { HttpClient } from "aurelia-fetch-client";

@inject(EventAggregator, HttpClient)
export class Oileain {
  isRequesting = false;
  coasts: any[];
  ea: EventAggregator;
  http: HttpClient;
  islandMap = new Map<string, PointOfInterest>();
  coastMap = new Map<string, Coast>();

  constructor(ea, http) {
    this.ea = ea;
    this.http = http;
  }

  getCoasts() {
    if (this.coasts) {
      return new Promise((resolve, reject) => {
        resolve(this.coasts);
      });
    } else {
      this.isRequesting = true;
      return (
        this.http
          .fetch("https://edeleastar.github.io/oileain-api/all-slim.json")
          .then(response => response.json())
          .then(coasts => {
            this.coasts = coasts;
            this.createIndexes();
            this.isRequesting = false;
            return coasts;
          })
      );
    }
  }
  k;

  getIsland(poi: PointOfInterest) {
    let cachedPoi = this.islandMap.get(poi.safeName);
    if (cachedPoi.description) {
      return new Promise((resolve, reject) => {
        resolve(cachedPoi);
      });
    } else {
      const path = `https://edeleastar.github.io/oileain-api/${
        poi.coast.variable
      }/${poi.safeName}.json`;
      return this.http
        .fetch(path)
        .then(response => response.json())
        .then(island => {
          this.islandMap.set(poi.safeName, island);
          return island;
        });
    }
  }

  createIndexes() {
    this.coasts.forEach(coast => {
      this.coastMap.set(coast.variable, coast);
      coast.pois.forEach(poi => {
        poi.coast = coast;
        this.islandMap.set(poi.safeName, poi);
      });
    });
  }
}
