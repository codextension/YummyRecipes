import {
  BrowserModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { IonicStorageModule } from "@ionic/storage";
import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MyApp } from "./app.component";
import { HomePage } from "../pages/home/home";
import { SettingsPage } from "../pages/settings/settings";
import { FavouritesPage } from "../pages/favourites/favourites";
import { RecipeManagementPage } from "../pages/recipe-management/recipe-management";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HttpModule, Http, JsonpModule } from "@angular/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "./http-loader";

import { DirectivesModule } from "../directives/directives.module";
import { ComponentsModule } from "../components/components.module";
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { velocity: 0.4, threshold: 20 } // override default settings
  };
}
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingsPage,
    FavouritesPage,
    RecipeManagementPage
  ],
  imports: [
    HttpModule,
    JsonpModule,
    BrowserModule,
    BrowserAnimationsModule,
    DirectivesModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: "__yr",
      driverOrder: ["indexeddb", "sqlite", "websql"]
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
    FavouritesPage,
    RecipeManagementPage
  ],
  providers: [
    Camera,
    File,
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
