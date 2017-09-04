import { NgModule } from "@angular/core";
import { RecipeComponent } from "./recipe/recipe";
import { IonicModule } from "ionic-angular";
import { HttpModule, Http, JsonpModule } from "@angular/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "../app/http-loader";
import { RecipePreviewComponent } from "./recipe-preview/recipe-preview";
import { SummaryTabComponent } from "./summary-tab/summary-tab";
import { IngredientsTabComponent } from "./ingredients-tab/ingredients-tab";
import { PreperationTabComponent } from "./preperation-tab/preperation-tab";

@NgModule({
  declarations: [
    RecipeComponent,
    RecipePreviewComponent,
    SummaryTabComponent,
    IngredientsTabComponent,
    PreperationTabComponent
  ],
  imports: [
    IonicModule,
    HttpModule,
    JsonpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    })
  ],
  entryComponents: [
    SummaryTabComponent,
    IngredientsTabComponent,
    PreperationTabComponent
  ],
  exports: [
    RecipeComponent,
    RecipePreviewComponent,
    SummaryTabComponent,
    IngredientsTabComponent,
    PreperationTabComponent
  ]
})
export class ComponentsModule {}

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
