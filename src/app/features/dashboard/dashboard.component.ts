import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { SignalRService } from '../../core/signalr.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent  implements OnInit{
  notifications: Array<{ title: string; message: string; time: string; color: string }> = [];
  stats = {
    totalMeetings: 0,
    recordedHours: 0,
    transcripts: 0,
    summaries: 0
  };
  recentRecordings: any[] = [];
  upcomingMeetings: any[] = [];
  storageUsed = { percent: 0, used: '0 GB', total: '10 GB' };
  teamActivity = { transcriptsThisMonth: 0, avgDuration: '0 min' };

  constructor(
    private api: ApiService,
    private signalR: SignalRService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecent();
    this.loadUpcoming();
    this.loadStorage();
    this.loadTeamActivity();

    this.signalR.onUpcomingMeeting$.subscribe(n => this.pushNotification(
      'Réunion à venir', `« ${n?.title} » dans ${n?.minutesBefore} minutes`, this.formatTime(n?.startUtc!), 'info'
    ));
    this.signalR.onActionResult$.subscribe(r => {
      const color = r?.action.startsWith('start') ? 'success' : r?.action.startsWith('stop') ? 'warn' : 'accent';
      this.pushNotification(`Action : ${r?.action}`, r?.message!, new Date(r?.completedAtUtc!).toLocaleTimeString(), color);
    });
  }

  private pushNotification(title: string, message: string, time: string, color: string) {
    this.notifications.unshift({ title, message, time, color });
  }

  loadStats() {
    this.api.get<any>('/meetings/dashboard/stats').subscribe(r => this.stats = r);
  }

  loadRecent() {
    this.api.get<any[]>('/meetings/recent').subscribe(r => this.recentRecordings = r);
  }

  loadUpcoming() {
    this.api.get<any[]>('/meetings/today').subscribe(r => this.upcomingMeetings = r);
  }

  loadStorage() {
    this.api.get<any>('/storage/usage').subscribe(r => this.storageUsed = r);
  }

  loadTeamActivity() {
    this.api.get<any>('/insights/team-activity').subscribe(r => this.teamActivity = r);
  }

  formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  clearNotifications() {
    this.notifications = [];
  }

  startRecording() {
    // rediriger vers meetings ou lancer directement
  }

  openSettings() {
    // router.navigate(['/settings']);
  }

  removeNotification(notification: any): void {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }
}
