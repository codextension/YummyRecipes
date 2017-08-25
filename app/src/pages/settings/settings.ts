import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Storage } from "@ionic/storage";
/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage
  ) {
    // set a key/aeluv;
    this.storage.set("name", "Max");

    // Or to get a key/value pair
    this.storage.get("name").then(val => {
      console.log("Your name is", val);
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SettingsPage");
  }

  back() {
    return this.navCtrl.getPrevious();
  }
}
