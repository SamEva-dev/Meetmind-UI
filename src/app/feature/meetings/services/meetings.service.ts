import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { Meeting } from '../../../core/models/Meeting';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {
  
 private readonly api = inject(ApiService);
  
 getRecentMeetings(): Observable<Meeting[]> {
    return this.api.get<Meeting[]>(`/meetings/today`);
  }

  getMeetingById(id: string): Observable<Meeting> {
    return this.api.get<Meeting>(`/meetings/${id}`);
  }

  deleteMeeting(id: string): Observable<Meeting> {
    return this.api.delete<Meeting>(`/meetings/${id}`);
  }
}
