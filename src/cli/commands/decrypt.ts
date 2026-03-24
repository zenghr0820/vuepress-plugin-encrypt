import {Command} from "commander";
import { processPath } from '../utils/util.js';

// 解密命令配置
export const decryptCommand = new Command('decrypt')
  .description('解密 Markdown 文件')
  .argument('<paths...>', '要解密的文件或目录路径')
  .requiredOption('-p, --password <password>', '解密密码（必填）')
  .action(async (paths: string[], options) => {
    console.log('开始执行解密操作...');
    await Promise.all(paths.map(path => processPath(path, null, options.password, false)));
  });