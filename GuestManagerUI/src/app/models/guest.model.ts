export interface Guest {
  id?: number;
  name: string;
  nickname?: string;
  relationship?: string;
  speakingStyle?: string;
  memories: string[];
  personality: string[];
}

export interface CreateGuestRequest {
  name: string;
  nickname?: string;
  relationship?: string;
  speakingStyle?: string;
  memories: string[];
  personality: string[];
}
