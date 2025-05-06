#!/usr/bin/env node
import { program } from 'commander';
import { fs, path } from "@vuepress/utils";
import { encryptFrontmatter, decryptFrontmatter } from '../client/utils/encrypt.js';
import { version } from '../../package.json';

// 递归获取目录下的所有文件
const getAllFiles = async (dir: string): Promise<string[]> => {
  const files = await fs.readdir(dir);
  const results = await Promise.all(files.map(async (file) => {
    const filePath = path.resolve(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      return getAllFiles(filePath);
    } else if (file.endsWith('.md')) {
      return [filePath];
    }
    return [];
  }));

  return results.flat();
};

// 处理单个文件
const processFile = async (filePath: string, password: string, isEncrypt: boolean): Promise<void> => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const processedContent = isEncrypt
      ? encryptFrontmatter(content, password, filePath)
      : decryptFrontmatter(content, password);

    await fs.writeFile(filePath, processedContent);
    console.log(`${isEncrypt ? '加密' : '解密'}成功: ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`处理文件失败 ${path.relative(process.cwd(), filePath)}:`, error);
  }
};

// 处理文件或目录
const processPath = async (filePath: string, password: string, isEncrypt: boolean): Promise<void> => {
  const absolutePath = path.resolve(process.cwd(), filePath);

  if (!(await fs.exists(absolutePath))) {
    console.error(`路径不存在: ${filePath}`);
    return;
  }

  const stat = await fs.stat(absolutePath);
  if (stat.isDirectory()) {
    const files = await getAllFiles(absolutePath);
    console.log(`找到 ${files.length} 个 Markdown 文件`);
    await Promise.all(files.map(file => processFile(file, password, isEncrypt)));
  } else if (stat.isFile() && filePath.endsWith('.md')) {
    await processFile(absolutePath, password, isEncrypt);
  } else {
    console.error(`不支持的文件类型: ${filePath}`);
  }
};


program
  .name('vuepress-plugin-encrypt')
  .description('CLI 工具用于加密/解密内容')
  .version(version)

// 加密命令
program
  .command('encrypt')
  .description('加密 Markdown 文件')
  .argument('<paths...>', '要加密的文件或目录路径')
  .requiredOption('-p, --password <password>', '加密密码（必填）')
  .action(async (paths: string[], options: { password: string }) => {
    

    await Promise.all(paths.map(path => processPath(path, options.password, true)));
  });

program
  .command('decrypt')
  .description('解密 Markdown 文件')
  .argument('<paths...>', '要解密的文件或目录路径')
  .requiredOption('-p, --password <password>', '解密密码（必填）')
  .action(async (paths: string[], options: { password: string }) => {
    

    await Promise.all(paths.map(path => processPath(path, options.password, false)));
  });

program.parse();