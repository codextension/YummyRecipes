import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { TranslateService } from "@ngx-translate/core";

import { HomePage } from "../pages/home/home";
import { FavouritesPage } from "../pages/favourites/favourites";
import { SettingsPage } from "../pages/settings/settings";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string; icon: string; component: any }>;

  constructor(
    private platform: Platform,
    private translate: TranslateService,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();
    this.translate.setDefaultLang("en");
    this.translate.use(window.navigator.language);
    // used for an example of ngFor and navigation
    this.pages = [
      { title: "HOME", icon: "home", component: HomePage },
      { title: "FAVOURITE", icon: "heart", component: FavouritesPage },
      { title: "SETTINGS", icon: "settings", component: SettingsPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.nav.setRoot(HomePage);
    });
  }

  openPage(page) {
    if (page.component == HomePage) {
      this.nav.setRoot(page.component);
    } else {
      this.nav.push(page.component);
    }
  }
}
