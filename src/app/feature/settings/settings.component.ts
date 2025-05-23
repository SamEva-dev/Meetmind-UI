import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Settings } from '../../core/models/settings';
import { SettingsService } from './services/settings.service';
import { catchError, of, Subscription } from 'rxjs';
import { SignalRService } from '../../core/services/signalr.service';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-settings',
  imports: [FormsModule, InputSwitchModule,ButtonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  public settingsChanged: boolean = false;

settings: Settings = {
    autoStartRecord: false,
    autoTranscript: false,
    autoSummarize: false,
    autoTranslate: false,
    notifyBeforeMinutes: 0,
    notificationRepeatInterval: 0,
    retentionDays: 0,
    requireConsent: false,
    useGoogleCalendar: false,
    useOutlookCalendar: false,
    autoCancelMeeting: false,
    autoDeleteMeeting: false,
    autoStopRecord: false,
    language: 'fr',
    transcriptionType: 'Grpc',
    audioRecordingType: 'Native',
    whisperModelType: 'Base',
    whisperDeviceType: 'CPU',
    whisperComputeType: 'Default',
    diarizationModelType: 'SpeakerDiarization31'
  };

  constructor() {}
  private signalRSub?: Subscription;
  settingService = inject(SettingsService);
  signalRService = inject(SignalRService);

  ngOnInit(): void {
    // TODO: charger les paramètres depuis l'API plus tard
    this.settingService.getSettings().pipe(
      catchError((error) => {
        console.error('Error loading settings:', error);
        return of({
          autoStartRecord: false,
          autoTranscript: false,
          autoSummarize: false,
          autoTranslate: false,
          notifyBeforeMinutes: 5,
          notificationRepeatInterval: 2,
          useGoogleCalendar: false,
          useOutlookCalendar: false,
          requireConsent: false,
          retentionDays: 30,
          autoCancelMeeting: false,
          autoDeleteMeeting: false,
          autoStopRecord: false,
          language: 'fr',
          transcriptionType: 'Grpc',
          audioRecordingType: 'Native'

        } as Settings); // Return default settings in case of error
      })
    ).subscribe((settings: Settings) => {
      console.log('Settings loaded:', settings);
      this.settings = settings;
    });
  }

  saveSettings() {
    console.log('Saving settings:', this.settings);
    // TODO: envoyer les paramètres à une API (via un service)
    this.settingService.updateSettings(this.settings).pipe(
      catchError((error) => { 
        console.error('Error saving settings:', error);
        return of(this.settings); // Return current settings in case of error
      })
    ).subscribe((settings: Settings) => { 
      console.log('Settings saved:', settings);
      this.settings = settings;
      this.settingsChanged = false;
    });
  }

  onSettingsChange() {
  this.settingsChanged = true;
}
}
