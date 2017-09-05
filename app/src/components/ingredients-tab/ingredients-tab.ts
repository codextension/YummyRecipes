import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { RecipeEntity } from "../../entities/recipe-entity";

@Component({
  selector: "ingredients-tab",
  templateUrl: "ingredients-tab.html"
})
export class IngredientsTabComponent {
  public entity: RecipeEntity;

  constructor(params: NavParams) {
    this.entity = params.data;
  }
}
