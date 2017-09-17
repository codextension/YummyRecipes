import { Component } from "@angular/core";
import { NavController, AlertController } from "ionic-angular";
import { Neo4JService } from "../../services/neo4j.service";
import { RecipeManagementPage } from "../recipe-management/recipe-management";
import { RecipeEntity } from "../../entities/recipe-entity";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
  providers: [Neo4JService]
})
export class HomePage {
  public showSearchbar: boolean;
  public foundRecipes: any;

  public items: any[] = [];

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private neo4jService: Neo4JService
  ) {
    this.showSearchbar = false;

    for (var i = 1; i <= 5; i++) {
      this.items.push(i);
    }
  }

  doRefresh(refresher) {
    console.log("Begin async operation", refresher);

    setTimeout(() => {
      console.log("Async operation has ended");
      refresher.complete();
    }, 2000);
  }

  toggleSearchbar() {
    this.foundRecipes = null;
    this.showSearchbar = !this.showSearchbar;
  }

  findRecipes(e: any) {
    var val = e.target.value;
    if (val && val.trim() != "") {
      this.neo4jService
        .select(
          "MATCH (x)-[r:INGREDIENT]->(y) where y.name='" + val + "' RETURN x"
        )
        .then(value => {
          console.info(value);
        })
        .catch(err => {
          console.error(err);
        });
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

  newRecipe() {
    let recipe: RecipeEntity;
    recipe = new RecipeEntity(
      0,
      null,
      null,
      null,
      null,
      true,
      [],
      [],
      [],
      "assets/imgs/no_image.jpg",
      null
    );
    this.navCtrl.push(RecipeManagementPage, { entity: recipe });
  }

  poll(event) {
    setTimeout(() => {
      for (var i = 1; i <= 5; i++) {
        this.items.push(i);
      }
      event.complete();
      //event.enable(false);
      //event.enable(shouldEnable)
    }, 500);
  }
}
