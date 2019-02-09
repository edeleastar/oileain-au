import { Oileain } from '../../services/oileain';
import { inject } from 'aurelia-framework';
import { Coast } from '../../services/poi';

@inject(Oileain)
export class OileainSidebar {
  title: string;
  coasts: Array<Coast>;

  constructor(private oileain: Oileain) {
    this.title = 'Islands';
    this.loadCoasts();
  }

  async loadCoasts() {
    this.coasts = await this.oileain.getCoasts();
  }
}
