import { Component, Input } from "@angular/core";
import { NavController } from "ionic-angular";
import { RecipeEntity } from "../../entities/recipe-entity";
import { RecipeManagementPage } from "../../pages/recipe-management/recipe-management";

@Component({
  selector: "recipe-preview",
  templateUrl: "recipe-preview.html"
})
export class RecipePreviewComponent {
  @Input() entity: RecipeEntity;

  constructor(public navCtrl: NavController) {
    this.entity = new RecipeEntity(
      "",
      "",
      90,
      "",
      true,
      [],
      [],
      [],
      "assets/imgs/falafel.jpg"
    );
  }

  showDetails(e: MouseEvent) {
    e.srcElement;
  }

  showDetailedRecipe() {
    this.navCtrl.push(RecipeManagementPage, { entity: this.entity });
  }

  toggleFavourite() {
    this.entity.favourite = !this.entity.favourite;
  }

  formatTime(minutes: number): string {
    let min = minutes % 60;
    let hr = Math.floor(minutes / 60);
    if (hr == 0) {
      return min + " min";
    }
    return hr + " h:" + min + " min";
  }
}
