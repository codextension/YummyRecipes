import { Component } from '@angular/core';

/**
 * Generated class for the CameraPopoverComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'camera-popover',
  templateUrl: 'camera-popover.html'
})
export class CameraPopoverComponent {

  text: string;

  constructor() {
    console.log('Hello CameraPopoverComponent Component');
    this.text = 'Hello World';
  }

}
