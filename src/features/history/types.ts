export interface Observation {
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
