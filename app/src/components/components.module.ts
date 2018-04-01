import {NgModule} from "@angular/core";
import {IonicModule} from "ionic-angular";
import {HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {RecipePreviewComponent} from "./recipe-preview/recipe-preview";
import {CameraPopoverComponent} from "./camera-popover/camera-popover";
import {DirectivesModule} from "../directives/directives.module";
import {PipesModule} from "../pipes/pipes.module";

@NgModule({
    declarations: [RecipePreviewComponent, CameraPopoverComponent],
    imports: [
        PipesModule,
        IonicModule,
        HttpClientModule,
        DirectivesModule,
        HttpClientJsonpModule
    ],
    entryComponents: [CameraPopoverComponent],
    exports: [RecipePreviewComponent, CameraPopoverComponent]
})
export class ComponentsModule {
}
