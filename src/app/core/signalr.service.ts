import { Injectable } from '@angular/core';

import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { UpcomingMeetingNotification, RequestActionMessage, ActionResultMessage } from './models/realtime.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hub!: HubConnection;

  private upcomingSubject = new BehaviorSubject<UpcomingMeetingNotification | null>(null);
  onUpcomingMeeting$ = this.upcomingSubject.asObservable();

  private requestActionSubject = new BehaviorSubject<RequestActionMessage | null>(null);
  onRequestAction$ = this.requestActionSubject.asObservable();

  private actionResultSubject = new BehaviorSubject<ActionResultMessage | null>(null);
  onActionResult$ = this.actionResultSubject.asObservable();

  constructor() {}

  async connect(token: string): Promise<void> {
    this.hub = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/notify`, {
        accessTokenFactory: () => token
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.registerHandlers();

    await this.hub.start();
    console.log('SignalR connected');
  }

  private registerHandlers() {
    this.hub.on('UpcomingMeeting', (msg: UpcomingMeetingNotification) => {
      this.upcomingSubject.next(msg);
    });
    this.hub.on('RequestAction', (msg: RequestActionMessage) => {
      this.requestActionSubject.next(msg);
    });
    this.hub.on('ActionResult', (msg: ActionResultMessage) => {
      this.actionResultSubject.next(msg);
    });
  }

  confirmAction(meetingId: string, action: string, accepted: boolean): Promise<void> {
    const payload: RequestActionMessage = {
      meetingId,
      action,
      accepted,
      confirmedAtUtc: new Date().toISOString()
    };
    return this.hub.invoke('ConfirmAction', payload);
  }

  ngOnDestroy() {
    if (this.hub) {
      this.hub.stop().catch(err => console.error('SignalR stop error', err));
    }
  }
}
