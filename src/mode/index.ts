import {
  DrawCustomMode,
  DrawCustomModeThis,
  MapMouseEvent,
  DrawPolygon,
} from '@mapbox/mapbox-gl-draw'
import { Feature, Polygon } from 'geojson'

import { createRectangle, enableZoom, disableZoom } from '../utils'

interface OwnState {
  rectangle: DrawPolygon
  startPoint: number[]
  endPoint: number[]
}

class DrawRectangleDrag implements DrawCustomMode<OwnState> {
  onSetup(this: DrawCustomModeThis) {
    const rectangle = this.newFeature(createRectangle()) as DrawPolygon
    this.addFeature(rectangle)

    this.clearSelectedFeatures()

    // UI Tweaks
    this.updateUIClasses({ mouse: 'add' })
    this.setActionableState({
      trash: true,
      combineFeatures: false,
      uncombineFeatures: false,
    })
    disableZoom(this)

    return { rectangle, startPoint: [] as number[], endPoint: [] as number[] }
  }

  onMouseDown(state: OwnState, event: MapMouseEvent) {
    event.preventDefault()

    const startPoint = [event.lngLat.lng, event.lngLat.lat]
    state.startPoint = startPoint

    // Starting point - minX,minY
    state.rectangle.updateCoordinate(
      '0.0',
      state.startPoint[0],
      state.startPoint[1]
    )
  }

  onDrag(state: OwnState, event: MapMouseEvent) {
    if (!state.startPoint) {
      return
    }

    // Upper right vertex - maxX, minY
    state.rectangle.updateCoordinate(
      '0.1',
      event.lngLat.lng,
      state.startPoint[1]
    )

    // Lower right vertex - maxX, maxY
    state.rectangle.updateCoordinate('0.2', event.lngLat.lng, event.lngLat.lat)

    // Lower left vertex - minX, maxY
    state.rectangle.updateCoordinate(
      '0.3',
      state.startPoint[0],
      event.lngLat.lat
    )

    // Starting point again
    state.rectangle.updateCoordinate(
      '0.4',
      state.startPoint[0],
      state.startPoint[1]
    )
  }

  onMouseUp(
    this: Pick<DrawCustomModeThis, 'updateUIClasses' | 'changeMode'>,
    state: OwnState,
    event: MapMouseEvent
  ) {
    state.endPoint = [event.lngLat.lng, event.lngLat.lat]

    this.updateUIClasses({ mouse: 'pointer' })
    this.changeMode('simple_select', { featuresId: state.rectangle.id })
  }

  onStop(
    this: Pick<
      DrawCustomModeThis,
      'deleteFeature' | 'changeMode' | 'updateUIClasses' | 'getFeature' | 'map'
    >,
    state: OwnState
  ) {
    enableZoom(this)
    this.updateUIClasses({ mouse: 'none' })

    if (!this.getFeature(`${state.rectangle.id}`)) {
      return
    }

    // Remove latest coordinate
    state.rectangle.removeCoordinate('0.4')

    if (state.rectangle.isValid()) {
      this.map.fire('draw.create', {
        features: [state.rectangle.toGeoJSON()],
      })
      return
    }

    this.deleteFeature([`${state.rectangle.id}`] as any, { silent: true })
    this.changeMode('simple_select', {}, { silent: true })
  }

  onTrash(
    this: Pick<DrawCustomModeThis, 'deleteFeature' | 'changeMode'>,
    state: OwnState
  ) {
    this.deleteFeature([`${state.rectangle.id}`] as any, { silent: true })
    this.changeMode('simple_select')
  }

  toDisplayFeatures(
    state: OwnState,
    geojson: Feature<Polygon>,
    display: Function
  ) {
    const isActivePolygon = geojson?.properties?.id === state.rectangle.id
    if (geojson?.properties?.id) {
      geojson.properties.active = isActivePolygon.toString()
    }

    if (!isActivePolygon) {
      display(geojson)
      return
    }

    if (!state.startPoint) {
      return
    }

    display(geojson)
  }
}

export default DrawRectangleDrag
