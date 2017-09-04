import { Component, Input } from "@angular/core";
import { RecipeEntity } from "../../entities/recipe-entity";

@Component({
  selector: "recipe-preview",
  templateUrl: "recipe-preview.html"
})
export class RecipePreviewComponent {
  @Input() entity: RecipeEntity;

  constructor() {}

  showDetails(e: MouseEvent) {
    e.srcElement;
  }
}
