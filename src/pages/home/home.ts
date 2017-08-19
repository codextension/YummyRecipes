import { Component } from "@angular/core";
import { NavController, AlertController } from "ionic-angular";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  public showSearchbar: boolean;
  public foundRecipes: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController
  ) {
    this.showSearchbar = false;
  }

  toggleSearchbar() {
    this.foundRecipes = null;
    this.showSearchbar = !this.showSearchbar;
  }

  findRecipes(ev: any) {
    var val = ev.target.value;
    if (val && val.trim() != "") {
      this.foundRecipes = ["Falafel", "Baba Ghannouj"];
    } else {
      this.foundRecipes = null;
    }
  }

  tapEvent(e: Event) {
    this.showSearchbar = false;
  }
}
