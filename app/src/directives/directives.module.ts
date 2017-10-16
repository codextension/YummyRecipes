import {NgModule} from "@angular/core";
import {FocuserDirective} from "./focuser/focuser";
import {SelectTextDirective} from './select-text/select-text';

@NgModule({
    declarations: [FocuserDirective,
        SelectTextDirective],
    imports: [],
    exports: [FocuserDirective,
        SelectTextDirective]
})
export class DirectivesModule {
}
