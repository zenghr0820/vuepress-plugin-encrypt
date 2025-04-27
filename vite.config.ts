import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

import project from './package.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  define: {
    '__APP_VERSION__': JSON.stringify(project.version)
  },
  build: {
    outDir: 'lib',
    cssCodeSplit: true,
    emptyOutDir: false, // 不清空输出目录，避免删除已复制的样式文件
    lib: {
      formats: ['es'],
      entry: {
        'node/index': path.resolve(__dirname, './src/node/index.ts'),
        'client/index': path.resolve(__dirname, './src/client/index.ts'),
        'shared/index': path.resolve(__dirname, './src/shared/index.ts')
      },
      fileName: (format, entryName) => `${entryName}.js`
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        '@vuepress/client',
        '@vuepress/core',
        '@vuepress/utils',
        '@vueuse/core',
        'crypto-es',
        'crypto-js',
        'js-yaml',
        'markdown-it',
        'markdown-it-container'
      ],
      output: {
        // 保留目录结构
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]' // 保持资源文件名称不变
      }
    },
    target: 'es2020',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
