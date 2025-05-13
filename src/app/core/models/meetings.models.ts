export interface MeetingDto {
    id: string;
    title: string;
    startUtc: string;
    state: 'Pending' | 'Recording' | 'Paused' | 'Processing' | 'Done';
    durationSec?: number;
    speakers?: { label: string; mappedName?: string }[];
  }