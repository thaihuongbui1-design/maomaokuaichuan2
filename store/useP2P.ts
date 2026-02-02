import { create } from 'zustand';
import Peer, { DataConnection } from 'peerjs';
import { Role, TransferState, FileMeta, DataPacket } from '../types';

interface P2PStore extends TransferState {
  peer: Peer | null;
  myId: string | null;
  conn: DataConnection | null;
  role: Role;
  
  // File handling
  receivedChunks: ArrayBuffer[];
  currentMeta: FileMeta | null;
  
  // Actions
  initialize: (role: Role) => void;
  connectToPeer: (remoteId: string) => void;
  sendFile: (file: File) => Promise<void>;
  reset: () => void;
}

const CHUNK_SIZE = 16 * 1024; // 16KB chunks for safe WebRTC transfer

export const useP2PStore = create<P2PStore>((set, get) => ({
  peer: null,
  myId: null,
  conn: null,
  role: 'idle',
  status: 'idle',
  progress: 0,
  error: undefined,
  receivedChunks: [],
  currentMeta: null,

  initialize: (role) => {
    // Cleanup old peer if exists
    const oldPeer = get().peer;
    if (oldPeer) oldPeer.destroy();

    const peer = new Peer();

    peer.on('open', (id) => {
      set({ myId: id, role, status: 'idle', error: undefined });
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      set({ error: err.message, status: 'error' });
    });

    // Handle incoming connections (Logic for Receiver)
    peer.on('connection', (conn) => {
      if (role === 'receiver') {
        set({ conn, status: 'connected' });
        setupConnectionHandlers(conn, set, get);
      } else {
        // If we are sender, we usually initiate, but if bi-directional logic is needed later:
        conn.close(); 
      }
    });

    set({ peer, role, receivedChunks: [], currentMeta: null, progress: 0 });
  },

  connectToPeer: (remoteId) => {
    const { peer } = get();
    if (!peer) return;

    set({ status: 'connecting' });
    const conn = peer.connect(remoteId, { reliable: true });

    conn.on('open', () => {
      set({ conn, status: 'connected', error: undefined });
      setupConnectionHandlers(conn, set, get);
    });

    conn.on('error', (err) => {
      set({ status: 'error', error: 'Connection failed: ' + err.message });
    });
  },

  sendFile: async (file) => {
    const { conn } = get();
    if (!conn) return;

    set({ status: 'transferring', progress: 0 });

    // 1. Send Metadata
    const meta: DataPacket = {
      type: 'meta',
      meta: { name: file.name, size: file.size, type: file.type }
    };
    conn.send(meta);

    // 2. Read and Send Chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let chunkIndex = 0;
    const reader = new FileReader();
    let offset = 0;

    // Helper to read next chunk
    const readNextChunk = () => {
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };

    reader.onload = (e) => {
      if (conn.open) {
        const data = e.target?.result as ArrayBuffer;
        conn.send({
          type: 'chunk',
          data,
          index: chunkIndex,
          total: totalChunks
        } as DataPacket);

        offset += CHUNK_SIZE;
        chunkIndex++;
        
        // Update progress
        const percent = Math.min(100, Math.round((offset / file.size) * 100));
        set({ progress: percent });

        if (offset < file.size) {
          // Small delay to prevent flooding the data channel (backpressure handling is complex, this is a simple naive approach)
          setTimeout(readNextChunk, 10); 
        } else {
          conn.send({ type: 'complete' } as DataPacket);
          set({ status: 'completed' });
        }
      }
    };

    readNextChunk();
  },

  reset: () => {
    const { peer } = get();
    if (peer) peer.destroy();
    set({
      peer: null,
      myId: null,
      conn: null,
      role: 'idle',
      status: 'idle',
      progress: 0,
      receivedChunks: [],
      currentMeta: null,
      error: undefined
    });
  }
}));

// Helper to handle data on connection (Shared mainly for Receiver logic)
function setupConnectionHandlers(
  conn: DataConnection, 
  set: any, 
  get: () => P2PStore
) {
  conn.on('data', (data: any) => {
    const packet = data as DataPacket;
    const state = get();

    if (packet.type === 'meta') {
      set({ 
        currentMeta: packet.meta, 
        receivedChunks: [], 
        status: 'transferring', 
        progress: 0 
      });
    } else if (packet.type === 'chunk') {
      const newChunks = [...state.receivedChunks, packet.data];
      set({ receivedChunks: newChunks });
      
      // Calculate progress based on chunks received vs total expected? 
      // Simplified: Just use received bytes if we tracked them, or trust sender.
      // Better for receiver:
      if (state.currentMeta) {
         const receivedSize = newChunks.reduce((acc, chunk) => acc + chunk.byteLength, 0);
         const percent = Math.min(100, Math.round((receivedSize / state.currentMeta.size) * 100));
         set({ progress: percent });
      }

    } else if (packet.type === 'complete') {
      // Reassemble file
      const { receivedChunks, currentMeta } = get();
      if (currentMeta && receivedChunks.length > 0) {
        const blob = new Blob(receivedChunks, { type: currentMeta.type });
        const url = URL.createObjectURL(blob);
        
        // Auto-download
        const a = document.createElement('a');
        a.href = url;
        a.download = currentMeta.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      set({ status: 'completed', progress: 100 });
    }
  });

  conn.on('close', () => {
    set({ status: 'idle', conn: null });
  });
  
  conn.on('error', (err) => {
     console.error("Connection Error", err);
     set({ status: 'error', error: err.message });
  });
}
