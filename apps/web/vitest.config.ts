import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.tsx'],
    globals: true,
    exclude: ['**/node_modules/**', '**/.next/**'],
    coverage: {
      provider: 'v8',
      include: ['lib/**', 'context/**', 'components/**'],
      exclude: ['**/__mocks__/**', '**/*.d.ts'],
    },
  },
})
