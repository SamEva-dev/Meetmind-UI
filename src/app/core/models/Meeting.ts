export interface Meeting {
  id: string;
  title: string;
  startUtc: string;
  endUtc?: string;
  state: MeetingState;

  transcriptState: TranscriptState;
  transcriptPath?: string;

  summaryState: SummaryState;
  summaryPath?: string;

  duration?: string;
}

export type MeetingState = 'Pending' | 'Recording' | 'Paused' | 'Done';
export type SummaryState = 'NotRequested' | 'Queued' | 'Processing' | 'Completed' | 'Failed';
export type TranscriptState = 'NotRequested' | 'Queued' | 'Processing' | 'Completed' | 'Failed';
export type MeetingStateColor = 'green' | 'red' | 'blue' | 'yellow';