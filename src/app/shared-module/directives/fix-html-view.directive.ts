import { Directive, AfterViewInit, ElementRef } from '@angular/core';

// Fixes iOS bug (HtmlView is not resized after dynamic content change) https://stackoverflow.com/questions/50338717/nativescript-ios-htmlview-in-scrollview-not-resizing

@Directive({
  selector: '[nsFixHtmlView]'
})
export class FixHtmlViewDirective implements AfterViewInit {
  constructor(private htmlView: ElementRef) {}

  ngAfterViewInit() {
    if (this.htmlView && this.htmlView.nativeElement.ios) {
      setTimeout(() => {
        this.htmlView.nativeElement.requestLayout();
      }, 0);
    }

    if (this.htmlView && this.htmlView.nativeElement.android) {
      this.htmlView.nativeElement.android.setAutoLinkMask(0);
    }
  }
}