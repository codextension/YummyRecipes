import { Component, Input, NgZone } from "@angular/core";
import { RecipeEntity } from "../../entities/recipe-entity";

import { DomSanitizer } from "@angular/platform-browser";
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
  @Input() readonly: boolean;
  @Input() showImage: boolean;

  constructor(private sanitizer: DomSanitizer, public zone: NgZone) {}

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
}
