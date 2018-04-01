import {Component, ViewChild} from "@angular/core";
import {Nav, Platform} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";

import {HomePage} from "../pages/home/home";
import {SettingsPage} from "../pages/settings/settings";

@Component({
    templateUrl: "app.html"
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = HomePage;

    pages: Array<{ title: string; icon: string; component: any, favourite: boolean }>;

    constructor(private platform: Platform,
                public statusBar: StatusBar,
                public splashScreen: SplashScreen) {
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            {title: "HOME", icon: "home", component: HomePage, favourite: null},
            {title: "FAVOURITE", icon: "heart", component: HomePage, favourite: true},
            {title: "SETTINGS", icon: "settings", component: SettingsPage, favourite: null}
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.backgroundColorByHexString("#bf2608");
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        if (page.component == HomePage) {
            this.nav.setRoot(page.component, {favourites: page.favourite});
        } else {
            this.nav.push(page.component);
        }
    }
}
