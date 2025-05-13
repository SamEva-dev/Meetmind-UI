/** Payload reçu lorsque le backend notifie une réunion à venir */
export interface UpcomingMeetingNotification {
    meetingId: string;
    title: string;
    startUtc: string;       // ISO string
    minutesBefore: number;
    source: string;         // 'google' | 'outlook' | 'local'
  }
  
  /** Payload reçu lorsque le backend demande une confirmation d'action */
  export interface RequestActionMessage {
    meetingId: string;
    action: string;         // e.g. 'start_record','give_consent'
    label?: string;         // texte à afficher dans la modal
    triggeredAtUtc?: string;
    accepted?: boolean;         // true si l'utilisateur a déjà accepté l'action*
    confirmedAtUtc?: string;   // date de confirmation de l'utilisateur
    message?: string;       // texte de retour (chemin de fichier, erreur…)
  }
  
  /** Payload reçu lorsque le backend notifie le résultat d'une action */
  export interface ActionResultMessage {
    meetingId: string;
    action: string;         // même valeur que RequestActionMessage.action
    status: 'success' | 'failed' | 'cancelled';
    message?: string;       // texte de retour (chemin de fichier, erreur…)
    completedAtUtc?: string;
  }
  