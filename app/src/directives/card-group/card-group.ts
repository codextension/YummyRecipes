import {Directive, ElementRef} from "@angular/core";

/**
 * Generated class for the CardGroupDirective directive.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
 * for more info on Angular Directives.
 */
@Directive({
    selector: "[card-group]"
})
export class CardGroupDirective {
    constructor(el: ElementRef) {
        el.nativeElement.className += " card-deck";
    }
}
