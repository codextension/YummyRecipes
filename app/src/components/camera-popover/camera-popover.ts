import {Component} from "@angular/core";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {NavParams, Platform, ViewController} from "ionic-angular";
import {RecipeEntity} from "../../entities/recipe-entity";

@Component({
    selector: "camera-popover",
    templateUrl: "camera-popover.html"
})
export class CameraPopoverComponent {
    private recipe: RecipeEntity;

    private cameraOptions: CameraOptions = {
        quality: 60,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA,
        correctOrientation: true,
        targetHeight: 1080,
        targetWidth: 1920,
        destinationType: this.camera.DestinationType.FILE_URI,
        cameraDirection: this.camera.Direction.BACK
    };

    private fileOptions: CameraOptions = {
        quality: 60,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        targetHeight: 1080,
        targetWidth: 1920,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,
        cameraDirection: this.camera.Direction.BACK
    };

    constructor(private camera: Camera,
                public navParams: NavParams,
                public view: ViewController,
                public platform: Platform) {
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
            if (!this.isValid(file)) {
                this.view.dismiss(null);
            } else {
                this.view.dismiss(file);
            }
        }
    }

    private isValid(file: File) {
        return file.size < 1000000 && (file.type == "image/jpeg" ||
            file.type == "image/png" ||
            file.type == "image/gif" ||
            file.type == "image/jpg");
    }

    public clearImage() {
        this.view.dismiss("assets/imgs/no_image.jpg");
    }
}
