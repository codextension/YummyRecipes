import {NgModule} from "@angular/core";
import {IonicModule} from "ionic-angular";
import {Http, HttpModule, JsonpModule} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "../app/http-loader";
import {RecipePreviewComponent} from "./recipe-preview/recipe-preview";
import {CameraPopoverComponent} from "./camera-popover/camera-popover";
import {DirectivesModule} from "../directives/directives.module";
import {PipesModule} from "../pipes/pipes.module";

@NgModule({
    declarations: [RecipePreviewComponent, CameraPopoverComponent],
    imports: [
        PipesModule,
        IonicModule,
        HttpModule,
        DirectivesModule,
        JsonpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [Http]
            }
        })
    ],
    entryComponents: [CameraPopoverComponent],
    exports: [RecipePreviewComponent, CameraPopoverComponent]
})
export class ComponentsModule {
}

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
