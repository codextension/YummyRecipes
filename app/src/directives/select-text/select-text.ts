import {Directive, ElementRef, Renderer} from "@angular/core";

/**
 * Generated class for the SelectTextDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
    selector: '[select-text]' // Attribute selector
})
export class SelectTextDirective {

    constructor(public renderer: Renderer, public elementRef: ElementRef) {
    }

    ngAfterViewInit() {
        //search bar is wrapped with a div so we get the child input
        const searchInput = this.elementRef.nativeElement.querySelector("input");
        //delay required or ionic styling gets finicky
        setTimeout(() => {
            this.renderer.invokeElementMethod(searchInput, "select", []);
        }, 1);
    }
}
