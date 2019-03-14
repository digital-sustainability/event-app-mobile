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

@Component({
  selector: 'ns-speaker-detail',
  templateUrl: './speaker-detail.component.html',
  styleUrls: ['./speaker-detail.component.css'],
  moduleId: module.id,
})
export class SpeakerDetailComponent implements OnInit {
  
  private _loading = true;
  private _speaker: Speaker;
  private _presentations: Presentation[];
  private _fullName = 'Speaker'
  
  constructor(
    private _presentationService: PresentationService,
    private _pageRoute: PageRoute,
    private _navigationService: NavigationService,
  ) { }
  
  ngOnInit(): void {
    this._pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        // const speakerId = params.id;
        const speakerId = 1; // TODO: Remove – Testing only
        this._presentationService.getSpeakerById(speakerId)
          .pipe(
            catchError(err => {
              // TODO: Create generally shared error handler
              return throwError(err);
            })
          )
          .subscribe(
            speaker => {
              this._loading = false;
              this._speaker = speaker;
              this._fullName = speaker.first_name + ' ' + speaker.last_name;
              this._presentations = speaker.presentations;
            },
            err => console.error(err)
          )
      });
  }

  onPresentationTap(args: TouchGestureEventData): void {
    const tappedPresentation = args.view.bindingContext;
    this._navigationService.navigateTo('/presentation', tappedPresentation.id);
  }

  get speaker(): Speaker {
    return this._speaker;
  }

  get presentations(): Presentation[] {
    return this._presentations;
  }

  get fullName(): string {
    return this._fullName;
  }

  get loading(): boolean {
    return this._loading;
  }

}