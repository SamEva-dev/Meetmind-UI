// core/services/meetings-signalr.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignalRService } from '../../../core/services/signalr.service';
import { ImminentMeeting, Meeting, Notifications } from '../../../core/models/Meeting';

@Injectable({
  providedIn: 'root'
})
export class MeetingsSignalRService {
  
  
  private hubName = 'meetings';
  private hubRecName = 'recording';
  private hubSummaryName = 'summary';
  private hubTranscriptName = 'transcript';

  constructor(private signalR: SignalRService) {
    this.signalR.connect(this.hubName, '/hubs/meetings');
     this.signalR.connect(this.hubRecName, '/hubs/recording');  
    this.signalR.connect(this.hubSummaryName, '/hubs/summary');
    this.signalR.connect(this.hubTranscriptName, '/hubs/transcript');
  }

  onMeetingCreated(): Observable<Meeting> {
    return this.signalR.on<Meeting>(this.hubName, 'MeetingCreated');
  }

  onMeetingUpdated(): Observable<Meeting> {
    return this.signalR.on<Meeting>(this.hubName, 'MeetingUpdated');
  }

  onImminentMeeting(): Observable<ImminentMeeting> {
    return this.signalR.on<ImminentMeeting>(this.hubName, 'MeetingReminder');
  }

  onMeetingDeleted(): Observable<string> { // string = id
    return this.signalR.on<string>(this.hubName, 'MeetingDeleted');
  }

  onRecordingResumed(): Observable<Meeting> {
    return this.signalR.on(this.hubRecName, 'RecordingResumed');
  }
  onRecordingPaused(): Observable<Meeting> {
    return this.signalR.on(this.hubRecName, 'RecordingPaused');
  }
  onRecordingStopped(): Observable<Meeting> {
    return this.signalR.on(this.hubRecName, 'RecordingStopped');
  }
  onRecordingStarted(): Observable<Meeting> {
    return this.signalR.on(this.hubRecName, 'RecordingStarted');
  }

  onSummaryCreated(): Observable<Meeting> {
    return this.signalR.on<Meeting>(this.hubSummaryName, 'SummaryCreated');
  }
  onSummaryProcessing(): Observable<Meeting> {
    return this.signalR.on<Meeting>(this.hubSummaryName, 'SummaryProcessing');
  }
  onSummaryCompleted(): Observable<Meeting> {
    return this.signalR.on<Meeting>(this.hubSummaryName, 'SummaryCompleted');
  }
  onTranscriptProcessing(): Observable<Meeting> {  
    return this.signalR.on<Meeting>(this.hubTranscriptName, 'TranscriptProcessing');
  }
  onTranscriptCreated(): Observable<Meeting> {
    return this.signalR.on<Meeting>(this.hubTranscriptName, 'TranscriptCreated');
  }
  onTranscriptCompleted(): Observable<Meeting> {
    return this.signalR.on<Meeting>(this.hubTranscriptName, 'TranscriptCompleted');
  }

  onNotificationMeeting(): Observable<Notifications> {
    return this.signalR.on<Notifications>(this.hubName, 'NotificationMeeting');
  }
}
