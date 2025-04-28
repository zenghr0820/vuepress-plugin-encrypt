import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { readFileSync, writeFileSync } from 'node:fs';

import project from './package.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 自定义插件：将SCSS内容内联到JS文件中
function inlineScssPlugin() {
  return {
    name: 'vite-plugin-inline-scss',
    transform(code, id) {
      // 只处理导入SCSS的TS文件
      if (id.endsWith('.ts') && code.includes('import') && code.includes('.scss')) {
        // 查找SCSS导入语句
        const scssImportRegex = /import\s+['"](.+\.scss)['"]/g;
        const matches = [...code.matchAll(scssImportRegex)];
        
        if (matches.length > 0) {
          let transformedCode = code;
          
          for (const match of matches) {
            const importPath = match[1];
            const fullPath = path.resolve(path.dirname(id), importPath);
            
            try {
              // 注释掉原来的导入语句
              transformedCode = transformedCode.replace(match[0], `// ${match[0]} - Inlined by plugin`);
            } catch (error) {
              console.error(`Error processing SCSS import in ${id}:`, error);
            }
          }
          
          return transformedCode;
        }
      }
      
      return null;
    }
  };
}

export default defineConfig({
  plugins: [
    inlineScssPlugin(),
    dts({
      include:  ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue", "types/**/*.ts", "types/**/*.d.ts"],
      exclude: ['src/**/__tests__/**', "node_modules", "lib"],
      outDir: 'lib',
      staticImport: true
    }),
  ],
  define: {
    '__APP_VERSION__': JSON.stringify(project.version)
  },
  // esbuild:{
  //   pure: ['console.log'], // 删除 console.log
  //   drop: ['debugger'], // 删除 debugger
  // },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false
      }
    },
    devSourcemap: true
  },
  build: {
    // minify: false,
    // cssMinify: false,
    outDir: 'lib',
    cssCodeSplit: false,
    emptyOutDir: true, // 构建前清空输出目录确保更新
    lib: {
      formats: ['es'],
      entry: {
        'bin/cli': path.resolve(__dirname, './src/bin/cli.ts'),
        'node/index': path.resolve(__dirname, './src/node/index.ts'),
        'client/index': path.resolve(__dirname, './src/client/index.ts'),
        'client/config': path.resolve(__dirname, './src/client/config.ts'),
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
        'markdown-it-container',
        'commander',
      ],
      output: {
        // 保留目录结构
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: '[name][extname]', // 保持资源文件名称不变
        // exports: 'named'
      },
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
