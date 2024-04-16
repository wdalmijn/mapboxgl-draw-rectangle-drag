import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',

  output: {
    file: 'build/mapboxgl-draw-rectangle-drag.module.js',
    format: 'esm',
    name: 'mapboxGLDrawRectangleDrag',
  },

  plugins: [resolve(), terser()],
}
