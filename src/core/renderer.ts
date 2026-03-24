import {createJiti} from 'jiti'
import { fs, path } from "@vuepress/utils";
import {createBuildApp, type AppConfig} from '@vuepress/core'
import MarkdownIt from 'markdown-it';
import {JitiOptions} from "jiti/lib/types";

// 加载用户配置（返回 Partial<AppConfig> 保证类型安全）
async function loadUserConfig(projectRoot: string): Promise<Partial<AppConfig>> {
  console.log('正在加载 VuePress 配置...');
  const configFile = await findConfigFile(projectRoot)
  if (!configFile) return {}

  const jiti = createJiti(import.meta.url, {
    interopDefault: true,
    baseURL: path.dirname(configFile),
  } as JitiOptions)

  // 1. 先声明为 any 以访问属性，后续再断言为 Partial<AppConfig>
  let config: any = await jiti.import(configFile)

  // 2. 安全地处理 default 属性
  if (config && typeof config === 'object' && 'default' in config) {
    config = config.default
  }

  // 3. 处理函数导出
  if (typeof config === 'function') {
    config = await config()
  }

  // 4. 断言为 Partial<AppConfig> 返回
  return config as Partial<AppConfig>
}

// 查找配置文件（支持 .js/.ts/.mjs/.cjs）
async function findConfigFile(projectRoot: string): Promise<string | null> {
  const extensions = ['.js', '.ts', '.mjs', '.cjs']
  for (const ext of extensions) {
    const configPath = path.join(projectRoot, `.vuepress/config${ext}`)
    try {
      await fs.access(configPath)
      return configPath
    } catch {
      // 继续尝试下一个扩展名
    }
  }
  return null
}

// 创建与用户构建环境一致的 Markdown 渲染器
export async function createMarkdownRenderer(projectRoot: string): Promise<MarkdownIt> {
  const userConfig = await loadUserConfig(projectRoot)
  console.log('VuePress 配置加载成功');

  const app = createBuildApp({
    source: projectRoot,                        // 必填：文档根目录
    theme: userConfig.theme ?? '@vuepress/theme-default', // 必填：主题（默认主题）
    ...userConfig,                              // 合并用户配置中的其他项
  } as AppConfig)
  console.log('正在初始化 Markdown 渲染器...');
  await app.init()
  await app.prepare()
  return app.markdown as unknown as  MarkdownIt
}