import { Component } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ImagesService } from "../../services/images.service";
import { NavParams, ViewController } from "ionic-angular";
import { RecipeEntity } from "../../entities/recipe-entity";

@Component({
  selector: "camera-popover",
  providers: [ImagesService],
  templateUrl: "camera-popover.html"
})
export class CameraPopoverComponent {
  private recipe: RecipeEntity;

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
    private camera: Camera,
    private imagesService: ImagesService,
    private navParams: NavParams,
    public view: ViewController
  ) {
    this.recipe = navParams.data.recipe;
  }
  public makeScreenshot() {
    this.camera.getPicture(this.cameraOptions).then(
      imageData => {
        this.imagesService.save(imageData).then(res => {
          this.recipe.imageUrl = res;
        });
      },
      err => {
        // Handle error
      }
    );
    this.view.dismiss(null);
  }

  public uploadFromLibrary() {
    this.camera.getPicture(this.fileOptions).then(
      imageData => {
        this.imagesService.save(imageData).then(res => {
          this.recipe.imageUrl = res;
        });
      },
      err => {
        // Handle error
      }
    );
    this.view.dismiss(null);
  }
}
