import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path';
import * as fs from 'fs';

const mediapipe_broken_files = [
  { names: ['Hands', 'HAND_CONNECTIONS'], path: 'hands.js' },
  { names: ['Camera'], path: 'camera_utils.js' },
  { names: ['drawConnectors', 'drawLandmarks'], path: 'drawing_utils.js' },
]

function mediapipe_workaround() {
  return {
    name: 'mediapipe_workaround',
    load(id) {
      for (const file of mediapipe_broken_files) {
        if (path.basename(id) === file.path) {
          let code = fs.readFileSync(id, 'utf-8');
          for (const name of file.names) {
            code += `exports.${name} = ${name};`;
          }
          return {code};
        }
      }
      return null;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      plugins: [
        mediapipe_workaround(),
      ]
    }
  }
})
