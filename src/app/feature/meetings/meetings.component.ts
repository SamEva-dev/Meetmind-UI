import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Meeting } from '../../core/models/Meeting';
import { MeetingsService } from './services/meetings.service';
import { catchError, of, Subscription } from 'rxjs';
import { SignalRService } from '../../core/services/signalr.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../core/services/notification.service';
@Component({
  selector: 'app-meetings',
  imports: [CommonModule,FormsModule, InputSwitchModule,ButtonModule,TableModule],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.scss'
})
export class MeetingsComponent implements OnInit, OnDestroy {
  
meetings: Meeting[] = [];
selectedMeeting?: Meeting;
isRecording = false;

meetingService = inject(MeetingsService);
signalRService = inject(SignalRService);
toastService = inject(NotificationService);
private meetingSub!: Subscription;

constructor() {
  this.signalRService.startConnection("/hubs/meeting");
}

ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.meetingService.getRecentMeetings().pipe(
      catchError((error) => {
        console.error('Error loading meetings:', error);
        return of([] as Meeting[]); // Return an empty array in case of error
      })
    ).subscribe((meetings: Meeting[]) => {
      console.log('Meetings loaded:', meetings);
      this.toastService.error("Échec du chargement des réunions")
      this.meetings = meetings;
    });

    this.meetingSub = this.signalRService.on<Meeting>('NewMeeting').subscribe(m => {
      console.log('New meeting received:', m);
      this.meetings.unshift(m);
    });
  }

  startRecording(): void {
    console.log('Starting recording for meeting:', this.selectedMeeting);
    if (!this.selectedMeeting) return;

    this.meetingService.startRecording(this.selectedMeeting.id).subscribe({
      next: () => {
        this.toastService.success("Enregistrement démarré");
        this.selectedMeeting!.state = 'Recording';
      },
      error: () => this.toastService.error("Erreur lors du démarrage de l'enregistrement")
    });
  }

  stopRecording(): void {
    if (!this.selectedMeeting) return;

    this.meetingService.stopRecording(this.selectedMeeting.id).subscribe({
      next: () => {
        this.toastService.success("Enregistrement arrêté");
        this.selectedMeeting!.state = 'Done';
      },
      error: () => this.toastService.error("Erreur lors de l'arrêt de l'enregistrement")
    });
  }

  pauseRecording(): void {
    if (!this.selectedMeeting) return;

    this.meetingService.pauseRecording(this.selectedMeeting.id).subscribe({
      next: () => {
        this.toastService.info("Enregistrement en pause");
        this.selectedMeeting!.state = 'Paused';
      },
      error: () => this.toastService.error("Erreur lors de la mise en pause")
    });
  }

  resumeRecording(): void {
    if (!this.selectedMeeting) return;

    this.meetingService.resumeRecording(this.selectedMeeting.id).subscribe({
      next: () => {
        this.toastService.success("Enregistrement repris");
        this.selectedMeeting!.state = 'Recording';
      },
      error: () => this.toastService.error("Erreur lors de la reprise de l'enregistrement")
    });
  }

  onDeleteMeeting(meeting: Meeting): void {
  if (confirm(`Supprimer la réunion : ${meeting.title} ?`)) {
    // Appeler un service REST ici si disponible
    this.meetingService.deleteMeeting(meeting.id).pipe(
      catchError((error) => {
        console.error('Error deleting meeting:', error);
        this.toastService.error("Erreur lors de la suppression de la réunion");
        return of(null); // Return null in case of error
      })
    ).subscribe(() => {
      console.log('Meeting deleted:', meeting.id);
      this.toastService.success("Réunion supprimée");
      this.meetings = this.meetings.filter(m => m.id !== meeting.id);
    });
  }
}

  ngOnDestroy(): void {
    this.meetingSub?.unsubscribe();
    this.signalRService.stop();
  }

  audioFiles = [
    { name: 'Meeting-001.wav', date: '27/04/2025' },
    { name: 'Meeting-002.wav', date: '28/04/2025' },
    { name: 'Meeting-003.wav', date: '29/04/2025' },
  ];

  transcripts = [
    { name: 'Meeting-001_transcript.txt', date: '27/04/2025' },
    { name: 'Meeting-002_transcript.txt', date: '28/04/2025' },
  ];

  summaries = [
    { name: 'Meeting-001_summary.txt', date: '27/04/2025' },
  ];
}
