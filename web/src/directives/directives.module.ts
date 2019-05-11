import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocuserDirective } from './focuser/focuser.directive';
import { SelectTextDirective } from './select-text/select-text.directive';

@NgModule({
  declarations: [FocuserDirective, SelectTextDirective],
  imports: [
    CommonModule
  ]
})
export class DirectivesModule { }
