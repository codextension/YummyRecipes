import {
  Component,
  ViewChild,
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/core";
import {
  NavController,
  NavParams,
  PopoverController,
  Popover,
  Content,
  Haptic
} from "ionic-angular";
import { RecipeEntity } from "../../entities/recipe-entity";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { CameraPopoverComponent } from "../../components/camera-popover/camera-popover";
import { DomSanitizer } from "@angular/platform-browser";
import { DeviceFeedback } from "@ionic-native/device-feedback";
import { ImagesService } from "../../services/images.service";
import { Neo4JService } from "../../services/neo4j.service";

@Component({
  selector: "page-recipe-management",
  templateUrl: "recipe-management.html",
  providers: [ImagesService, Neo4JService],
  animations: [
    trigger("resizeImg", [
      state(
        "shrink",
        style({
          "padding-bottom": "100px"
        })
      ),
      state(
        "expand",
        style({
          "padding-bottom": "100vh"
        })
      ),
      transition("shrink => expand", animate("300ms ease-in")),
      transition("expand => shrink", animate("300ms ease-out"))
    ])
  ]
})
export class RecipeManagementPage {
  public recipe: RecipeEntity;
  public imgState: string;
  public editMode: boolean;
  public inputMode: boolean;
  public inputRef: string;
  public recipeContent: string;
  public recipeForm: FormGroup;

  private actionMode: EditModeType;
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  private popover: Popover;

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private sanitizer: DomSanitizer,
    private haptic: Haptic,
    private deviceFeedback: DeviceFeedback,
    private formBuilder: FormBuilder,
    private imagesService: ImagesService,
    private neo4jService: Neo4JService
  ) {
    this.recipeContent = "ingredients";
    this.recipe = this.navParams.get("entity");
    this.imgState = "shrink";
    this.inputMode = false;
    this.editMode = this.recipe.id == null;

    this.popover = this.popoverCtrl.create(CameraPopoverComponent, {
      recipe: this.recipe
    });

    this.popover.onDidDismiss((data, role) => {
      if (data != null) {
        this.recipe.imageUrl = data;
      }
    });
  }

  ionViewDidLoad() {}

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  presentPopover(event) {
    this.popover.present({ ev: event });
  }

  toggleMode(mode: boolean) {
    this.inputMode = mode;
    this.haptic.selection(); //iOs
    this.deviceFeedback.haptic(1); // Android
  }

  showInput(item: any, input: string, mode: EditModeType) {
    this.toggleMode(true);
    this.inputRef = input;
    this.actionMode = mode;

    switch (input) {
      case "name": {
        this.recipeForm = this.formBuilder.group({
          name: [item, Validators.required]
        });
        break;
      }
      case "duration": {
        this.recipeForm = this.formBuilder.group({
          duration: [item, Validators.required]
        });
        break;
      }
      case "servings": {
        this.recipeForm = this.formBuilder.group({
          servings: [item, Validators.required]
        });
        break;
      }
      case "ingredients": {
        this.recipeForm = this.formBuilder.group({
          name: [item.name, Validators.required],
          quantity: [item.quantity],
          unit: [item.unit],
          id: [item.id == null ? new Date().getTime() : item.id]
        });
        break;
      }
      case "instructions": {
        this.recipeForm = this.formBuilder.group({
          order: [item[1]],
          description: [item[0], Validators.required]
        });
        break;
      }
    }
  }

  edit() {
    this.haptic.selection(); //iOs
    this.deviceFeedback.haptic(1);

    this.editMode = !this.editMode;
  }

  save() {
    this.editMode = false;
    this.toggleMode(false);

    if (
      this.recipe.imageUrl.indexOf("no_image.jpg") > -1 ||
      this.recipe.imageUrl.startsWith("http")
    ) {
      this.neo4jService.saveRecipe(this.recipe).then(v => {
        this.recipe.id = v;
      });
    } else {
      this.imagesService.save(this.recipe.imageUrl).then(res => {
        this.recipe.imageUrl = res;
        this.neo4jService.saveRecipe(this.recipe).then(v => {
          this.recipe.id = v;
        });
      });
    }
  }

  apply(inputRef: string, form: any) {
    if (inputRef == "name") {
      this.recipe.name = form.name;
    } else if (inputRef == "duration") {
      this.recipe.duration = form.duration;
    } else if (inputRef == "servings") {
      this.recipe.servings = form.servings;
    } else if (inputRef == "ingredients") {
      if (this.actionMode == EditModeType.UPDATE) {
        let index: number = this.indexOf(this.recipe.ingredients, form.id);
        this.recipe.ingredients[index] = form;
      } else {
        this.recipe.ingredients.push(form);
      }
    } else if (inputRef == "instructions") {
      if (this.actionMode == EditModeType.UPDATE) {
        this.recipe.instructions[form.order] = form.description;
      } else {
        this.recipe.instructions.push(form.description);
      }
    }
    this.toggleMode(false);
  }

  private indexOf(objs: any[], id: number) {
    for (let i = 0; i < objs.length; i++) {
      if (objs[i].id == id) {
        return i;
      }
    }
  }

  delete(item: any, itemType: string) {
    if (itemType == "ingredients") {
      let index: number = this.recipe.ingredients.indexOf(item, 0);
      if (index > -1) {
        this.recipe.ingredients.splice(index, 1);
      }
    } else {
      let index: number = this.recipe.instructions.indexOf(item, 0);
      if (index > -1) {
        this.recipe.instructions.splice(index, 1);
      }
    }
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [
      e.changedTouches[0].pageX,
      e.changedTouches[0].pageY
    ];
    const time = new Date().getTime();

    if (when === "start") {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === "end") {
      const direction = [
        coord[0] - this.swipeCoord[0],
        coord[1] - this.swipeCoord[1]
      ];
      const duration = time - this.swipeTime;

      if (
        duration < 1000 && //Short enough
        Math.abs(direction[0]) < Math.abs(direction[1]) && //Vertical enough
        Math.abs(direction[1]) > 10
      ) {
        //Long enough
        const swipe = direction[1] < 0 ? "up" : "down";

        if (swipe == "up") {
          this.imgState = "shrink";
        } else {
          this.imgState = "expand";
        }
      }
    }
  }
}

enum EditModeType {
  NEW = 1,
  UPDATE
}
