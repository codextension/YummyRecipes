import { Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[appFocuser]'
})
export class FocuserDirective implements OnInit {

  constructor(public el: ElementRef) { }

  ngOnInit() {
    const searchInput = this.el.nativeElement.querySelector('input');
    setTimeout(() => {
        searchInput.nativeElement.focus();
    }, 1);
  }
}
