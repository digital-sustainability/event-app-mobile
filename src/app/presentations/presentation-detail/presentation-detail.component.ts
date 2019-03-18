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
import * as _ from 'lodash';


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
        // const presentationId = params.id;
        const presentationId = 1; // TODO: Remove – Testing only
        this._presentationService.getPresentationById(presentationId)
          .pipe(
            catchError(err => {
              // TODO: Create generally shared error handler
              return throwError(err);
            })
          )
          .subscribe(
            (presentation: Presentation) => {
              this._loading = false;
              this._presentation = presentation;
              this._presentationTitle = presentation.title;
              this._speakers = presentation.speakers;
              this.checkSpeakerPhoto();
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
