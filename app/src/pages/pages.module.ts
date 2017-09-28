import {NgModule} from "@angular/core";
import {IonicModule} from "ionic-angular";
import {Http, HttpModule, JsonpModule} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "../app/http-loader";
import {PipesModule} from "../pipes/pipes.module";
import {DirectivesModule} from "../directives/directives.module";
import {HomePage} from "./home/home";
import {SettingsPage} from "./settings/settings";
import {RecipeManagementPage} from "./recipe-management/recipe-management";
import {ComponentsModule} from "../components/components.module";

@NgModule({
    declarations: [HomePage, SettingsPage, RecipeManagementPage],
    imports: [
        PipesModule,
        DirectivesModule,
        IonicModule,
        HttpModule,
        ComponentsModule,
        JsonpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [Http]
            }
        })
    ],
    entryComponents: [HomePage, SettingsPage, RecipeManagementPage],
    exports: [HomePage, SettingsPage, RecipeManagementPage]
})
export class PagesModule {
}

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
