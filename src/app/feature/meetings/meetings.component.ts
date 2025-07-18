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
import { MeetingsSignalRService } from './services/meetings-signal-r.service';

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
toastService = inject(NotificationService);
meetingsSignalR = inject(MeetingsSignalRService);
private meetingSub!: Subscription;

constructor() {
}

ngOnInit(): void {
    this.refresh();

    this.meetingsSignalR.onMeetingCreated().subscribe(meeting => {
      this.meetings = [...this.meetings, meeting];
      this.selectedMeeting = meeting;
      this.toastService.success('Nouvelle réunion ajoutée !');
    });

    this.meetingsSignalR.onMeetingUpdated().subscribe(meeting => {
      const idx = this.meetings.findIndex(m => m.id === meeting.id);
      if (idx >= 0) this.meetings[idx] = meeting;
      this.toastService.info('Réunion mise à jour !');
    });

    this.meetingsSignalR.onImminentMeeting().subscribe(meeting => {
      this.toastService.success('Réunion imminent ! :'+meeting.message);
    });

    this.meetingsSignalR.onRecordingStarted().subscribe(meeting => {
      const idx = this.meetings.findIndex(m => m.id === meeting.id);
      if (idx >= 0) {
        this.meetings[idx].state = 'Recording';
        console.log('Recording started for meeting:', meeting);
        this.selectedMeeting = this.meetings[idx];
        this.toastService.success(`Enregistrement démarré pour la réunion : ${meeting.title}`);
      }
    });

    this.meetingsSignalR.onRecordingStopped().subscribe(meeting => {
      const idx = this.meetings.findIndex(m => m.id === meeting.id);
      if (idx >= 0) {
        this.meetings[idx] = meeting;
        this.selectedMeeting = this.meetings[idx];
        console.log('Recording stopped for meeting:', meeting);
        this.toastService.success(`Enregistrement arrêté pour la réunion : ${meeting.title}`);
      }
    });
    this.meetingsSignalR.onRecordingPaused().subscribe(meeting => {
      const idx = this.meetings.findIndex(m => m.id === meeting.id);
      if (idx >= 0) {
        this.meetings[idx].state = 'Paused';
        this.selectedMeeting = this.meetings[idx];
        console.log('Recording paused for meeting:', meeting);
        this.toastService.info(`Enregistrement en pause pour la réunion : ${meeting.title}`);
      }
    });
    this.meetingsSignalR.onRecordingResumed().subscribe(meeting => {
      const idx = this.meetings.findIndex(m => m.id === meeting.id);
      if (idx >= 0) {
        this.meetings[idx].state = 'Recording';
        this.selectedMeeting = this.meetings[idx];
        console.log('Recording resumed for meeting:', meeting);
        this.toastService.success(`Enregistrement repris pour la réunion : ${meeting.title}`);
      }
    }); 

    this.meetingsSignalR.onTranscriptCreated().subscribe(meeting => {
      const idx = this.meetings.findIndex(m => m.id === meeting.id);
      if (idx >= 0) {
        this.meetings[idx].transcriptState = 'Queued';
        this.selectedMeeting = this.meetings[idx];
        console.log('Transcript created for meeting:', meeting);
        this.toastService.success(`Transcription terminée pour la réunion : ${meeting.title}`);
      }
    });

    this.meetingsSignalR.onTranscriptProcessing().subscribe(meeting => {
      const idx = this.meetings.findIndex(m => m.id === meeting.id);
      if (idx >= 0) {
        this.meetings[idx].transcriptState = 'Processing';
        this.selectedMeeting = this.meetings[idx];
        console.log('Transcript Processing for meeting:', meeting);
        this.toastService.info(`Transcription en cours pour la réunion : ${meeting.title}`);
      }
    });
    
    this.meetingsSignalR.onTranscriptCompleted().subscribe(meeting => {
      const idx = this.meetings.findIndex(m => m.id === meeting.id);
      if (idx >= 0) {
        this.meetings[idx]= meeting;
        this.selectedMeeting = this.meetings[idx];
        console.log('Transcript completed for meeting:', meeting);
        this.toastService.success(`Transcription terminée pour la réunion : ${meeting.title}`);
      }
    }
    );

    this.meetingsSignalR.onLiveTranscription().subscribe((text: string ) => {
        console.log('Live transcription for meeting:', text);
      });

    this.meetingsSignalR.onSummaryProcessing().subscribe(meeting => {
      const idx = this.meetings.findIndex(m => m.id === meeting.id);
      if (idx >= 0) {
        this.meetings[idx].summaryState = 'Processing';
        this.selectedMeeting = this.meetings[idx];
        console.log('Summary Processing for meeting:', meeting);
        this.toastService.info(`Résumé en cours pour la réunion : ${meeting.title}`);
      }
    });

    this.meetingsSignalR.onSummaryCreated().subscribe(meeting => {
      const idx = this.meetings.findIndex(m => m.id === meeting.id);
      if (idx >= 0) {
        this.meetings[idx].summaryState = 'Queued';
        this.selectedMeeting = this.meetings[idx];
        console.log('Summary created for meeting:', meeting);
        this.toastService.success(`Résumé créé pour la réunion : ${meeting.title}`);
      }
    });
    this.meetingsSignalR.onSummaryCompleted().subscribe(meeting => {
      const idx = this.meetings.findIndex(m => m.id === meeting.id);
      if (idx >= 0) {
        this.meetings[idx]= meeting;
        this.selectedMeeting = this.meetings[idx];
        console.log('Summary completed for meeting:', meeting);
        this.toastService.success(`Résumé terminé pour la réunion : ${meeting.title}`);
      }
    });
  }

  refresh() {
    this.meetingService.getRecentMeetings().pipe(
      catchError((error) => {
        console.error('Error loading meetings:', error);
        this.toastService.error("Échec du chargement des réunions")
        return of([] as Meeting[]); // Return an empty array in case of error
      })
    ).subscribe((meetings: Meeting[]) => {
      console.log('Meetings loaded:', meetings);
      
      this.meetings = meetings;
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
        //this.meetings.push(meeting); // Update the list to reflect the deletion 
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
  }

 
}
