import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  NavParams,
  LoadingController,
  Loading,
  Events
} from "ionic-angular";
import { Neo4JService } from "../../services/neo4j.service";
import { RecipeManagementPage } from "../recipe-management/recipe-management";
import { RecipeEntity } from "../../entities/recipe-entity";
import { TranslateService } from "@ngx-translate/core";

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
  private queryParam: any;
  private PLEASE_WAIT: string;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    public alertCtrl: AlertController,
    private neo4jService: Neo4JService,
    private translate: TranslateService,
    public loadingController: LoadingController,
    public events: Events
  ) {
    this.scrollEnabled = true;
    this.showSearchbar = false;
    this.queryParam = this.navParams.get("favourites");

    events.subscribe("recipe:saved", (recipe: RecipeEntity) => {
      if (this.foundRecipes != null && this.foundRecipes.length > 0) {
        let index: number = this.foundRecipes.findIndex(
          (value: RecipeEntity, index: number, array: RecipeEntity[]) => {
            return recipe.id == array[index].id;
          },
          recipe
        );
        if (index > -1) {
          this.foundRecipes[index] = recipe;
        } else {
          this.foundRecipes.push(recipe);
        }
      } else {
        this.foundRecipes = [];
        this.foundRecipes.push(recipe);
      }
    });

    this.translate.get("PLEASE_WAIT").subscribe(value => {
      this.PLEASE_WAIT = value;
    });
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.reload();
      console.log("reloading...");
    });
  }

  private createLoadingScreen(): Loading {
    let loadingScreen: Loading = this.loadingController.create();
    loadingScreen.setContent(this.PLEASE_WAIT);
    loadingScreen.present();

    return loadingScreen;
  }

  reload() {
    let loadingScreen: Loading = this.createLoadingScreen();
    this.neo4jService
      .findRecipes(0, this.queryParam)
      .then(recipes => {
        this.foundRecipes = recipes;
        loadingScreen.dismiss();
      })
      .catch(err => {
        loadingScreen.dismiss();
      });
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.neo4jService.findRecipes(0, this.queryParam).then(recipes => {
        this.foundRecipes = recipes;
        this.scrollEnabled = true;
        refresher.complete();
      });
    }, 100);
  }

  toggleSearchbar(event) {
    this.foundRecipes = null;
    this.showSearchbar = !this.showSearchbar;
    if (!this.showSearchbar) {
      this.queryParam = null;
      this.neo4jService.findRecipes(0, this.queryParam).then(recipes => {
        this.foundRecipes = recipes;
      });
    }
  }

  findRecipes(e: any) {
    var val = e.target.value;
    if (val && val.trim() != "" && val.length > 2) {
      this.queryParam = val;
      let loadingScreen: Loading = this.createLoadingScreen();
      this.neo4jService.findRecipes(0, this.queryParam).then(recipes => {
        this.foundRecipes = recipes;
        loadingScreen.dismiss();
      });
    }
  }

  newRecipe() {
    let recipe: RecipeEntity;
    recipe = new RecipeEntity(
      this.uuidv4(),
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
    this.navCtrl.push(RecipeManagementPage, { entity: recipe, editMode: true });
  }

  poll(event) {
    setTimeout(() => {
      this.neo4jService
        .findRecipes(++this.pageNumber, this.queryParam)
        .then(recipes => {
          if (recipes.length == 0) {
            this.scrollEnabled = false;
          } else {
            this.foundRecipes = recipes;
          }
          event.complete();
        })
        .catch(err => {
          event.complete();
        });
    }, 100);
  }

  private uuidv4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  onDelete(recipe: RecipeEntity) {
    this.neo4jService
      .deleteRecipe(recipe)
      .then(deleted => {
        let index: number = this.foundRecipes.findIndex(
          (value: RecipeEntity, index: number, array: RecipeEntity[]) => {
            return recipe.id == array[index].id;
          },
          recipe
        );
        if (index > -1) {
          this.foundRecipes.splice(index, 1);
        }
      })
      .catch(err => {
        console.warn(err);
      });
  }

  favouriteToggle(entity: RecipeEntity) {
    this.neo4jService.setFavourite(entity.id, !entity.favourite).then(v => {
      entity.favourite = v;
    });
  }
}
