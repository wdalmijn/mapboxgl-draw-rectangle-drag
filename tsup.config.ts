import { defineConfig } from 'tsup'

export default defineConfig({
  name: 'mapboxgl-draw-rectangle-drag',
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  format: ['cjs', 'esm', 'iife'],
})
