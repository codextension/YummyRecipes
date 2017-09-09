import { Component } from "@angular/core";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ImagesService } from "../../services/images.service";
import { RecipeEntity } from "../../entities/recipe-entity";
import { CameraPopoverComponent } from "../../components/camera-popover/camera-popover";

@Component({
  selector: "page-recipe-management",
  templateUrl: "recipe-management.html",
  providers: [ImagesService]
})
export class RecipeManagementPage {
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
    private popoverCtrl: PopoverController,
    private imagesService: ImagesService
  ) {
    this.recipe = this.navParams.get("entity");
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

  presentPopover(event) {
    let popover = this.popoverCtrl.create(CameraPopoverComponent);
    popover.present({ ev: event });
  }
}
