import { GeoJSON } from 'geojson'

export function createRectangle(): GeoJSON {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[]],
    },
  }
}
