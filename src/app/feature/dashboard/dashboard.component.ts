import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { PanelModule } from 'primeng/panel';
import { GlobalStats, Notifications, StorageUasage } from '../../core/models/Meeting';
import { SignalRService } from '../../core/services/signalr.service';
import { DashboardService } from './services/dashboard.service';
import { catchError, of } from 'rxjs';
import { DashboardSignalRService } from './services/dashboard-signal-r.service';



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ButtonModule,CardModule,ProgressBarModule,PanelModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent  implements OnInit {

  meetingsSignalR = inject(DashboardSignalRService);

  dashboardService = inject(DashboardService);

  notifications: Notifications[] = [];
  bgClasses = [
    'bg-blue-100 text-blue-900',
    'bg-green-100 text-green-900',
    'bg-purple-100 text-purple-900',
    'bg-pink-100 text-pink-900',
    'bg-yellow-100 text-yellow-900',
    'bg-orange-100 text-orange-900'
  ];

  stats: GlobalStats = {
    meetingsCount: 0,
    totalDuration: 0,
    transcriptionsCount: 0,
    summariesCount: 0
  }

  storageUsed:number = 0; // 65%
  storageTotal:number = 0;

  recentRecordings = [
    { title: 'Réunion d\'équipe', date: '27/04/2025', duration: '45 min' },
    { title: 'Présentation client', date: '28/04/2025', duration: '80 min' }
  ];

  upcomingMeetings = [
    { title: 'Standup hebdomadaire', date: '02/05/2025', time: '09:00' },
    { title: 'Revue de projet', date: '03/05/2025', time: '14:30' }
  ];



  ngOnInit(): void {
    this.subscribeSignalRNotifications();
    this.getStocatgeUsagePercent();
    this.getGlobalStats();
  }

  subscribeSignalRNotifications() {
    this.meetingsSignalR.onNotificationMeeting().subscribe((msg: Notifications) => {
      this.addNotification({
        title: msg.title || 'Notification',
        message: msg.message || '',
        time: msg.time || new Date().toLocaleTimeString()
      });
    });
  }

  addNotification(notif: { title: string, message: string, time: string }) {
    const colorClass = this.randomColor();
    this.notifications = [
      {
        ...notif,
        id: crypto.randomUUID(),
        colorClass
      },
      ...this.notifications
    ];
  }

  getStocatgeUsagePercent() {
      this.dashboardService.getStorageUsage().pipe(
       catchError((error) => {
               console.error('Error loading meetings:', error);
              
               return of({} as StorageUasage);
             })
      ).subscribe((stats) => {
        this.storageUsed = stats.usagePercent / 100;
        this.storageTotal = stats.diskTotalGB;
      }); 
  }

  getGlobalStats() {
    this.dashboardService.getGlobalStats().pipe(
      catchError((error) => {
        console.error('Error loading global stats:', error);
        return of({} as GlobalStats);
      })
    ).subscribe((stats) => {
      this.stats = stats;
    }); 
  }

  randomColor() {
    return this.bgClasses[Math.floor(Math.random() * this.bgClasses.length)];
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  clearNotifications() {
    this.notifications = [];
  }
 
}
