import { Component } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NavParams } from "ionic-angular";
import { RecipeEntity } from "../../entities/recipe-entity";
/**
 * Generated class for the PreperationTabComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: "preperation-tab",
  templateUrl: "preperation-tab.html"
})
export class PreperationTabComponent {
  public entity: RecipeEntity;

  constructor(params: NavParams, private sanitizer: DomSanitizer) {
    this.entity = params.data;
  }

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
}
