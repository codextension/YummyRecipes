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
    this.showSearchbar = !this.showSearchbar;
  }

  findRecipes(ev: any) {
    var val = ev.target.value;
    if (val && val.trim() != "") {
      this.foundRecipes = ["Falafel"];
    } else {
      this.foundRecipes = null;
    }
  }
}
