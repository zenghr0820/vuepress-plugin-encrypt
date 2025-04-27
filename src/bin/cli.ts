import { program } from 'commander';
import { getDirname, path } from "@vuepress/utils";
import { encryptFrontmatter, decryptFrontmatter } from '@encrypt-plugin/client';
import fs from 'fs'
import { resolve, relative, dirname } from 'path';

const __dirname = getDirname(import.meta.url)

// 版本信息
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8')
)

// 递归获取目录下的所有文件
const getAllFiles = (dir: string, fileList: string[] = []): string[] => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = resolve(dir, file);
    const stat =  fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });

  return fileList;
};

// 处理单个文件
const processFile = (filePath: string, password: string, isEncrypt: boolean): void => {
  try {
    const content =  fs.readFileSync(filePath, 'utf-8');
    const processedContent = isEncrypt
      ? encryptFrontmatter(content, password, filePath)
      : decryptFrontmatter(content, password);

    fs.writeFileSync(filePath, processedContent);
    console.log(`${isEncrypt ? '加密' : '解密'}成功: ${relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`处理文件失败 ${relative(process.cwd(), filePath)}:`, error);
  }
};

// 处理文件或目录
const processPath = (path: string, password: string, isEncrypt: boolean): void => {
  const absolutePath = resolve(process.cwd(), path);

  if (!fs.existsSync(absolutePath)) {
    console.error(`路径不存在: ${path}`);
    return;
  }

  const stat = fs.statSync(absolutePath);
  if (stat.isDirectory()) {
    const files = getAllFiles(absolutePath);
    console.log(`找到 ${files.length} 个 Markdown 文件`);
    files.forEach(file => processFile(file, password, isEncrypt));
  } else if (stat.isFile() && path.endsWith('.md')) {
    processFile(absolutePath, password, isEncrypt);
  } else {
    console.error(`不支持的文件类型: ${path}`);
  }
};


program
  .name('vuepress-plugin-encrypt')
  .description('CLI 工具用于加密/解密内容')
  .version(packageJson.version)

// 加密命令
program
  .command('encrypt')
  .description('加密 Markdown 文件')
  .argument('<paths...>', '要加密的文件或目录路径')
  .option('-p, --password <password>', '加密密码')
  .action((paths: string[], options: { password: string }) => {
    if (!options.password) {
      console.error('请提供加密密码');
      process.exit(1);
    }

    paths.forEach(path => {
      processPath(path, options.password, true);
    });
  });

program
  .command('decrypt')
  .description('解密 Markdown 文件')
  .argument('<paths...>', '要解密的文件或目录路径')
  .option('-p, --password <password>', '解密密码')
  .action((paths: string[], options: { password: string }) => {
    if (!options.password) {
      console.error('请提供解密密码');
      process.exit(1);
    }

    paths.forEach(path => {
      processPath(path, options.password, false);
    });
  });

program.parse();