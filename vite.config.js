// import react, { reactCompilerPreset } from '@vitejs/plugin-react'
// import babel from '@rolldown/plugin-babel'
// import { defineConfig } from 'vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     babel({ presets: [reactCompilerPreset()] })
//   ],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // o vue, etc.

export default defineConfig({
  plugins: [react()],
  base: '/', // Asegúrate de que sea '/' y NO './'
})