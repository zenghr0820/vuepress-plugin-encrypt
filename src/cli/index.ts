#!/usr/bin/env node
import { program } from 'commander';
import { fileURLToPath } from 'url';
import { fs, path } from "@vuepress/utils";

import { encryptCommand } from './commands/encrypt.js';
import { decryptCommand } from './commands/decrypt.js';

// 获取当前模块的文件路径
const __filename = fileURLToPath(import.meta.url);
// 获取当前模块所在目录
const __dirname = path.dirname(__filename);
const pkgPath = path.resolve(__dirname, '../../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

// 初始化 CLI
program
  .name('vp-encrypt')
  .description('CLI 工具用于加密/解密内容')
  .version(pkg.version)

// 注册子命令
program.addCommand(encryptCommand);
program.addCommand(decryptCommand);

// 解析命令行参数
program.parse(process.argv);
