import {NgModule} from "@angular/core";
import {TimePipe} from "./time/time";
import {TranslatePipe} from './translate/translate';

@NgModule({
    declarations: [TimePipe,
        TranslatePipe],
    imports: [],
    exports: [TimePipe,
        TranslatePipe]
})
export class PipesModule {
}
