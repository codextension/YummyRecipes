import { Component } from "@angular/core";
import { NavController, AlertController } from "ionic-angular";
import { Neo4JService } from "../../services/neo4j.service";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
  providers: [Neo4JService]
})
export class HomePage {
  public showSearchbar: boolean;
  public foundRecipes: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private neo4jService: Neo4JService
  ) {
    this.showSearchbar = false;
  }

  toggleSearchbar() {
    this.foundRecipes = null;
    this.showSearchbar = !this.showSearchbar;

    /*this.neo4jService
      .select("MATCH (x)-[r:INGREDIENT]->(y) RETURN y.name,r.quantity, r.unit")
      .then(value => {
        console.info(value);
      })
      .catch(err => {
        console.error(err);
      });*/
  }

  findRecipes(e: any) {
    var val = e.target.value;
    if (val && val.trim() != "") {
      this.foundRecipes = ["Falafel", "Baba Ghannouj"];
    } else {
      this.foundRecipes = null;
    }
  }

  tapEvent(e: Event) {
    this.showSearchbar = false;
  }

  showRecipe(e: MouseEvent) {
    e.srcElement;
  }

  showDetails(e: MouseEvent) {
    e.srcElement;
  }
}
