import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ImagesService } from "../../services/images.service";

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
  public base64Image: string;
  private options: CameraOptions = {
    quality: 60,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
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
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RecipeManagementPage");
  }

  public makeScreenshot() {
    this.camera.getPicture(this.options).then(
      imageData => {
        this.base64Image = imageData; // "data:image/jpeg;base64," +
        this.imagesService.save(this.base64Image).then(res => {
          console.info(res);
        });
      },
      err => {
        // Handle error
      }
    );
  }
}
