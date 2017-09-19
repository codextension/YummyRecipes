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
  public foundRecipes: RecipeEntity[];
  private pageNumber: number = 0;
  public scrollEnabled: boolean;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private neo4jService: Neo4JService
  ) {
    this.scrollEnabled = true;
    this.showSearchbar = false;
  }

  ionViewDidLoad() {
    this.neo4jService.findRecipes(0).then(recipes => {
      this.foundRecipes = recipes;
    });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.neo4jService.findRecipes(0).then(recipes => {
        this.foundRecipes = recipes;
        this.scrollEnabled = true;
      });
      refresher.complete();
    }, 500);
  }

  toggleSearchbar(event) {
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
      false,
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
      this.neo4jService.findRecipes(++this.pageNumber).then(recipes => {
        if (recipes.length == 0) {
          this.scrollEnabled = false;
        } else {
          this.foundRecipes = recipes;
        }
        event.complete();
      });
    }, 500);
  }
}
