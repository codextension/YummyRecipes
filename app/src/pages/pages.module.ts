import {NgModule} from "@angular/core";
import {IonicModule} from "ionic-angular";
import {HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
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
        HttpClientModule,
        ComponentsModule,
        HttpClientJsonpModule
    ],
    entryComponents: [HomePage, SettingsPage, RecipeManagementPage],
    exports: [HomePage, SettingsPage, RecipeManagementPage]
})
export class PagesModule {
}

