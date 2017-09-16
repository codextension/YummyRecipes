import { Component, Input } from "@angular/core";
import { NavController, Haptic } from "ionic-angular";
import { RecipeEntity } from "../../entities/recipe-entity";
import { RecipeManagementPage } from "../../pages/recipe-management/recipe-management";
import { DomSanitizer } from "@angular/platform-browser";
import { DeviceFeedback } from "@ionic-native/device-feedback";
import { SocialSharing } from "@ionic-native/social-sharing";
@Component({
  selector: "recipe-preview",
  templateUrl: "recipe-preview.html"
})
export class RecipePreviewComponent {
  @Input() entity: RecipeEntity;

  constructor(
    public navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private haptic: Haptic,
    private deviceFeedback: DeviceFeedback,
    private socialSharing: SocialSharing
  ) {}

  showDetails(e: MouseEvent) {
    e.srcElement;
  }

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  showDetailedRecipe() {
    this.haptic.selection(); //iOs
    this.deviceFeedback.haptic(1); // Android
    this.navCtrl.push(RecipeManagementPage, { entity: this.entity });
  }

  toggleFavourite() {
    this.entity.favourite = !this.entity.favourite;
  }

  share(recipe: RecipeEntity) {
    this.socialSharing
      .share(recipe.toString(), "Recipe: " + recipe.name)
      .then(() => {
        console.info("successfully shared");
      })
      .catch(() => {
        console.error("cannot share this recipe, i keep it a secret");
      });
  }
}
