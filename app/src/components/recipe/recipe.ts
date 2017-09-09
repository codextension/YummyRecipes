import { Component, Input, NgZone } from "@angular/core";
import { RecipeEntity } from "../../entities/recipe-entity";
import { PopoverController } from "ionic-angular";
import { CameraPopoverComponent } from "../camera-popover/camera-popover";
import { DomSanitizer } from "@angular/platform-browser";
/**
 * Generated class for the RecipeComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: "recipe",
  templateUrl: "recipe.html"
})
export class RecipeComponent {
  @Input() entity: RecipeEntity;
  @Input() readonly: boolean;
  public paddingBottom: number;

  constructor(
    private popoverCtrl: PopoverController,
    private sanitizer: DomSanitizer,
    public zone: NgZone
  ) {
    this.paddingBottom = 100;
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(CameraPopoverComponent);
    popover.present({ ev: event });
  }

  getBackground(image) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  scrollHandler(event) {
    if (event.directionY == "down") {
      if (
        this.paddingBottom > 50 &&
        event.scrollHeight - event.contentHeight - event.scrollTop > 0
      ) {
        this.paddingBottom--;
        console.log(
          "padding: " + this.paddingBottom + " (" + event.scrollTop + ")"
        );
      }
    } else {
      if (this.paddingBottom < 100) {
        this.paddingBottom++;
        console.log(
          "padding: " + this.paddingBottom + " (" + event.scrollTop + ")"
        );
      }
      if (event.scrollTop == 0) {
        this.paddingBottom = 100;
      }
    }
    this.zone.run(() => {});
  }
}
