import { Command } from 'commander';
import { processPath, getMarkdownRender } from '../utils/util.js';


// 加密命令配置
export const encryptCommand = new Command('encrypt')
  .description('加密 Markdown 文件')
  .argument('<paths...>', '要加密的文件或目录路径')
  .requiredOption('-p, --password <password>', '加密密码（必填）')
  .option('-r, --root <path>', 'VuePress 项目根目录', 'docs')
  .action(async (paths: string[], options) => {
    const renderer = await getMarkdownRender(options.root);
    console.log('开始执行加密操作...');

    await Promise.all(paths.map(path => processPath(path, renderer, options.password, true)));
  });