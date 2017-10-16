import {Component} from "@angular/core";
import {AlertController, Events, Haptic, NavController, NavParams, Platform} from "ionic-angular";
import {Neo4JService} from "../../services/neo4j.service";
import {RecipeManagementPage} from "../recipe-management/recipe-management";
import {RecipeEntity} from "../../entities/recipe-entity";
import {DeviceFeedback} from "@ionic-native/device-feedback";
import {InternalError} from "../../services/internal-error";

@Component({
    selector: "page-home",
    templateUrl: "home.html",
    providers: [Neo4JService]
})
export class HomePage {
    public showSearchbar: boolean;
    public foundRecipes: RecipeEntity[];
    public scrollEnabled: boolean;
    private pageNumber: number = 0;
    private recipesToLoad:number=5;
    private queryParam: any;
    private error: InternalError;
    public reloading: boolean;

    constructor(public navCtrl: NavController,
                private navParams: NavParams,
                public alertCtrl: AlertController,
                private neo4jService: Neo4JService,
                public events: Events,
                private platform: Platform,
                private haptic: Haptic,
                private deviceFeedback: DeviceFeedback) {
        this.reloading = false;
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
                    this.reload();
                }
            } else {
                this.foundRecipes = [];
                this.foundRecipes.push(recipe);
            }
        });
    }

    ionViewDidLoad() {
        setTimeout(() => {
            this.platform.ready().then((readySource) => {
                let width:number=this.platform.width(); // 415x415
                let height:number=this.platform.height();
                let buffer: number = Math.floor(width / 400) * 2 + 1;
                this.recipesToLoad = Math.ceil((width * height) / (400 * 400) + buffer);
                this.reload();
            }).catch(err=>{
            });
        });
    }

    reload() {
        this.reloading = true;
        this.error = null;

        this.neo4jService
            .findRecipes(0,this.recipesToLoad, this.queryParam)
            .then(recipes => {
                this.foundRecipes = recipes;
                if (this.foundRecipes != null && this.foundRecipes.length < this.recipesToLoad) {
                    this.scrollEnabled = false;
                } else {
                    this.scrollEnabled = true;
                }
                this.reloading = false;
            })
            .catch(err => {
                this.error = err;
                this.foundRecipes = null;
                this.reloading = false;
            });
    }

    doRefresh(refresher) {
        setTimeout(() => {
            this.error = null;
            this.pageNumber = 0;
            this.neo4jService.findRecipes(0,this.recipesToLoad, this.queryParam).then(recipes => {
                this.foundRecipes = recipes;
                if (this.foundRecipes != null && this.foundRecipes.length < this.recipesToLoad) {
                    this.scrollEnabled = false;
                } else {
                    this.scrollEnabled = true;
                }
                refresher.complete();
            }).catch(err => {
                this.error = err;
                this.foundRecipes = null;
                refresher.complete();
            });
        }, 100);
    }

    toggleSearchbar(event) {
        this.foundRecipes = null;
        this.error = null;
        this.showSearchbar = !this.showSearchbar;
        if (!this.showSearchbar) {
            this.queryParam = null;
            this.reloading = true;
            this.neo4jService.findRecipes(0,this.recipesToLoad, this.queryParam).then(recipes => {
                this.foundRecipes = recipes;
                this.reloading = false;
            }).catch(err => {
                this.foundRecipes = null;
                this.error = err;
                this.reloading = false;
            });
        }
    }

    findRecipes(e: any) {
        this.error = null;
        var val = e.target.value;
        if (val && val.trim() != "" && val.length > 2) {
            this.queryParam = val;
            this.reloading = true;
            this.neo4jService.findRecipes(0,this.recipesToLoad, this.queryParam).then(recipes => {
                this.foundRecipes = recipes;
                this.reloading = false;
            }).catch(err => {
                this.error = err;
                this.foundRecipes = null;
                this.reloading = false;
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
        this.navCtrl.push(RecipeManagementPage, {entity: recipe, editMode: true});
    }

    poll(event) {
        setTimeout(() => {
            this.error = null;
            this.neo4jService
                .findRecipes(++this.pageNumber,this.recipesToLoad, this.queryParam)
                .then(recipes => {
                    if (recipes.length == 0) {
                        this.scrollEnabled = false;
                    } else {
                        if (recipes.length < this.recipesToLoad) {
                            this.scrollEnabled = false;
                        }
                        this.foundRecipes = this.foundRecipes.concat(recipes);
                    }
                    event.complete();
                })
                .catch(err => {
                    this.error = err;
                    this.scrollEnabled = false;
                    event.complete();
                });
        }, 100);
    }

    onDelete(recipe: RecipeEntity) {
        this.haptic.selection(); //iOs
        this.deviceFeedback.haptic(1); // Android
        this.error = null;
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
                this.error = err;
                this.foundRecipes = null;
                console.warn(err);
            });
    }

    onClick(recipe: RecipeEntity) {
        this.haptic.selection(); //iOs
        this.deviceFeedback.haptic(1); // Android
        this.navCtrl.push(RecipeManagementPage, {entity: recipe});
    }

    favouriteToggle(event: any) {
        this.haptic.selection(); //iOs
        this.deviceFeedback.haptic(1); // Android
    }

    private uuidv4(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}
