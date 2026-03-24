import { fs, path } from "@vuepress/utils";
import MarkdownIt from 'markdown-it';
import { encryptFrontmatter, decryptFrontmatter } from '../../client/utils/encrypt.js';
import { createMarkdownRenderer } from '../../core/renderer.js';

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
const processFile = async (filePath: string, mdRender: MarkdownIt, password: string, isEncrypt: boolean): Promise<void> => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const processedContent = isEncrypt
      ? encryptFrontmatter(content, mdRender, password, filePath)
      : decryptFrontmatter(content, password);

    await fs.writeFile(filePath, processedContent);
    console.log(`${isEncrypt ? '加密' : '解密'}成功: ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`处理文件失败 ${path.relative(process.cwd(), filePath)}:`, error);
  }
};

// 处理文件或目录
export const processPath = async (filePath: string, mdRender: MarkdownIt, password: string, isEncrypt: boolean): Promise<void> => {
  const absolutePath = path.resolve(process.cwd(), filePath);

  if (!(await fs.exists(absolutePath))) {
    console.error(`路径不存在: ${filePath}`);
    return;
  }

  const stat = await fs.stat(absolutePath);
  if (stat.isDirectory()) {
    const files = await getAllFiles(absolutePath);
    console.log(`找到 ${files.length} 个 Markdown 文件`);
    await Promise.all(files.map(file => processFile(file, mdRender, password, isEncrypt)));
  } else if (stat.isFile() && filePath.endsWith('.md')) {
    await processFile(absolutePath, mdRender, password, isEncrypt);
  } else {
    console.error(`不支持的文件类型: ${filePath}`);
  }
};

// 获取 Markdown 渲染器
export const getMarkdownRender = async (projectRoot: string): Promise<MarkdownIt> => {
  // 解析参数
  const cwd = process.cwd();
  const projectPath = path.resolve(cwd, projectRoot);
  console.log('验证项目根目录：', projectPath)
  // 校验配置文件
  try {
    await fs.access(projectPath);
    // ========== 新增：验证 .vuepress 目录 ==========
    const vuepressDir = path.resolve(projectPath, '.vuepress');
    if (!fs.existsSync(vuepressDir)) {
      console.error(`错误：在项目根目录下未找到 .vuepress 目录`);
      console.error(`   项目根目录: ${projectRoot}`);
      console.error(`\n请检查：`);
      console.error(`   1. 是否在正确的目录下运行命令`);
      console.error(`   2. 是否通过 -r 参数指定了正确的 VuePress 项目根目录`);
      process.exit(1);
    }
    console.log(`找到 VuePress 项目: ${projectRoot}`);
    // ===============================================
  } catch {
    console.error('VuePress项目根目录不存在：', projectPath);
    process.exit(1);
  }
  console.log('解析VuePress配置文件：', projectPath)
  const renderer = await createMarkdownRenderer(projectPath);
  console.log('渲染器初始化完成');
  console.log("-------------------")

  return renderer
};
