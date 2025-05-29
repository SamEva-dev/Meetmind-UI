import { Injectable } from '@angular/core';
import { SignalRService } from '../../../core/services/signalr.service';
import { Observable } from 'rxjs';
import { Notifications } from '../../../core/models/Meeting';

@Injectable({
  providedIn: 'root'
})
export class DashboardSignalRService {

 private hubName = 'dashboard';
 
   constructor(private signalR: SignalRService) {
     this.signalR.connect(this.hubName, '/hubs/Notification');
   }
 
   onNotificationMeeting(): Observable<Notifications> {
     return this.signalR.on<Notifications>(this.hubName, 'NotificationMeeting');
   }
}
