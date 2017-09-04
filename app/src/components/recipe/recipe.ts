import { Component, Input } from "@angular/core";
import { RecipeEntity } from "../../entities/recipe-entity";
import { PreperationTabComponent } from "../preperation-tab/preperation-tab";
import { IngredientsTabComponent } from "../ingredients-tab/ingredients-tab";
import { SummaryTabComponent } from "../summary-tab/summary-tab";

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
  public summaryTab = SummaryTabComponent;
  public ingredientsTab = IngredientsTabComponent;
  public preperationTab = PreperationTabComponent;

  @Input() entity: RecipeEntity;

  constructor() {}
}
