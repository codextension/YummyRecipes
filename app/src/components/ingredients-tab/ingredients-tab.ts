import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { RecipeEntity } from "../../entities/recipe-entity";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "ingredients-tab",
  templateUrl: "ingredients-tab.html"
})
export class IngredientsTabComponent {
  public entity: RecipeEntity;

  constructor(params: NavParams, private sanitizer: DomSanitizer) {
    this.entity = params.data;
  }

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
}
