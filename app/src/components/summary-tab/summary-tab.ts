import { Component } from "@angular/core";
import { NavParams } from "ionic-angular";
import { RecipeEntity } from "../../entities/recipe-entity";

@Component({
  selector: "summary-tab",
  templateUrl: "summary-tab.html"
})
export class SummaryTabComponent {
  public entity: RecipeEntity;

  constructor(params: NavParams) {
    this.entity = params.data;
  }

  ngAfterViewInit() {
    console.info("info");
  }
}
