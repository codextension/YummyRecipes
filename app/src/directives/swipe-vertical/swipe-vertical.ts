import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import { Gesture } from "ionic-angular/gestures/gesture";
declare var Hammer: any;

/*
  Class for the SwipeVertical directive (attribute (swipe) is only horizontal).

  In order to use it you must add swipe-vertical attribute to the component.
  The directives for binding functions are [swipeUp] and [swipeDown].

  IMPORTANT:
  [swipeUp] and [swipeDown] MUST be added in a component which
  already has "swipe-vertical".
*/

@Directive({
  selector: "[swipe-vertical]" // Attribute selector
})
export class SwipeVerticalDirective implements OnInit, OnDestroy {
  @Output("swipeUp") swipeUp: EventEmitter<any> = new EventEmitter();
  @Output("swipeDown") swipeDown: EventEmitter<any> = new EventEmitter();

  private el: HTMLElement;
  private swipeGesture: Gesture;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  ngOnInit() {
    this.swipeGesture = new Gesture(this.el, {
      recognizers: [
        [
          Hammer.Pan,
          { direction: Hammer.DIRECTION_VERTICAL, threshold: 5, pointers: 0 }
        ]
      ]
    });
    this.swipeGesture.listen();
    this.swipeGesture.on("panup", e => {
      this.swipeUp.emit(e);
    });
    this.swipeGesture.on("pandown", e => {
      this.swipeDown.emit(e);
    });
  }

  ngOnDestroy() {
    this.swipeGesture.destroy();
  }
}
