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
  Content,
  Haptic
} from "ionic-angular";
import {
  RecipeEntity,
  Ingredients,
  Instruction
} from "../../entities/recipe-entity";
import { CameraPopoverComponent } from "../../components/camera-popover/camera-popover";
import { DomSanitizer } from "@angular/platform-browser";
import { DeviceFeedback } from "@ionic-native/device-feedback";

@Component({
  selector: "page-recipe-management",
  templateUrl: "recipe-management.html",
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
  public base64ImageUrl: string;
  public recipe: RecipeEntity;
  public imgState: string;
  public editMode: boolean;
  public inputMode: boolean;
  public inputRef: string;
  public recipeContent: string;
  public selectedIngredient: Ingredients;
  public selectedInstruction: Instruction;
  public tempRecipe: RecipeEntity;

  private actionMode: EditModeType;
  private swipeCoord?: [number, number];
  private swipeTime?: number;

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private sanitizer: DomSanitizer,
    private haptic: Haptic,
    private deviceFeedback: DeviceFeedback
  ) {
    this.recipeContent = "ingredients";
    this.recipe = this.navParams.get("entity");
    this.imgState = "shrink";
    this.inputMode = false;
    this.editMode = this.recipe.reference == null;
  }

  ionViewDidLoad() {}

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(CameraPopoverComponent, {
      recipe: this.recipe
    });
    popover.present({ ev: event });
  }

  toggleMode(mode: boolean) {
    this.inputMode = mode;
    this.haptic.selection(); //iOs
    this.deviceFeedback.haptic(1); // Android
  }

  showInput(mode: boolean, input: string) {
    this.toggleMode(mode);
    this.inputRef = input;
    this.tempRecipe = new RecipeEntity(
      0,
      this.recipe.reference,
      this.recipe.name,
      this.recipe.duration,
      this.recipe.description,
      this.recipe.favourite,
      this.recipe.tags,
      this.recipe.instructions,
      this.recipe.ingredients,
      this.recipe.imageUrl,
      this.recipe.servings
    );
  }

  edit(item: any, itemType: string) {
    this.inputRef = itemType;
    this.toggleMode(true);
    this.actionMode = EditModeType.UPDATE;
    if (itemType == "ingredients") {
      this.selectedIngredient = new Ingredients(
        0,
        item.name,
        item.quantity,
        item.unit
      );
    } else {
      this.selectedInstruction = new Instruction(
        0,
        item.orderNb,
        item.description
      );
    }
  }

  add(itemType: string) {
    let item: any;

    if (itemType == "ingredients") {
      item = new Ingredients(0, "", null, "");
    } else {
      item = new Instruction(0, null, "");
    }
    this.edit(item, itemType);

    this.actionMode = EditModeType.NEW;
  }

  saveOrEdit() {
    this.editMode = !this.editMode;
    this.haptic.selection(); //iOs
    this.deviceFeedback.haptic(1);
  }

  apply(inputRef: string) {
    if (inputRef == "name") {
      this.recipe.name = this.tempRecipe.name;
    } else if (inputRef == "duration") {
      this.recipe.duration = this.tempRecipe.duration;
    } else if (inputRef == "servings") {
      this.recipe.servings = this.tempRecipe.servings;
    } else if (inputRef == "ingredients") {
      if (this.actionMode == EditModeType.UPDATE) {
        let index: number = this.indexOf(
          this.recipe.ingredients,
          this.selectedIngredient.id
        );
        this.recipe.ingredients[index] = this.selectedIngredient;
      } else {
        this.recipe.ingredients.push(this.selectedIngredient);
      }
    } else if (inputRef == "instructions") {
      if (this.actionMode == EditModeType.UPDATE) {
        let index: number = this.indexOf(
          this.recipe.instructions,
          this.selectedInstruction.id
        );
        this.recipe.instructions[index] = this.selectedInstruction;
      } else {
        this.selectedInstruction.orderNb = this.recipe.instructions.length + 1;
        this.recipe.instructions.push(this.selectedInstruction);
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

        for (let i = 0; i < this.recipe.instructions.length; i++) {
          this.recipe.instructions[i].orderNb = i + 1;
        }
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
