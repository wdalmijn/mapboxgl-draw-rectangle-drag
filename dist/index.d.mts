import { DrawCustomMode, DrawCustomModeThis, DrawPolygon, MapMouseEvent } from '@mapbox/mapbox-gl-draw';
import { Feature, Polygon } from 'geojson';

interface OwnState {
    rectangle: DrawPolygon;
    startPoint: number[];
    endPoint: number[];
}
declare class DrawRectangleDrag implements DrawCustomMode<OwnState> {
    onSetup(this: DrawCustomModeThis): {
        rectangle: DrawPolygon;
        startPoint: number[];
        endPoint: number[];
    };
    onMouseDown(state: OwnState, event: MapMouseEvent): void;
    onDrag(state: OwnState, event: MapMouseEvent): void;
    onMouseUp(this: Pick<DrawCustomModeThis, 'updateUIClasses' | 'changeMode' | 'drawConfig'>, state: OwnState, event: MapMouseEvent): void;
    onStop(this: Pick<DrawCustomModeThis, 'deleteFeature' | 'changeMode' | 'updateUIClasses' | 'getFeature' | 'map' | 'drawConfig'>, state: OwnState): void;
    onTrash(this: Pick<DrawCustomModeThis, 'deleteFeature' | 'changeMode' | 'drawConfig'>, state: OwnState): void;
    toDisplayFeatures(state: OwnState, geojson: Feature<Polygon>, display: Function): void;
}

export { DrawRectangleDrag as default };
