export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}


export interface Meeting {
  id: string;
  title: string;
  startUtc: string;
  endUtc?: string;
  start: string;
  end?: string;
  state: MeetingState;

  transcriptState: TranscriptState;
  summaryState: SummaryState;
  transcriptPath?: string;
  audioPath?: string;
  summaryPath?: string;
  duration?: string;
}

export type PagedMeetingsResult = PagedResult<Meeting>;

export interface ImminentMeeting {
  meetingId: string;
  message: string;
}

export interface Notifications {
  id: string;
  title: string;
  message: string;
  time: string;
  colorClass: string;
}

export interface StorageUasage {
  usedGB : number;
  usedMB : number;
  usedBytes : number;
  usagePercent: number;
  diskUsedGB : number;
  diskFreeGB  : number;
  diskTotalGB: number;
}

export interface GlobalStats{
   meetingsCount: number,
    totalDuration: number,
    transcriptionsCount: number,
    summariesCount: number
}

export type MeetingState = 'Pending' | 'Recording' | 'Paused' | 'Done' |'Cancelled';
export type SummaryState = 'NotRequested' | 'Queued' | 'Processing' | 'Completed' | 'Failed';
export type TranscriptState = 'NotRequested' | 'Queued' | 'Processing' | 'Completed' | 'Failed';
export type MeetingStateColor = 'green' | 'red' | 'blue' | 'yellow';