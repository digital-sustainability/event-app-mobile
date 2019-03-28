import { Component, OnInit } from '@angular/core';
import { Presentation } from '../shared/presentation';
import { Feedback } from '../shared/feedback';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { NavigationService } from '~/app/shared/navigation.service';
import { PresentationService } from '../shared/presentation.service';
import { Button } from 'tns-core-modules/ui/button'
import { EventData } from 'tns-core-modules/data/observable'
import { FeedbackService } from '../shared/feedback.service';
import { FeedbackForm } from '../shared/feedback-form'
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
  private _feedbackForm: FeedbackForm;

  private _feedbackConfig = {
    "isReadOnly": false,
    "commitMode": "Immediate",
    "validationMode": "Immediate",
    // "propertyAnnotations":
    //   [
    //     {
    //       "name": "handle",
    //       "displayName": "Besuchername",
    //       "index": 0,
    //       "hintText": "Ihr Name (freiwillig)"
    //     },
    //     {
    //       "name": "grade",
    //       "displayName": "Präsentationsbewertung (1 – 5)",
    //       "index": 1,
    //       "hintText": "-",
    //       // "editor": "Picker",
    //       // "valuesProvider": [1, 2, 3, 4, 5]
    //       "editor": "Stepper",
    //       "editorParams": {
    //         "step": 1,
    //         "min": 1,
    //         "max": 5
    //       }
    //     },
    //     {
    //       "name": "comment_positive",
    //       "displayName": "Das fand ich gut",
    //       "index": 2,
    //       "hintText": "Ihr Feedback",
    //       "editor": "MultilineText"
    //     },
    //     {
    //       "name": "comment_negative",
    //       "displayName": "Das fand ich verbesserungswürdig",
    //       "index": 3,
    //       "hintText": "Ihr Feedback",
    //       "editor": "MultilineText"
    //     },
    //   ]
    }

  constructor(
    private _presentationService: PresentationService,
    private _pageRoute: PageRoute,
    private _navigationService: NavigationService,
    private _feedbackService: FeedbackService
  ) { }

  ngOnInit(): void {
    this._feedbackForm = new FeedbackForm(null, null, null, null)
    this._pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        const presentationId = 1;
        // const presentationId = params.id;
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
    dialogs.confirm({
      title: "Feedback abgeschlossen?",
      okButtonText: "Feedback absenden",
      cancelButtonText: "Abbrechen",
    }).then(result => {
      if (result) {
        if (this._feedbackForm.isEmpty()) {
          // TODO: Show banner or feedback
          console.log('Empty')
          this._navigationService.navigateTo('presentation', this._presentation.id);
        } else {
          const feedback = <Feedback>{
            handle: this._feedbackForm.handle,
            grade: Number(this._feedbackForm.grade),
            comment_positive: this._feedbackForm.comment_positive,
            comment_negative: this._feedbackForm.comment_negative,
            presentation_id: this._presentation.id
          }
          console.log(feedback);
          this._feedbackService.addFeedback(feedback).subscribe(
            submitted => {
              console.log('Just submitted:', submitted);
              this._navigationService.navigateTo('presentation', this._presentation.id);
            },
            err => console.log(err)
          )
        }
      }
    });
  }

  onBackButtonTap(): void {
    this._navigationService.navigateTo('/presentation', this._presentation.id);
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

  get feedbackForm(): FeedbackForm {
    return this._feedbackForm;
  }

  get feedbackConfig(): object {
    return this._feedbackConfig;
  }

}
