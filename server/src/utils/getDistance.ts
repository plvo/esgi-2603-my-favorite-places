export function getDistance(
  point1: { lng: number; lat: number },
  point2: { lng: number; lat: number },
): number {
  const earthRadius = 6371; // km

  const diffLat = ((point1.lat - point2.lat) * Math.PI) / 180;
  const diffLng = ((point1.lng - point2.lng) * Math.PI) / 180;

  const arc =
    Math.cos((point2.lat * Math.PI) / 180) *
      Math.cos((point1.lat * Math.PI) / 180) *
      Math.sin(diffLng / 2) *
      Math.sin(diffLng / 2) +
    Math.sin(diffLat / 2) * Math.sin(diffLat / 2);
  const line = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));

  const distance = earthRadius * line;

  return distance;
}
