"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/utils/create-rectangle.ts
function createRectangle() {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [[]]
    }
  };
}

// src/utils/zoom.ts
function enableZoom(context) {
  setTimeout(() => {
    const store = context._ctx && context._ctx.store;
    const map = context.map && context.map;
    if (!map && !store.getInitialValue) {
      return;
    }
    if (!store.getInitialConfigValue("doubleClickZoom")) {
      return;
    }
    map.doubleClickZoom.enable();
  }, 0);
}
function disableZoom(context) {
  setTimeout(() => {
    const { map } = context;
    const doubleClickZoom = map && map.doubleClickZoom;
    if (!map || !doubleClickZoom) {
      return;
    }
    doubleClickZoom.disable();
  }, 0);
}

// src/mode/index.ts
var DrawRectangleDrag = {
  onSetup() {
    const rectangle = this.newFeature(createRectangle());
    this.addFeature(rectangle);
    this.clearSelectedFeatures();
    this.updateUIClasses({ mouse: "add" });
    this.setActionableState({
      trash: true,
      combineFeatures: false,
      uncombineFeatures: false
    });
    disableZoom(this);
    return { rectangle, startPoint: [], endPoint: [] };
  },
  onMouseDown(state, event) {
    event.preventDefault();
    const startPoint = [event.lngLat.lng, event.lngLat.lat];
    state.startPoint = startPoint;
    state.rectangle.updateCoordinate(
      "0.0",
      state.startPoint[0],
      state.startPoint[1]
    );
  },
  onDrag(state, event) {
    if (!state.startPoint) {
      return;
    }
    state.rectangle.updateCoordinate(
      "0.1",
      event.lngLat.lng,
      state.startPoint[1]
    );
    state.rectangle.updateCoordinate("0.2", event.lngLat.lng, event.lngLat.lat);
    state.rectangle.updateCoordinate(
      "0.3",
      state.startPoint[0],
      event.lngLat.lat
    );
    state.rectangle.updateCoordinate(
      "0.4",
      state.startPoint[0],
      state.startPoint[1]
    );
  },
  onMouseUp(state, event) {
    state.endPoint = [event.lngLat.lng, event.lngLat.lat];
    this.updateUIClasses({ mouse: "pointer" });
    this.changeMode(this.drawConfig.defaultMode, {
      featuresId: state.rectangle.id
    });
  },
  onStop(state) {
    enableZoom(this);
    this.updateUIClasses({ mouse: "none" });
    if (!this.getFeature(`${state.rectangle.id}`)) {
      return;
    }
    state.rectangle.removeCoordinate("0.4");
    if (state.rectangle.isValid()) {
      this.map.fire("draw.create", {
        features: [state.rectangle.toGeoJSON()]
      });
      return;
    }
    this.deleteFeature([`${state.rectangle.id}`], { silent: true });
    this.changeMode(
      this.drawConfig.defaultMode,
      {},
      { silent: true }
    );
  },
  onTrash(state) {
    this.deleteFeature([`${state.rectangle.id}`], { silent: true });
    this.changeMode(this.drawConfig.defaultMode);
  },
  toDisplayFeatures(state, geojson, display) {
    const isActivePolygon = geojson?.properties?.id === state.rectangle.id;
    if (geojson?.properties?.id) {
      geojson.properties.active = isActivePolygon.toString();
    }
    if (!isActivePolygon) {
      display(geojson);
      return;
    }
    if (!state.startPoint) {
      return;
    }
    display(geojson);
  }
};
var mode_default = DrawRectangleDrag;

// src/index.ts
var src_default = mode_default;
