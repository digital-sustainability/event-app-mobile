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
import { Page } from 'tns-core-modules/ui/page/page';
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


  private _presentationTitle = 'Präsentation';
  private _loading = true;
  private _presentation: Presentation;


  constructor(
    private _presentationService: PresentationService,
    private _pageRoute: PageRoute,
    private _navigationService: NavigationService,
    private _userFeedbackService: UserFeedbackService,
    private _page: Page,
    private _feedbackService: FeedbackService,
  ) {
    this._page.on('loaded', args => {
      if (this._page.android) {
        this._page.android.setFitsSystemWindows(true);

        const listener = new android.view.ViewTreeObserver.OnGlobalLayoutListener(
          {
            onGlobalLayout: () => {
              // the following lines check if keyboard is shown
              // code taken from https://github.com/NathanaelA/nativescript-keyboardshowing/blob/master/index.js
              const rect = new android.graphics.Rect();
              const window = _page._context.getWindow();
              this._page.android.getWindowVisibleDisplayFrame(rect);
              const rootView = _page.android.getRootView();
              const screenHeight = rootView.getHeight();
              const missingSize = screenHeight - rect.bottom;

              if (missingSize > screenHeight * 0.15) {
                // if keyboard is shown
                // the following lines get the statusBarHeight
                // code taken from https://stackoverflow.com/questions/3407256/height-of-status-bar-in-android
                const rectangle = new android.graphics.Rect();
                window.getDecorView().getWindowVisibleDisplayFrame(rectangle);
                const statusBarHeight = rectangle.top;

                this._page.marginTop =
                  -statusBarHeight /
                  _page._context.getResources().getDisplayMetrics().density;

                // remove the listener so that it does not leak
                const viewTreeObserver = rootView.getViewTreeObserver();
                viewTreeObserver.removeOnGlobalLayoutListener(listener);
              }
            }
          }
        );
        this._page.android.getViewTreeObserver().addOnGlobalLayoutListener(listener);

        this._page.on(Page.navigatingFromEvent, () => {
          let viewTreeObserver = this._page.android.getViewTreeObserver();
          viewTreeObserver.removeOnGlobalLayoutListener(listener);
        });

      }
    });
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
  }

  onSliderValueChange(event: any) {
    this.feedback.grade = event.value;
  }

  onSubmitFeedback() {
    if(
      this.feedback.comment_negative == '' &&
      this.feedback.comment_positive == '' &&
      this.feedback.grade == 0) {
        this._feedbackService.show(FeedbackType.Error, 'Leeres Formular', 'Füllen Sie das Formular aus, um Feedback einzureichen.')
    } else {
      this._loading = true;

      this._userFeedbackService.addFeedback(this.feedback).subscribe(
        (submitted) => {
          this._loading = false;

          this._feedbackService.show(FeedbackType.Success, 'Feedback eingreicht', 'Vielen Dank für Ihre Rückmeldung.', 4000);
          this._navigationService.navigateBack();
        },
        err => {
          this._loading = false;

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

  get gradeDescription(): string {
    switch (this.feedback.grade) {
      case 1: return 'sehr schlecht'; break;
      case 2: return 'schlecht'; break;
      case 3: return 'schlecht'; break;
      case 4: return 'mittelmässig'; break;
      case 5: return 'mittelmässig'; break;
      case 6: return 'mittelmässig'; break;
      case 7: return 'gut'; break;
      case 8: return 'gut'; break;
      case 9: return 'ausgezeichnet'; break;
      case 10: return 'ausgezeichnet'; break;
      default: return 'keine Bewertung';
    }
  }
}
