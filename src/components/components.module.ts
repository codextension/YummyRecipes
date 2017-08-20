import { NgModule } from "@angular/core";
import { RecipeComponent } from "./recipe/recipe";
import { IonicModule } from "ionic-angular";
import { HttpModule, Http, JsonpModule } from "@angular/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "../app/http-loader";

@NgModule({
  declarations: [RecipeComponent],
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
  exports: [RecipeComponent]
})
export class ComponentsModule {}

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
