import { Component, OnInit } from '@angular/core';
import { Presentation } from '../shared/models/presentation';
import { UserFeedback } from '../shared/models/user-feedback';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { NavigationService } from '../../../shared-module/services/navigation.service';
import { PresentationService } from '../shared/services/presentation.service';
import { Button } from 'tns-core-modules/ui/button';
import { EventData } from 'tns-core-modules/data/observable';
import { UserFeedbackService } from '../shared/services/user-feedback.service';
import { UserFeedbackForm } from '../shared/util/user-feedback-form';
import { isAndroid } from 'tns-core-modules/platform';
import { DataFormEventData } from 'nativescript-ui-dataform';
import { Page } from 'tns-core-modules/ui/page/page';
import { FeedbackType } from 'nativescript-feedback';
import { FeedbackService } from '../../../shared-module/services/feedback.service';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import * as _ from 'lodash';
declare var android;
declare var TKGridLayoutAlignment;


@Component({
  selector: 'ns-feedback',
  templateUrl: './user-feedback.component.html',
  styleUrls: ['./user-feedback.component.css'],
  moduleId: module.id
})
export class UserFeedbackComponent implements OnInit {
  private _presentationTitle = 'Präsentation';
  private _loading = true;
  private _presentation: Presentation;
  private _userFeedbackForm: UserFeedbackForm;

  private _userFeedbackConfig = {
    isReadOnly: false,
    commitMode: 'Immediate',
    validationMode: 'Immediate'
  };

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
    this._userFeedbackForm = new UserFeedbackForm(null, 0, null, null);
    this._pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        // const presentationId = 1;
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
      });
  }

  dfEditorUpdate(args: DataFormEventData) {
    if (!isAndroid) {
      this.editorSetupStepperIOS(args.editor);
    }
  }

  onUserFeedbackSubmit(args: EventData): void {
    if (this._userFeedbackForm.isEmpty()) {
      dialogs.confirm({
        title: 'Es wurde kein Feedback abgegeben.',
        okButtonText: 'Feedback verlassen',
        cancelButtonText: 'Zurück'
      }).then(
        ok => {
          if (ok) {
            this._navigationService.navigateTo('presentation', this._presentation.id);
          }
        }
      );
    } else {
      dialogs.confirm({
        title: 'Feedback abgeschlossen?',
        okButtonText: 'Feedback absenden',
        cancelButtonText: 'Abbrechen'
      }).then(
        ok => {
          if (ok) {
            const feedback = <UserFeedback>{
              handle: this._userFeedbackForm.handle,
              grade: Number(this._userFeedbackForm.grade),
              comment_positive: this._userFeedbackForm.comment_positive,
              comment_negative: this._userFeedbackForm.comment_negative,
              presentation_id: this._presentation.id
            };
            this._userFeedbackService.addFeedback(feedback).subscribe(
              submitted => {
                this._feedbackService.show(FeedbackType.Success, 'Feedback eingreicht', 'Vielen Dank für Ihre Rückmeldung!', 4000);
                this._navigationService.navigateTo('presentation', this._presentation.id);
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
      );
    }
  }

  editorSetupStepperIOS(editor) {
    // Add distance between the editor and displayed value on iOS
    const editorView = editor.editorCore;
    editorView.labelAlignment = TKGridLayoutAlignment.Left;
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

  get userFeedbackForm(): UserFeedbackForm {
    return this._userFeedbackForm;
  }

  get userFeedbackConfig(): object {
    return this._userFeedbackConfig;
  }
}
