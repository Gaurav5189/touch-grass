export interface PhotoResult {
  species: string;
  scientificName: string;
  confidence: number;
  description?: string;
  similar?: string[];
}
