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
  startRecording(id: string): Observable<Meeting> {
    return this.api.post<Meeting>(`/meetings/${id}/Recording/start`, {});
  }
  pauseRecording(id: string): Observable<Meeting> {
    return this.api.post<Meeting>(`/meetings/${id}/Recording/pause`, {}); 
  }
  resumeRecording(id: string): Observable<Meeting> {  
    return this.api.post<Meeting>(`/meetings/${id}/Recording/resume`, {}); 
  }
  stopRecording(id: string): Observable<Meeting> {
    return this.api.post<Meeting>(`/meetings/${id}/Recording/stop`, {}); 
  }

  deleteMeeting(id: string): Observable<Meeting> {
    return this.api.delete<Meeting>(`/meetings/${id}`);
  }
}
