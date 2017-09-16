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
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { PagesModule } from "../pages/pages.module";
import { HttpModule, Http, JsonpModule } from "@angular/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "./http-loader";
import { DeviceFeedback } from "@ionic-native/device-feedback";
import { PipesModule } from "../pipes/pipes.module";
import { DirectivesModule } from "../directives/directives.module";
import { ComponentsModule } from "../components/components.module";
import { SecureStorage } from "@ionic-native/secure-storage";
import { SocialSharing } from "@ionic-native/social-sharing";

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { velocity: 0.4, threshold: 20 } // override default settings
  };
}
@NgModule({
  declarations: [MyApp],
  imports: [
    HttpModule,
    JsonpModule,
    PagesModule,
    BrowserModule,
    BrowserAnimationsModule,
    DirectivesModule,
    ComponentsModule,
    PipesModule,
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
  entryComponents: [MyApp],
  providers: [
    Camera,
    ScreenOrientation,
    DeviceFeedback,
    SecureStorage,
    SocialSharing,
    File,
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
  constructor(public screenOrientation: ScreenOrientation) {
    screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT).catch(e => {
      console.warn("cannot lock the screen rotation");
    });
  }
}

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
