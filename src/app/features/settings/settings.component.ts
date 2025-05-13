import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SettingsStore } from './State/settings.store';

@Component({
  selector: 'app-settings',
  imports: [SharedModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  
  readonly store = inject(SettingsStore);

  settings = this.store.settings;

  ngOnInit() {
    this.store.load();
  }

  onSave() {
    const s = this.settings();
    if (s) this.store.save(s);
  }
}
