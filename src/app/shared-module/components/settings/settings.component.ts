import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'ns-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
  }

  onSubscribeToTopic(topic: string) {
    this.firebaseService.subscribeToTopic(topic).then(() => {
      console.log("Subscribed");
    },
    error => {
      console.log(`not subscribed: ${error}`);
    })
  }

  onUnsubscribeFromTopic(topic: string) {
    this.firebaseService.unsubscribeFromTopic(topic).then(() => {
      console.log("Unubscribed");
    },
    error => {
      console.log(`not unsubscribed: ${error}`);
    })
  }

}
