export interface Settings {
    autoStartRecord: boolean ;
    autoTranscript: boolean;
    autoSummarize: boolean;
    autoTranslate: boolean;
    autoCancelMeeting: boolean;
    autoDeleteMeeting: boolean;
    autoStopRecord: boolean;
    notifyBeforeMinutes: number;
    notificationRepeatInterval: number;
    requireConsent: boolean;
    retentionDays: number;
    useGoogleCalendar:boolean;
    useOutlookCalendar:boolean;
    language: string;
    transcriptionType: TranscriptionType;
    audioRecordingType: AudioRecordingType
  }

  export type TranscriptionType = 'Grpc' | 'Process' | 'Interop';
   export type AudioRecordingType = 'Native' | 'Process';