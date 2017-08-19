import { Component } from '@angular/core';

/**
 * Generated class for the RecipeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'recipe',
  templateUrl: 'recipe.html'
})
export class RecipeComponent {

  text: string;

  constructor() {
    console.log('Hello RecipeComponent Component');
    this.text = 'Hello World';
  }

}
