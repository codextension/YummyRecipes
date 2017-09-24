import { Component, Input, Output, EventEmitter } from "@angular/core";
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
  @Output() onDeleted: EventEmitter<RecipeEntity> = new EventEmitter();
  @Output() onFavToggle: EventEmitter<RecipeEntity> = new EventEmitter();
  @Output() onClick: EventEmitter<RecipeEntity> = new EventEmitter();

  public showDeleteOption: boolean;

  constructor(
    public navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private haptic: Haptic,
    private deviceFeedback: DeviceFeedback,
    private socialSharing: SocialSharing
  ) {
    this.showDeleteOption = false;
  }

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  showDetailedRecipe() {
    this.onClick.emit(this.entity);
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

  toggleFavourite() {
    this.onFavToggle.emit(this.entity);
  }

  displayDeleteOption() {
    this.haptic.selection(); //iOs
    this.deviceFeedback.haptic(1); // Android
    this.showDeleteOption = true;
  }

  delete() {
    this.showDeleteOption = false;
    this.onDeleted.emit(this.entity);
  }

  cancel() {
    this.showDeleteOption = false;
  }
}
