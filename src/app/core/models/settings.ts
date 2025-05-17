export interface Settings {
    autoStartRecord: boolean ;
    autoTranscript: boolean;
    autoSummarize: boolean;
    autoTranslate: boolean;
    notifyBeforeMinutes: number;
    notificationRepeatInterval: number;
    requireConsent: boolean;
    retentionDays: number;
    useGoogleCalendar:boolean;
    useOutlookCalendar:boolean;
    language: string;
  }