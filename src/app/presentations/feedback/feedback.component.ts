import { Component, OnInit } from '@angular/core';
import { Presentation } from '../shared/presentation';
import { Feedback } from '../shared/feedback';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { NavigationService } from '~/app/shared/services/navigation.service';
import { PresentationService } from '../shared/presentation.service';
import { Button } from 'tns-core-modules/ui/button';
import { EventData } from 'tns-core-modules/data/observable';
import { FeedbackService } from '../shared/feedback.service';
import { FeedbackForm } from '../shared/feedback-form';
import { isAndroid } from 'tns-core-modules/platform';
import { DataFormEventData } from 'nativescript-ui-dataform';
import { Page } from 'tns-core-modules/ui/page/page';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import * as _ from 'lodash';
declare var android;
declare var TKGridLayoutAlignment;


@Component({
  selector: 'ns-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
  moduleId: module.id
})
export class FeedbackComponent implements OnInit {
  private _presentationTitle = 'Präsentation';
  private _loading = true;
  private _presentation: Presentation;
  private _feedbackForm: FeedbackForm;

  private _feedbackConfig = {
    isReadOnly: false,
    commitMode: 'Immediate',
    validationMode: 'Immediate'
  };

  constructor(
    private _presentationService: PresentationService,
    private _pageRoute: PageRoute,
    private _navigationService: NavigationService,
    private _feedbackService: FeedbackService,
    private _page: Page
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
    this._feedbackForm = new FeedbackForm(null, 0, null, null);
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

  onFeedbackSubmit(args: EventData): void {
    dialogs
      .confirm({
        title: 'Feedback abgeschlossen?',
        okButtonText: 'Feedback absenden',
        cancelButtonText: 'Abbrechen'
      })
      .then(result => {
        if (result) {
          if (this._feedbackForm.isEmpty()) {
            // TODO: Show banner or feedback
            this._navigationService.navigateTo(
              'presentation',
              this._presentation.id
            );
          } else {
            const feedback = <Feedback>{
              handle: this._feedbackForm.handle,
              grade: Number(this._feedbackForm.grade),
              comment_positive: this._feedbackForm.comment_positive,
              comment_negative: this._feedbackForm.comment_negative,
              presentation_id: this._presentation.id
            };
            this._feedbackService.addFeedback(feedback).subscribe(
              submitted => {
                console.log('Just submitted:', submitted);
                this._navigationService.navigateTo(
                  'presentation',
                  this._presentation.id
                );
              },
              err => console.log(err)
            );
          }
        }
      });
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

  get feedbackForm(): FeedbackForm {
    return this._feedbackForm;
  }

  get feedbackConfig(): object {
    return this._feedbackConfig;
  }
}
