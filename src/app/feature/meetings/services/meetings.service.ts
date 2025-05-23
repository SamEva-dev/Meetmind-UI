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
    return this.api.post<Meeting>(`/Recording/${id}/start`, {});
  }
  pauseRecording(id: string): Observable<Meeting> {
    return this.api.post<Meeting>(`/Recording/${id}/pause`, {}); 
  }
  resumeRecording(id: string): Observable<Meeting> {  
    return this.api.post<Meeting>(`/Recording/${id}/resume`, {}); 
  }
  stopRecording(id: string): Observable<Meeting> {
    return this.api.post<Meeting>(`/Recording/${id}/stop`, {}); 
  }

  transcribeAudio(id: string): Observable<Meeting> {
    return this.api.post<Meeting>(`/transcript/${id}`, {});
  }
  
  generateSummary(id: string): Observable<Meeting> {
    return this.api.post<Meeting>(`/summary/${id}`, {});
  }

  deleteMeeting(id: string): Observable<Meeting> {
    return this.api.delete<Meeting>(`/meetings/${id}`);
  }

  deleteAudio(id: string): Observable<Meeting> {
    return this.api.delete<Meeting>(`/audio/${id}`);
  }

  deleteTranscript(id: string): Observable<Meeting> {
    return this.api.delete<Meeting>(`/transcript/${id}`);
  }

  downloadAudio(meetingId: string): Observable<Blob> {
    return this.api.getBlob(`/audio/${meetingId}`);
  }

  downloadTranscript(meetingId: string): Observable<Blob> {
    return this.api.getBlob(`/transcript/${meetingId}/pdf`);
  }
}
