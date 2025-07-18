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
    liveTranscriptionEnabled: boolean;
    language: string;
    transcriptionType: TranscriptionType;
    audioRecordingType: AudioRecordingType;
    whisperModelType: WhisperModelType;
    whisperDeviceType: WhisperDeviceType;
    whisperComputeType: WhisperComputeType;
    diarizationModelType: DiarizationModelType;
    summarizeDetailLevel:SummarizeDetailLevel;
  }

  export type TranscriptionType = 'Grpc' | 'Process' | 'Interop';
  export type AudioRecordingType = 'Native' | 'Process';
  export type WhisperModelType = 'Base' | 'Large' | 'LargeV2'| 'LargeV3'| 'Medium' | 'Small' | 'Tiny';
  export type WhisperDeviceType = 'CPU' | 'GPU'| 'Cuda'| 'Auto';
  export type WhisperComputeType = 'Default' | 'Int8' | 'Int16' | 'Float32' | 'Float64' | 'Auto';
  export type DiarizationModelType = 'SpeakerDiarization31' | 'Segmentation30' | 'Segmentation' | 'Auto';
  export type SummarizeDetailLevel = 'Standard' | 'Short' | 'Detailed';

 export const    transcriptionTypes = [
    { label: 'gRPC (distant)', value: 'Grpc' },
    { label: 'Process (local Python)', value: 'Process' },
    { label: 'Interop (bibliothèque native)', value: 'Interop' },
  ];
  export const audioRecordingTypes = [
    { label: 'Natif (.NET)', value: 'Native' },
    { label: 'Process (Python)', value: 'Process' }
  ];
 export const  whisperModelTypes = [
    { label: 'Base', value: 'Base' },
    { label: 'Large', value: 'Large' },
    { label: 'Large V2', value: 'LargeV2' },
    { label: 'Large V3', value: 'LargeV3' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Small', value: 'Small' },
    { label: 'Tiny', value: 'Tiny' }
  ];
  export const whisperDeviceTypes = [
    { label: 'Auto', value: 'Auto' },
    { label: 'CPU', value: 'CPU' },
    { label: 'GPU', value: 'GPU' },
    { label: 'Cuda', value: 'Cuda' }
  ];
  export const whisperComputeTypes = [
    { label: 'Défaut', value: 'Default' },
    { label: 'Int8', value: 'Int8' },
    { label: 'Int16', value: 'Int16' },
    { label: 'Float32', value: 'Float32' },
    { label: 'Float64', value: 'Float64' },
    { label: 'Auto', value: 'Auto' }
  ];
  export const diarizationModelTypes = [
    { label: 'SpeakerDiarization 3.1', value: 'SpeakerDiarization31' },
    { label: 'Segmentation 3.0', value: 'Segmentation30' },
    { label: 'Segmentation', value: 'Segmentation' },
    { label: 'Auto', value: 'Auto' }
  ];
  
  export const summarizeDetailLevels = [
    { label: 'Standard', value: 'Standard' },
    { label: 'Court', value: 'Short' },
    { label: 'Détaillé', value: 'Detailed' }
  ];
  
  export const SUPPORTED_LANGUAGES = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'pt', label: 'Português' },
    // ... Ajoute d'autres si besoin ...
  ];
  