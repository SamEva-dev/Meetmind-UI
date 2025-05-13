import { inject, Injectable, signal } from "@angular/core";
import { SettingsService } from "../../../core/services/settings.service";
import { Settings } from "../../../core/models/settings.model";

@Injectable({
    providedIn: 'root'
  })
export class SettingsStore {
  private readonly settingsService = inject(SettingsService);
  private readonly loading = signal(false);
  readonly settings = signal<Settings>({} as Settings);

  load() {
    this.loading.set(true);
    this.settingsService.getSettings().subscribe({
      next: s => this.settings.set(s),
      complete: () => this.loading.set(false)
    });
  }

  save(settings: Settings) {
    this.settingsService.updateSetting(settings).subscribe({
      next: () => this.settings.set(settings)
    });
  }
}
