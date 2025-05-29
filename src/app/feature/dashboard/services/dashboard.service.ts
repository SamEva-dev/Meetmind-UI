import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { StorageUasage } from '../../../core/models/Meeting';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly api = inject(ApiService);
  
 getStorageUsage(): Observable<StorageUasage> {
    return this.api.get<StorageUasage>(`/Stats/storage`);
  }

  getGlobalStats(): Observable<any> {
    return this.api.get<any>(`/Stats/global`);
  }
}
