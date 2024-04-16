import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',

  output: {
    file: 'build/mapboxgl-draw-rectangle-drag.browser.js',
    format: 'iife',
    name: 'mapboxGLDrawRectangleDrag',
  },

  plugins: [resolve(), terser()],
}
