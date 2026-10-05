import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface ObservationRecord {
  id: string;
  type: 'bird' | 'plant' | 'insect';
  species: string;
  scientificName: string;
  confidence: number;
  timestamp: number;
  location?: { lat: number; lng: number; accuracy: number };
  media?: { type: 'audio' | 'image'; blob: Blob; mimeType: string };
  notes?: string;
  modelVersion: string;
}

export interface ModelCacheEntry {
  id: string;
  url: string;
  version: string;
  downloadedAt: number;
  sizeBytes: number;
}

export interface UserSettings {
  id: string;
  themeMode: 'light' | 'dark' | 'auto';
  backend: 'webgpu' | 'wasm';
  confidenceThreshold: number;
  autoSave: boolean;
  region?: string;
}

interface TouchGrassDB extends DBSchema {
  observations: {
    key: string;
    value: ObservationRecord;
    indexes: { 'by-timestamp': number; 'by-type': ObservationRecord['type'] };
  };
  modelCache: {
    key: string;
    value: ModelCacheEntry;
  };
  settings: {
    key: string;
    value: UserSettings;
  };
}

const DB_NAME = 'touch-grass-db';
const DB_VERSION = 1;

export async function getDB(): Promise<IDBPDatabase<TouchGrassDB>> {
  return openDB<TouchGrassDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('observations')) {
        const store = db.createObjectStore('observations', { keyPath: 'id' });
        store.createIndex('by-timestamp', 'timestamp');
        store.createIndex('by-type', 'type');
      }
      if (!db.objectStoreNames.contains('modelCache')) {
        db.createObjectStore('modelCache', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    },
  });
}
