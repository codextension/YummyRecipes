import { NgModule } from "@angular/core";
import { CardGroupDirective } from "./card-group/card-group";
import { FocuserDirective } from "./focuser/focuser";
@NgModule({
  declarations: [CardGroupDirective, FocuserDirective],
  imports: [],
  exports: [CardGroupDirective, FocuserDirective]
})
export class DirectivesModule {}
