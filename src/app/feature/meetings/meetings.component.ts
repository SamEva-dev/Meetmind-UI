import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { CardModule } from 'primeng/card';
import { Menu } from 'primeng/menu';
import { MenuModule } from 'primeng/menu';
@Component({
  selector: 'app-meetings',
  imports: [CommonModule,
    FormsModule, 
    InputSwitchModule,
    ButtonModule,
    TableModule,
  CardModule,
MenuModule
],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.scss'
})
export class MeetingsComponent implements OnInit, OnDestroy {

  @ViewChild('audioMenu') audioMenu!: Menu;
  audioMenuItems: any[] = [];
  currentAudioMeeting: Meeting | null = null;
  
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

  get audioMeetings(): Meeting[] {
    return this.meetings.filter(m => m.audioPath);
  }
  get transcriptMeetings(): Meeting[] {
    return this.meetings.filter(m => m.transcriptState === 'Completed');
  }
  get summaryMeetings(): Meeting[] {
    return this.meetings.filter(m => m.summaryState === 'Completed');
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

  downloadAudio(meeting: Meeting):void {
    if (!meeting.audioPath) {
      this.toastService.error("Aucun fichier audio disponible");
      return;
    }
    this.meetingService.downloadAudio(meeting.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${meeting.title}.wav`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading audio:', error);
      this.toastService.error("Erreur lors du téléchargement de l'audio");
    });

  }
  downloadTranscript(meeting: Meeting):void {
    console.log('Downloading transcript for meeting:', meeting);
    if (!meeting.transcriptState || meeting.transcriptState !== 'Completed') {
      this.toastService.error("Aucun fichier de transcription disponible");
      return;
    }
    this.meetingService.downloadTranscript(meeting.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${meeting.title}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading transcript:', error);
      this.toastService.error("Erreur lors du téléchargement de la transcription");
    });
  }

  deleteAudio(meeting: Meeting):void {
    if (!meeting.audioPath) {
      this.toastService.error("Aucun fichier audio disponible");
      return;
    }
    if (confirm(`Supprimer le fichier audio de la réunion : ${meeting.title} ?`)) {
      this.meetingService.deleteAudio(meeting.id).subscribe(() => {
        this.toastService.success("Fichier audio supprimé");
        meeting.audioPath = undefined;
      }, error => {
        console.error('Error deleting audio:', error);
        this.toastService.error("Erreur lors de la suppression de l'audio");
      });
    }
  }

  deleteTranscript(meeting: Meeting):void {
    if (!meeting.transcriptPath) {
      this.toastService.error("Aucun fichier de transcription disponible");
      return;
    }
    if (confirm(`Supprimer le fichier de transcription de la réunion : ${meeting.title} ?`)) {
      this.meetingService.deleteTranscript(meeting.id).subscribe(() => {
        this.toastService.success("Fichier de transcription supprimé");
        meeting.transcriptPath = undefined;
      }, error => {
        console.error('Error deleting transcript:', error);
        this.toastService.error("Erreur lors de la suppression de la transcription");
      });
    }
  }

  downloadSummary(meeting: Meeting) { /* ... */ }
  deleteSummary(meeting: Meeting) { /* ... */ }

  openAudioMenu(event: MouseEvent, meeting: Meeting) {
    this.currentAudioMeeting = meeting;
    this.audioMenuItems = [
      {
        label: 'Transcription',
        icon: 'pi pi-file',
        command: () => this.transcribeAudio(meeting)
      },
      {
        label: 'Sommarize',
        icon: 'pi pi-align-left',
        command: () => this.summarizeAudio(meeting)
      }
    ];
    this.audioMenu.toggle(event);
  }
  
  transcribeAudio(meeting: Meeting):void{
    if (!meeting.audioPath) {
      this.toastService.error("Aucun fichier audio disponible");
      return;
    }
    this.meetingService.transcribeAudio(meeting.id).pipe(
      catchError((error) => {
        console.error('Error transcribing audio:', error);
        this.toastService.error("Erreur lors de la transcription de l'audio");
        return of(null); // Return null in case of error
      })
    ).subscribe(() => {
      this.toastService.success("Transcription démarrée");
      meeting.transcriptState = 'Queued'; 
    });  
  }

  summarizeAudio(meeting: Meeting) { /* ... */ }

  ngOnDestroy(): void {
    this.meetingSub?.unsubscribe();
    this.signalRService.stop();
  }

 
}
