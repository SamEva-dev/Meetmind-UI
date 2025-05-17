import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

   private hubConnection!: HubConnection;
  private eventSubjects: Map<string, Subject<any>> = new Map();

 private readonly endPoint = '/hubs/notifications';
  private readonly baseUrl = `${environment.BASE_API}`

 

  public startConnection(endPoint:string): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.baseUrl}${endPoint}`) 
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Connection Error:', err));
  }

  on<T>(eventName: string): Observable<T> {
    if (!this.eventSubjects.has(eventName)) {
      const subject = new Subject<T>();
      this.hubConnection.on(eventName, (data: T) => {
        subject.next(data);
      });
      this.eventSubjects.set(eventName, subject);
    }
    return this.eventSubjects.get(eventName)!.asObservable();
  }

  stop(): void {
    this.hubConnection.stop()
      .then(() => console.log('SignalR Disconnected'))
      .catch(err => console.error('Error while disconnecting SignalR:', err));
  }
}
