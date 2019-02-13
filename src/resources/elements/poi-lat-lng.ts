import { bindable } from 'aurelia-framework';
import {PointOfInterest} from '../../services/poi';

export class LatLng {
  @bindable poi: PointOfInterest;
}
