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

@Component({
  selector: "page-recipe-management",
  templateUrl: "recipe-management.html",
  providers: [ImagesService],
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
    private imagesService: ImagesService
  ) {
    this.recipeContent = "ingredients";
    this.recipe = this.navParams.get("entity");
    this.imgState = "shrink";
    this.inputMode = false;
    this.editMode = this.recipe.reference == null;

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
          id: [item.id ? new Date().getTime() : item.id],
          orderNb: [item.orderNb],
          description: [item.description, Validators.required]
        });
        break;
      }
    }
  }

  save() {
    this.haptic.selection(); //iOs
    this.deviceFeedback.haptic(1);

    this.editMode = !this.editMode;

    this.imagesService.save(this.recipe.imageUrl).then(res => {
      this.recipe.imageUrl = res;
    });
  }

  apply(inputRef: string) {
    if (inputRef == "name") {
      this.recipe.name = this.recipeForm.value.name;
    } else if (inputRef == "duration") {
      this.recipe.duration = this.recipeForm.value.duration;
    } else if (inputRef == "servings") {
      this.recipe.servings = this.recipeForm.value.servings;
    } else if (inputRef == "ingredients") {
      if (this.actionMode == EditModeType.UPDATE) {
        let index: number = this.indexOf(
          this.recipe.ingredients,
          this.recipeForm.value.id
        );
        this.recipe.ingredients[index] = this.recipeForm.value;
      } else {
        this.recipe.ingredients.push(this.recipeForm.value);
      }
    } else if (inputRef == "instructions") {
      if (this.actionMode == EditModeType.UPDATE) {
        let index: number = this.indexOf(
          this.recipe.instructions,
          this.recipeForm.value.id
        );
        this.recipe.instructions[index] = this.recipeForm.value;
      } else {
        this.recipeForm.value.orderNb = this.recipe.instructions.length + 1;
        this.recipe.instructions.push(this.recipeForm.value);
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
