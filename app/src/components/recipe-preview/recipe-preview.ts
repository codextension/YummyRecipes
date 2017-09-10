import { Component, Input } from "@angular/core";
import { NavController } from "ionic-angular";
import { RecipeEntity } from "../../entities/recipe-entity";
import { RecipeManagementPage } from "../../pages/recipe-management/recipe-management";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "recipe-preview",
  templateUrl: "recipe-preview.html"
})
export class RecipePreviewComponent {
  @Input() entity: RecipeEntity;

  constructor(public navCtrl: NavController, private sanitizer: DomSanitizer) {}

  showDetails(e: MouseEvent) {
    e.srcElement;
  }

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  showDetailedRecipe() {
    this.navCtrl.push(RecipeManagementPage, { entity: this.entity });
  }

  toggleFavourite() {
    this.entity.favourite = !this.entity.favourite;
  }
}
