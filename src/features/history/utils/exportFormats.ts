import { Observation } from '../types';

export function exportCSV(observations: Observation[]): string {
  const header = ['id', 'type', 'species', 'scientificName', 'confidence', 'timestamp', 'location_lat', 'location_lng', 'location_accuracy', 'notes', 'modelVersion'];
  const rows = observations.map((o) => [
    o.id,
    o.type,
    o.species,
    `"${o.scientificName}"`,
    String(o.confidence),
    String(o.timestamp),
    o.location ? String(o.location.lat) : '',
    o.location ? String(o.location.lng) : '',
    o.location ? String(o.location.accuracy) : '',
    o.notes ? `"${o.notes.replace(/"/g, '""')}"` : '',
    o.modelVersion,
  ].join(','));
  return [header.join(','), ...rows].join('\n');
}

export function exportJSON(observations: Observation[]): string {
  return JSON.stringify(observations, null, 2);
}

export function exportiNaturalistCSV(observations: Observation[]): string {
  const header = ['id', 'observed_on_string', 'taxon_id', 'taxon_name', 'common_name', 'latitude', 'longitude', 'description', 'taxon_geoprivacy', 'quality_grade'];
  const rows = observations.map((o) => [
    o.id,
    new Date(o.timestamp).toISOString(),
    '',
    o.scientificName,
    o.species,
    o.location ? String(o.location.lat) : '',
    o.location ? String(o.location.lng) : '',
    o.notes || '',
    o.location ? 'open' : '',
    o.confidence >= 0.8 ? 'research' : 'casual',
  ].join(','));
  return [header.join(','), ...rows].join('\n');
}
