import { NgModule } from "@angular/core";
import { CardGroupDirective } from "./card-group/card-group";
import { FocuserDirective } from "./focuser/focuser";
import { SwipeVerticalDirective } from './swipe-vertical/swipe-vertical';
@NgModule({
  declarations: [CardGroupDirective, FocuserDirective,
    SwipeVerticalDirective],
  imports: [],
  exports: [CardGroupDirective, FocuserDirective,
    SwipeVerticalDirective]
})
export class DirectivesModule {}
