import { Component, Input } from "@angular/core";
import { RecipeEntity } from "../../entities/recipe-entity";

/**
 * Generated class for the RecipeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: "recipe",
  templateUrl: "recipe.html"
})
export class RecipeComponent {
  @Input() entity: RecipeEntity;

  constructor() {
    console.log("Hello RecipeComponent Component");
  }

  showDetails(e: MouseEvent) {
    e.srcElement;
  }
}
