import { Component } from "@angular/core";
import { NavParams, PopoverController } from "ionic-angular";
import { RecipeEntity } from "../../entities/recipe-entity";
import { CameraPopoverComponent } from "../camera-popover/camera-popover";

@Component({
  selector: "summary-tab",
  templateUrl: "summary-tab.html"
})
export class SummaryTabComponent {
  public entity: RecipeEntity;

  constructor(params: NavParams, private popoverCtrl: PopoverController) {
    this.entity = params.data;
  }

  ngAfterViewInit() {
    console.info("info");
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(CameraPopoverComponent);
    popover.present({ ev: event });
  }
}
