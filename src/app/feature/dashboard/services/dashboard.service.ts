import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { GlobalStats, Meeting, PagedMeetingsResult, PagedResult, StorageUasage } from '../../../core/models/Meeting';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly api = inject(ApiService);
 
  
 getStorageUsage(): Observable<StorageUasage> {
    return this.api.get<StorageUasage>(`/Stats/storage`);
  }

  getGlobalStats(): Observable<GlobalStats> {
    return this.api.get<GlobalStats>(`/Stats/global`);
  }

  getRecentMeeting(num?:Number): Observable<PagedResult<Meeting>> {
    let url = '/meetings/recent';
        if (num) {
          url += `?number=${num}`;
        }
    return this.api.get<PagedResult<Meeting>>(url);
  }

  getUpComingMeeting(num?:number): Observable<PagedMeetingsResult> {
    let url = '/meetings/up-coming';
        if (num) {
          url += `?number=${num}`;
        }
    return this.api.get<PagedMeetingsResult>(url);
  }
}
