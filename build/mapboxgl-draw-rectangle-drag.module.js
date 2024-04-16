export default {
  onSetup() {
    const e = this.newFeature({
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [[]] },
    })
    var t
    return (
      this.addFeature(e),
      this.clearSelectedFeatures(),
      this.updateUIClasses({ mouse: 'add' }),
      this.setActionableState({ trash: !0 }),
      (t = this),
      setTimeout(() => {
        const { map: e } = t,
          a = e && e.doubleClickZoom
        e && a && a.disable()
      }, 0),
      { rectangle: e }
    )
  },
  onMouseDown(e, t) {
    t.preventDefault()
    const a = [t.lngLat.lng, t.lngLat.lat]
    ;(e.startPoint = a),
      e.rectangle.updateCoordinate('0.0', e.startPoint[0], e.startPoint[1])
  },
  onDrag(e, t) {
    e.startPoint &&
      (e.rectangle.updateCoordinate('0.1', t.lngLat.lng, e.startPoint[1]),
      e.rectangle.updateCoordinate('0.2', t.lngLat.lng, t.lngLat.lat),
      e.rectangle.updateCoordinate('0.3', e.startPoint[0], t.lngLat.lat),
      e.rectangle.updateCoordinate('0.4', e.startPoint[0], e.startPoint[1]))
  },
  onMouseUp(e, t) {
    ;(e.endPoint = [t.lngLat.lng, t.lngLat.lat]),
      this.updateUIClasses({ mouse: 'pointer' }),
      this.changeMode('simple_select', { featuresId: e.rectangle.id })
  },
  onStop(e) {
    var t
    ;(t = this),
      setTimeout(() => {
        const e = t._ctx && t._ctx.store,
          a = t.map && t.map
        ;(a || e.getInitialValue) &&
          e.getInitialConfigValue('doubleClickZoom') &&
          a.doubleClickZoom.enable()
      }, 0),
      this.updateUIClasses({ mouse: 'none' }),
      this.getFeature(e.rectangle.id) &&
        (e.rectangle.removeCoordinate('0.4'),
        e.rectangle.isValid()
          ? this.map.fire('draw.create', {
              features: [e.rectangle.toGeoJSON()],
            })
          : (this.deleteFeature([e.rectangle.id], { silent: !0 }),
            this.changeMode('simple_select', {}, { silent: !0 })))
  },
  onTrash(e) {
    this.deleteFeature([e.rectangle.id], { silent: !0 }),
      this.changeMode('simple_select')
  },
  toDisplayFeatures(e, t, a) {
    const n = t.properties.id === e.rectangle.id
    ;(t.properties.active = n.toString()), n ? e.startPoint && a(t) : a(t)
  },
}
