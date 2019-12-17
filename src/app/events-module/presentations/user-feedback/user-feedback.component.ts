import { Component, OnInit } from '@angular/core';
import { Presentation } from '../../shared/models/presentation';
import { UserFeedback } from '../../shared/models/user-feedback';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NavigationService } from '~/app/shared-module/services/navigation.service';
import { PresentationService } from '../presentation.service';
import { UserFeedbackService } from '../user-feedback.service';
import { FeedbackType } from 'nativescript-feedback';
import { FeedbackService } from '~/app/shared-module/services/feedback.service';
import { registerElement } from 'nativescript-angular';
registerElement('PreviousNextView', () => require('nativescript-iqkeyboardmanager').PreviousNextView);

declare var android;
declare var TKGridLayoutAlignment;


@Component({
  selector: 'ns-feedback',
  templateUrl: './user-feedback.component.html',
  styleUrls: ['./user-feedback.component.css'],
  moduleId: module.id
})
export class UserFeedbackComponent implements OnInit {
  feedback: UserFeedback;
  staging_grade: number;
  private _sliderLoaded = false;


  private _presentationTitle = 'Präsentation';
  private _loading = true;
  private _presentation: Presentation;


  constructor(
    private _presentationService: PresentationService,
    private _pageRoute: PageRoute,
    private _navigationService: NavigationService,
    private _userFeedbackService: UserFeedbackService,
    private _feedbackService: FeedbackService,
  ) {
  }

  ngOnInit(): void {

    this._pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        const presentationId = params.id;
        
        this._presentationService
          .getPresentation(presentationId)
          .pipe(
            catchError(err => {
              // TODO: Create generally shared error handler
              return throwError(err);
            })
          )
          .subscribe(
            (presentation: Presentation) => {
              this._presentation = presentation;
              this._presentationTitle = presentation.title;
              this._loading = false;
            },
            err => console.error(err)
          );

        this.feedback = {
          handle: '',
          presentation_id: presentationId,
          comment_negative: '',
          comment_positive: '',
          grade: 0
        };
      });

    this.staging_grade = 1;
    this._sliderLoaded = false;
  }

  onSliderValueChange(event: any) {
    // 0 is not allowed for the slider (min 1) but in the database
    if(this._sliderLoaded)
      this.feedback.grade = this.staging_grade;

    if(event.value != 0)
      this._sliderLoaded = true;
  }

  onSubmitFeedback() {
    console.log(this.feedback)
    if(
      this.feedback.comment_negative == '' &&
      this.feedback.comment_positive == '' &&
      this.feedback.grade == 0) {
        this._feedbackService.show(FeedbackType.Error, 'Leeres Formular', 'Füllen Sie das Formular aus, um Feedback einzureichen.')
    } else {
      this._userFeedbackService.addFeedback(this.feedback).subscribe(
        (submitted) => {
          this._feedbackService.show(FeedbackType.Success, 'Feedback eingreicht', 'Vielen Dank für Ihre Rückmeldung.', 4000);
          this._navigationService.navigateBack();
        },
        err => {
          this._feedbackService.show(
            FeedbackType.Error,
            'Fehler',
            'Feedback konnte nicht gespeichert werden. Probieren Sie es später erneut',
            4000);
          console.log(err)
        }
      );
    }
  }


  onBackButtonTap(): void {
    this._navigationService.navigateBack();
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
