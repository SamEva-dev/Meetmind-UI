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
    audioRecordingType: AudioRecordingType;
    whisperModelType: WhisperModelType;
    whisperDeviceType: WhisperDeviceType;
    whisperComputeType: WhisperComputeType;
    diarizationModelType: DiarizationModelType;
  }

  export type TranscriptionType = 'Grpc' | 'Process' | 'Interop';
  export type AudioRecordingType = 'Native' | 'Process';
  export type WhisperModelType = 'Base' | 'Large' | 'LargeV2'| 'LargeV3'| 'Medium' | 'Small' | 'Tiny';
  export type WhisperDeviceType = 'CPU' | 'GPU'| 'Cuda'| 'Auto';
  export type WhisperComputeType = 'Default' | 'Int8' | 'Int16' | 'Float32' | 'Float64' | 'Auto';
  export type DiarizationModelType = 'SpeakerDiarization31' | 'Segmentation30' | 'Segmentation' | 'Auto';