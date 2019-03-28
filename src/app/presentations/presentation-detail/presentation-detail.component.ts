import { Component, OnInit } from '@angular/core';
import { Presentation } from '../shared/presentation';
import { Speaker } from '../shared/speaker';
import { Image } from 'tns-core-modules/ui/image';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { NavigationService } from '~/app/shared/navigation.service';
import { PresentationService } from '../shared/presentation.service';
import { Button } from 'tns-core-modules/ui/button'
import { EventData } from 'tns-core-modules/data/observable'
import { openUrl } from 'tns-core-modules/utils/utils'
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as _ from 'lodash';
// Second argument is optional.

@Component({
  selector: 'ns-presentation-detail',
  templateUrl: './presentation-detail.component.html',
  styleUrls: ['./presentation-detail.component.css'],
  moduleId: module.id,
})
export class PresentationDetailComponent implements OnInit {
  
  private _presentationTitle = 'Präsentation'
  private _loading = true;
  private _presentation: Presentation;
  private _speakers: Speaker[];
  
  constructor(
    private _presentationService: PresentationService,
    private _pageRoute: PageRoute,
    private _navigationService: NavigationService,
    ) { }
    
    ngOnInit(): void {
      this._pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        const presentationId = params.id;
        // const presentationId = 1; // TODO: Remove – Testing only
        this._presentationService.getPresentation(presentationId)
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
              this._speakers = presentation.speakers;
              this.checkSpeakerPhoto();
              this._loading = false;
            },
            err => console.error(err)
            )
          });                                             
  }

  checkSpeakerPhoto(): void {
    this._speakers.forEach(speaker => {
      if(!speaker.photo_url) {
        speaker.photo_url = '~/images/load_homer.png';
      }
    });
  }

  onSpeakerTap(args: TouchGestureEventData): void {
    const tappedSpeaker = args.view.bindingContext;
    this._navigationService.navigateTo('/speaker', tappedSpeaker.id);
  }

  onFabTap(): void {
    // TODO: Only show if live chat is activated
    dialogs.login({
      title: 'Live Chat Login',
      message: `Bitte fügen Sie das Raum-Passwort für "${this._presentationTitle}" ein, um bei der Diskussion mitzumachen. Falls Sie anonym mitmachen wollen, geben Sie keinen Benutzernamen ein.`,
      okButtonText: "Los!",
      cancelButtonText: "Abbrechen",
      userNameHint: "Benutzername",
      passwordHint: "Raum-Passwort"
    }).then(response => {
      console.log(`Dialog login: ${response.result}; User: ${response.userName}; Pw: ${response.password}`);
    });
  }

  onFeedbackTap(args: EventData): void {
    // let button = <Button>args.object;
    this._navigationService.navigateTo('/feedback', this._presentation.id);
  }

  onShowSlides(url: string): void {
    openUrl(url);
  }

  get speakers(): Speaker[] {
    // TODO: Not sorted..
    return _.sortBy(this._speakers, [(o: Speaker) => o.first_name]);
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
