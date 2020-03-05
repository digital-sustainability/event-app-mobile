import { Component, OnInit } from '@angular/core';
import { FirebaseService, Topic } from '../../services/firebase.service';
import {
  getBoolean,
  setBoolean,
  getNumber,
  setNumber,
  getString,
  setString,
  hasKey,
  remove,
  clear
} from "tns-core-modules/application-settings";
import { EventData } from 'tns-core-modules/data/observable/observable';
import { Switch } from 'tns-core-modules/ui/switch/switch';
import { FeedbackService } from '../../services/feedback.service';
import { FeedbackType } from 'nativescript-feedback';
import { setBool } from 'nativescript-plugin-firebase/crashlytics/crashlytics';

@Component({
  selector: 'ns-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  loading = false;
  topics: Topic[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private feedbackService: FeedbackService  
  ) { }

  ngOnInit() {
    return this.firebaseService.getTopics().subscribe((topics) => {
      this.topics = topics;
    }, (err) => {
      this.feedbackService.show(FeedbackType.Error, 'Fehler', 'Push-Topics konnten nicht geladen werden', 5000);
    });
  }

  onSubscribeToTopic(topic: Topic) {
    this.loading = true;

    this.firebaseService.subscribeToTopic(topic).then(() => {
      console.log("Subscribed");
      setBoolean(topic.identifier + '-push-subscribed', true);
      this.loading = false;
    },
    error => {
      console.log(`not subscribed: ${error}`);
    })
  }

  onUnsubscribeFromTopic(topic: Topic) {
    this.loading = true;

    this.firebaseService.unsubscribeFromTopic(topic).then(() => {
      console.log("Unubscribed");
      setBoolean(topic.identifier + '-push-subscribed', false);
      this.loading = false;
    },
    error => {
      console.log(`not unsubscribed: ${error}`);
    })
  }

  isSubscribed(topic: Topic): boolean {
    if(hasKey(topic.identifier + '-push-subscribed'))
      if(getBoolean(topic.identifier + '-push-subscribed'))
        return true;
    
    return false;
  }

  onToggleSwitch(args: EventData, topic: Topic): void {
    let sw = args.object as Switch;
    let isChecked = sw.checked; // boolean
    if(isChecked !== this.isSubscribed(topic)) {
      if(isChecked)
        this.onSubscribeToTopic(topic);
      else 
        this.onUnsubscribeFromTopic(topic);
    }
  }
}
