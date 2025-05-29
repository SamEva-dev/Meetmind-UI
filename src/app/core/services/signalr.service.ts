// core/services/signalr.service.ts

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private connections: { [key: string]: signalR.HubConnection } = {};
  private subjects: { [key: string]: Subject<any> } = {};
  private readonly baseUrl = `${environment.BASE_API}`

  /**
   * Initialise une connexion SignalR sur un endpoint donné (si pas déjà connecté)
   * @param hubName - ex: 'meetings'
   * @param endPoint - ex: '/meetingshub'
   */
  connect(hubName: string, endPoint: string): void {
    if (this.connections[hubName]) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}${endPoint}`)
      .withAutomaticReconnect()
      .build();

    this.connections[hubName] = connection;

    connection
      .start()
      .then(() => console.log(`[SignalR] Connected to ${hubName}`))
      .catch((err) => console.error(`[SignalR] Error connecting to ${hubName}: `, err));
  }

  /**
   * S'abonner à un événement SignalR (tous hubs confondus)
   * @param hubName - ex: 'meetings'
   * @param event - ex: 'MeetingUpdated'
   */
  on<T>(hubName: string, event: string): Observable<T> {
    const key = `${hubName}_${event}`;
    if (!this.subjects[key]) {
      this.subjects[key] = new Subject<T>();
      const conn = this.connections[hubName];
      if (conn) {
        conn.on(event, (data: T) => {
          this.subjects[key].next(data);
        });
      }
    }
    return this.subjects[key].asObservable();
  }

  /**
   * Permet d'invoquer une méthode SignalR du hub côté serveur
   * @param hubName 
   * @param method 
   * @param args 
   */
  invoke(hubName: string, method: string, ...args: any[]) {
    const conn = this.connections[hubName];
    if (!conn) throw new Error('Connexion SignalR non initialisée');
    return conn.invoke(method, ...args);
  }

  disconnect(hubName: string) {
    if (this.connections[hubName]) {
      this.connections[hubName].stop();
      delete this.connections[hubName];
    }
  }
}
