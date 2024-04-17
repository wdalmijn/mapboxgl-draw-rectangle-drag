import { DrawCustomModeThis } from '@mapbox/mapbox-gl-draw'

export function enableZoom(context: Pick<DrawCustomModeThis, 'map'>) {
  setTimeout(() => {
    // eslint-disable-next-line
    const store = (context as any)._ctx && (context as any)._ctx.store // is this used?
    const map = context.map && context.map

    if (!map && !store.getInitialValue) {
      return
    }

    if (!store.getInitialConfigValue('doubleClickZoom')) {
      return
    }

    map.doubleClickZoom.enable()
  }, 0)
}

export function disableZoom(context: Pick<DrawCustomModeThis, 'map'>) {
  setTimeout(() => {
    const { map } = context
    const doubleClickZoom = map && map.doubleClickZoom

    if (!map || !doubleClickZoom) {
      return
    }

    // Always disable here, as it's necessary in some cases.
    doubleClickZoom.disable()
  }, 0)
}
