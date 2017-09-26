import {Component} from "@angular/core";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {NavParams, Platform, ViewController} from "ionic-angular";
import {RecipeEntity} from "../../entities/recipe-entity";
import {ImagesService} from "../../services/images.service";

@Component({
    selector: "camera-popover",
    templateUrl: "camera-popover.html",
    providers: [ImagesService]
})
export class CameraPopoverComponent {
    private recipe: RecipeEntity;

    private cameraOptions: CameraOptions = {
        quality: 60,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.FILE_URI,
        cameraDirection: this.camera.Direction.BACK
    };

    private fileOptions: CameraOptions = {
        quality: 60,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,
        cameraDirection: this.camera.Direction.BACK
    };

    constructor(private camera: Camera,
                private navParams: NavParams,
                public view: ViewController,
                public platform: Platform,
                private imageService: ImagesService) {
        this.recipe = navParams.data.recipe;
    }

    public makeScreenshot() {
        this.camera.getPicture(this.cameraOptions).then(
            imageData => {
                this.view.dismiss(imageData);
            },
            err => {
                this.view.dismiss(null);
            }
        );
    }

    public uploadFromLibrary() {
        this.camera.getPicture(this.fileOptions).then(
            imageData => {
                this.view.dismiss(imageData);
            },
            err => {
                this.view.dismiss(null);
            }
        );
    }

    public uploadFromBrowser(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            this.imageService
                .upload(file)
                .then(imageData => {
                    this.view.dismiss(imageData);
                })
                .catch(err => {
                    this.view.dismiss(null);
                });
        }
    }

    public clearImage() {
        this.view.dismiss("assets/imgs/no_image.jpg");
    }
}
