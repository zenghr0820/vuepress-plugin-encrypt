import MarkdownIt from 'markdown-it'
import frontmatter from '../plugins/markdown-it-frontmatter.js'
// 使用 require 导入没有类型声明的模块
import yaml from 'js-yaml'

/**
 * 使用 markdown-it 解析 Markdown 文本的 Frontmatter 和内容
 * 支持 YAML 和 TOML 格式的 Frontmatter
 *
 * 返回内容包括：
 * - data: 解析后的 frontmatter 数据对象
 * - content: 原始 markdown 内容
 * - contentHtml: 渲染后的 HTML 内容
 * - excerpt: 根据 <!-- more --> 标记提取的摘要，如果没有则返回空字符串
 * - isEmpty: frontmatter 是否为空
 *
 * @param content Markdown 文本内容
 * @returns 包含解析后的 Frontmatter 和内容的对象
 */
export const parseFrontmatter = (content: string) => {
  let data: any = {}
  // 创建 markdown-it 实例
  const md = new MarkdownIt()

  // 使用插件处理 front matter 部分
  md.use(frontmatter, function(result: string) {
    data = result
  })

  // 渲染 Markdown 内容
  md.render(content)

  // 返回解析结果
  return data
}

/**
 * 将 frontmatter 数据和内容合并为完整的 Markdown 文本
 * 注意：由于 toml 库没有内置的 stringify 方法，TOML 格式的序列化是简化实现
 *
 * @param data frontmatter 数据对象
 * @param content Markdown 内容
 * @param format frontmatter 格式，支持 'yaml' 和 'toml'，默认为 'yaml'
 * @returns 合并后的完整 Markdown 文本
 */
export const stringifyFrontmatter = (data: any, content: string, format: 'yaml' | 'toml' = 'yaml') => {
  if (!data || Object.keys(data).length === 0) {
    return content
  }

  let frontmatterStr = ''

  if (format === 'yaml') {
    // 转换为 YAML 格式
    frontmatterStr = yaml.dump(data)
  } else {
    throw new Error('不支持的 front matter 格式: ' + format)
  }

  // 组合为完整的 Markdown 文本
  if (format === 'yaml') {
    return `---\n${frontmatterStr}---\n\n${content}`
  } else {
    return `+++\n${frontmatterStr}\n+++\n\n${content}`
  }
}