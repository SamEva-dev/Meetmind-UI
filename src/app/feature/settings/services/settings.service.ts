import { inject, Injectable } from '@angular/core';
import { BASE_API_URL } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Settings } from '../../../core/models/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

   private readonly api = inject(ApiService);
   private readonly endPoint = '/Settings';

  getSettings():Observable<any> {
   return this.api.get<Settings>(this.endPoint);
  }
}
