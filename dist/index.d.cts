import { DrawCustomMode, DrawPolygon } from '@mapbox/mapbox-gl-draw';

interface OwnState {
    rectangle: DrawPolygon;
    startPoint?: number[];
    endPoint?: number[];
}
declare const DrawRectangleDrag: DrawCustomMode<OwnState>;

export { DrawRectangleDrag as default };
