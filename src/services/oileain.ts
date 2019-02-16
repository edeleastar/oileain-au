import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import {Coast, PointOfInterest, Region} from './poi';
import { HttpClient } from 'aurelia-fetch-client';

@inject(EventAggregator, HttpClient)
export class Oileain {
  isRequesting = false;
  coasts: any[];
  regions : any[];
  ea: EventAggregator;
  http: HttpClient;
  islandMap = new Map<string, PointOfInterest>();
  coastMap = new Map<string, Coast>();
  regionMap = new Map<string, Region>();

  constructor(ea, http) {
    this.ea = ea;
    this.http = http;
  }

  async getCoasts() {
    if (!this.coasts) {
      const response = await this.http.fetch('https://edeleastar.github.io/oileain-api/all-slim.json');
      this.coasts = await response.json();
      this.createIndexes();
    }
    return this.coasts;
  }

  async getRegions() {
    if (!this.regions) {
      const response = await this.http.fetch('https://edeleastar.github.io/oileain/regions.json');
      this.regions = await response.json();
      this.regions.forEach(region=>{
        this.regionMap.set(region.id, region);
      });
    }
    return this.regions;
  }

  async getIslandById(id: string) {
    return await this.getIsland(this.islandMap.get(id));
  }

  async getIsland(poi: PointOfInterest) {
    let cachedPoi = this.islandMap.get(poi.safeName);
    if (cachedPoi.description) {
      return cachedPoi;
    } else {
      const path = `https://edeleastar.github.io/oileain-api/${poi.coast.variable}/${poi.safeName}.json`;
      const response = await this.http.fetch(path);
      const island = await response.json();
      this.islandMap.set(poi.safeName, island);
      return island;
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
