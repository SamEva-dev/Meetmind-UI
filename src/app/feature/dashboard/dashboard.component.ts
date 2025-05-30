import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { PanelModule } from 'primeng/panel';
import { GlobalStats, Meeting, Notifications, PagedMeetingsResult, StorageUasage } from '../../core/models/Meeting';
import { SignalRService } from '../../core/services/signalr.service';
import { DashboardService } from './services/dashboard.service';
import { catchError, of } from 'rxjs';
import { DashboardSignalRService } from './services/dashboard-signal-r.service';
import { ScrollerModule } from 'primeng/scroller';



@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ButtonModule,CardModule,ProgressBarModule,PanelModule, ScrollerModule],
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

  storageUsed:number = 0; 
  storageTotal:number = 0;

  recentRecordings: Meeting[] = [];

  upcomingMeetings: Meeting[] = [];
 isLoadingRecordings: boolean = false;
 totalRecentRecordings: number = 0;
  totalUpcomingMeetings: number = 0;


  ngOnInit(): void {
    this.isLoadingRecordings = true;
    this.subscribeSignalRNotifications();
    this.getStocatgeUsagePercent();
    this.getGlobalStats();
    this.loadRecentRecordings(3);
    this.loadUpcomingMeeting(3);
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
  
  private randomColor() {
    return this.bgClasses[Math.floor(Math.random() * this.bgClasses.length)];
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

  loadRecentRecordings(num?:number){
    this.dashboardService.getRecentMeeting(num).pipe(
      catchError(err =>{
        console.error(err)
        return of([] as Meeting[])
      })
    ).subscribe(meetings  =>{
      console.log(meetings);
      this.recentRecordings = Array.isArray(meetings) ? meetings : meetings.items ?? [];
      this.isLoadingRecordings = false
      this.totalRecentRecordings = Array.isArray(meetings) ? meetings.length : meetings.totalCount ?? 0;
  })
  }

  loadUpcomingMeeting(num?:number){
    this.dashboardService.getUpComingMeeting(num).pipe(
      catchError(err =>{
        console.error(err);
        return of([] as Meeting[])
      })
    ).subscribe(meetings =>{
      this.upcomingMeetings = Array.isArray(meetings) ? meetings : meetings.items ?? [];;
      this.isLoadingRecordings = false;
      this.totalUpcomingMeetings = Array.isArray(meetings) ? meetings.length : meetings.totalCount ?? 0;
    })
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  clearNotifications() {
    this.notifications = [];
  }
 
}
