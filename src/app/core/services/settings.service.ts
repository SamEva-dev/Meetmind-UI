import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Settings } from '../models/settings.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly api = inject(ApiService);
  private readonly endPoint = '/settings';

  getSettings(): Observable<Settings> {
    return this.api.get<Settings>(this.endPoint);
  }

  updateSetting(settings: Settings): Observable<void> {
    return this.api.put<void>(this.endPoint, settings);
  }
}
