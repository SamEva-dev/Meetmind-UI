import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Settings } from '../../core/models/settings';
@Component({
  selector: 'app-settings',
  imports: [FormsModule, InputSwitchModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
settings: Settings = {
    autoStartRecord: true,
    autoTranscript: true,
    autoSummarize: false,
    autoTranslate: true,
    notifyBeforeMinutes: 5,
    notificationRepeatInterval: 2,
    requireConsent: true,
    language: 'fr'
  };

  constructor() {}

  ngOnInit(): void {
    // TODO: charger les paramètres depuis l'API plus tard
  }

  saveSettings() {
    console.log('Saving settings:', this.settings);
    // TODO: envoyer les paramètres à une API (via un service)
  }
}
