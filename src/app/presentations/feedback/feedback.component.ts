import { Component, OnInit } from '@angular/core';
import { Presentation } from '../shared/presentation';
import { Feedback } from '../shared/feedback';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { NavigationService } from '~/app/shared/navigation.service';
import { PresentationService } from '../shared/presentation.service';
import { Button } from 'tns-core-modules/ui/button'
import { EventData } from 'tns-core-modules/data/observable'
import { FeedbackService } from '../shared/feedback.service';
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as _ from 'lodash';

@Component({
  selector: 'ns-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  moduleId: module.id,
})
export class FeedbackComponent implements OnInit {

  private _presentationTitle = 'Präsentation'
  private _loading = true;
  private _presentation: Presentation;

  constructor(
    private _presentationService: PresentationService,
    private _pageRoute: PageRoute,
    private _navigationService: NavigationService,
    private _routerExtensions: RouterExtensions,
    private _feedbackService: FeedbackService
  ) { }

  ngOnInit(): void {
      this._pageRoute.activatedRoute
        .pipe(switchMap(activatedRoute => activatedRoute.params))
        .forEach(params => {
          const presentationId = params.id;
          this._presentationService.getPresentation(presentationId)
            .pipe(
              catchError(err => {
                // TODO: Create generally shared error handler
                return throwError(err);
              })
            )
            .subscribe(
              (presentation: Presentation) => {
                this._presentation = presentation
                this._presentationTitle = presentation.title;
                this._loading = false;
              },
              err => console.error(err)
            )
        });
  }
  
  onFeedbackSubmit(args: EventData): void {
    console.log('Submitted!')
    const testFeedback = <Feedback>{
      grade: 5,
      handle: 'say my name',
      comment_positive: 'Positive',
      comment_negative: 'Negative',
      presentation_id: 1
    }
    this._feedbackService.addFeedback(testFeedback).subscribe(
      submitted => {
        console.log('just submitted:', submitted);
        this._navigationService.navigateTo('presentation', this._presentation.id);
      },
      err => console.log(err)
    )
  }

  onBackButtonTap(): void {
    this._routerExtensions.navigate(['/presentation', this._presentation.id]);
  }

  get presentation(): Presentation {
    return this._presentation;
  }

  get presentationTitle(): string {
    return this._presentationTitle;
  }

  get loading(): boolean {
    return this._loading;
  }

}
