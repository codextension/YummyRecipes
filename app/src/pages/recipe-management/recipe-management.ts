import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ImagesService } from "../../services/images.service";
import { RecipeEntity } from "../../entities/recipe-entity";

/**
 * Generated class for the RecipeManagementPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: "page-recipe-management",
  templateUrl: "recipe-management.html",
  providers: [ImagesService]
})
export class RecipeManagementPage {
  public newRecipe: boolean;
  public detailed: boolean;
  public base64ImageUrl: string;
  public recipe: RecipeEntity;

  private cameraOptions: CameraOptions = {
    quality: 60,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    destinationType: this.camera.DestinationType.DATA_URL,
    cameraDirection: this.camera.Direction.BACK
  };

  private fileOptions: CameraOptions = {
    quality: 60,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    cameraDirection: this.camera.Direction.BACK
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private imagesService: ImagesService
  ) {
    this.newRecipe = this.navParams.get("type");
    this.detailed = this.navParams.get("detailed") || false;

    if (this.newRecipe) {
      this.recipe = new RecipeEntity(null, null, null, false, [], [], null);
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RecipeManagementPage");
  }

  public makeScreenshot() {
    this.camera.getPicture(this.cameraOptions).then(
      imageData => {
        this.imagesService.save(imageData).then(res => {
          this.base64ImageUrl = res;
        });
      },
      err => {
        // Handle error
      }
    );
  }
}
