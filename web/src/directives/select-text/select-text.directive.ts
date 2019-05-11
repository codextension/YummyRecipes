import { Directive, OnInit, ElementRef} from '@angular/core';

@Directive({
  selector: '[appSelectText]'
})
export class SelectTextDirective implements OnInit {

  constructor(public el: ElementRef) { }

  ngOnInit(): void {
    const searchInput = this.el.nativeElement.querySelector('input');

    setTimeout(() => {
        searchInput.nativeElement.select();
    }, 1);

  }
}
