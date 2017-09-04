import { Component } from '@angular/core';

/**
 * Generated class for the PreperationTabComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'preperation-tab',
  templateUrl: 'preperation-tab.html'
})
export class PreperationTabComponent {

  text: string;

  constructor() {
    console.log('Hello PreperationTabComponent Component');
    this.text = 'Hello World';
  }

}
