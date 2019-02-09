import { bindable } from 'aurelia-framework';
import {PointOfInterest} from '../../services/poi';

export class  PoiDescription {
  @bindable poi: PointOfInterest;
}
