import { Component } from "@angular/core";
import { NavController, NavParams, ToastController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

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
  private settingsForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    private translate: TranslateService
  ) {
    this.settingsForm = this.formBuilder.group({
      serverUrl: ["", Validators.required],
      username: [""],
      password: [""]
    });
    this.storage.get("settings").then(val => {
      if (val != null) {
        this.settingsForm = this.formBuilder.group({
          serverUrl: [val.serverUrl, Validators.required],
          username: [val.username],
          password: [val.password]
        });
      }
    });
  }

  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: "top"
    });

    toast.present(toast);
  }

  ionViewDidLoad() {}

  back() {
    return this.navCtrl.getPrevious();
  }

  saveSettings() {
    this.storage
      .set("settings", this.settingsForm.value)
      .then(() => {
        this.translate.get("SETTINGS_SAVED_SUCCESS").subscribe(value => {
          this.showToast(value);
          return this.navCtrl.goToRoot(null);
        });
      })
      .catch(err => {
        this.translate.get("SETTINGS_SAVED_FAILED").subscribe(value => {
          this.showToast(value);
        });
      });
  }
}
