import { Oileain } from '../../services/oileain';
import { inject } from 'aurelia-framework';
import { Region } from '../../services/poi';

@inject(Oileain)
export class RegionsSidebar {
  regions: Array<Region>;

  constructor(private oileain: Oileain) {
    this.loadRegions();
  }

  async loadRegions() {
    this.regions = await this.oileain.getRegions();
  }
}
