import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Settings } from '../../core/models/settings';
import { SettingsService } from './services/settings.service';
import { catchError, of, Subscription } from 'rxjs';
import { SignalRService } from '../../core/services/signalr.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SliderModule } from 'primeng/slider';
import { DropdownModule } from 'primeng/dropdown';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, 
    InputSwitchModule,
    ButtonModule,
    CardModule,
    SliderModule,
    DropdownModule,
  MatDividerModule
],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  public settingsChanged: boolean = false;
  
  transcriptionTypes = [
  { label: 'gRPC (distant)', value: 'Grpc' },
  { label: 'Process (local Python)', value: 'Process' },
  { label: 'Interop (bibliothèque native)', value: 'Interop' },
];
audioRecordingTypes = [
  { label: 'Natif (.NET)', value: 'Native' },
  { label: 'Process (Python)', value: 'Process' }
];
whisperModelTypes = [
  { label: 'Base', value: 'Base' },
  { label: 'Large', value: 'Large' },
  { label: 'Large V2', value: 'LargeV2' },
  { label: 'Large V3', value: 'LargeV3' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Small', value: 'Small' },
  { label: 'Tiny', value: 'Tiny' }
];
whisperDeviceTypes = [
  { label: 'Auto', value: 'Auto' },
  { label: 'CPU', value: 'CPU' },
  { label: 'GPU', value: 'GPU' },
  { label: 'Cuda', value: 'Cuda' }
];
whisperComputeTypes = [
  { label: 'Défaut', value: 'Default' },
  { label: 'Int8', value: 'Int8' },
  { label: 'Int16', value: 'Int16' },
  { label: 'Float32', value: 'Float32' },
  { label: 'Float64', value: 'Float64' },
  { label: 'Auto', value: 'Auto' }
];
diarizationModelTypes = [
  { label: 'SpeakerDiarization 3.1', value: 'SpeakerDiarization31' },
  { label: 'Segmentation 3.0', value: 'Segmentation30' },
  { label: 'Segmentation', value: 'Segmentation' },
  { label: 'Auto', value: 'Auto' }
];

summarizeDetailLevels = [
  { label: 'Standard', value: 'Standard' },
  { label: 'Court', value: 'Short' },
  { label: 'Détaillé', value: 'Detailed' }
];

SUPPORTED_LANGUAGES = [
  { code: 'Auto', label: 'Automatique' },
  { code: 'Fr', label: 'Français' },
  { code: 'En', label: 'English' },
  { code: 'Es', label: 'Español' },
  { code: 'De', label: 'Deutsch' },
  { code: 'It', label: 'Italiano' },
  { code: 'Pt', label: 'Português' },
  // ... Ajoute d'autres si besoin ...
];


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
    liveTranscriptionEnabled: false,
    language: 'Fr',
    transcriptionType: 'Grpc',
    audioRecordingType: 'Native',
    whisperModelType: 'Base',
    whisperDeviceType: 'CPU',
    whisperComputeType: 'Default',
    diarizationModelType: 'SpeakerDiarization31',
    summarizeDetailLevel: 'Standard'
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
          language: 'Fr',
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
