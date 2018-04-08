import {NgModule} from "@angular/core";
import {IonicModule} from "ionic-angular";
import {HttpClient, HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
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
        HttpClientModule,
        DirectivesModule,
        HttpClientJsonpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    entryComponents: [CameraPopoverComponent],
    exports: [RecipePreviewComponent, CameraPopoverComponent]
})
export class ComponentsModule {
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
