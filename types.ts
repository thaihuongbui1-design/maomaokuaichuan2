export type Role = 'idle' | 'sender' | 'receiver';

export interface FileMeta {
  name: string;
  size: number;
  type: string;
}

export interface TransferState {
  status: 'idle' | 'connecting' | 'connected' | 'transferring' | 'completed' | 'error';
  progress: number; // 0 to 100
  error?: string;
  speed?: string;
}

// Data packet structure for WebRTC
export type DataPacket = 
  | { type: 'meta'; meta: FileMeta }
  | { type: 'chunk'; data: ArrayBuffer; index: number; total: number }
  | { type: 'ack'; received: number }
  | { type: 'complete' };
