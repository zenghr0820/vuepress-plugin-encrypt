
import yaml from "js-yaml";

/**
 * markdown-it-better-frontmatter
 *
 * 一个增强的 Frontmatter 解析插件，能够返回:
 * - 解析后的 Frontmatter 数据
 * - 不包含 Frontmatter 的纯 Markdown 内容
 * - 原始完整内容
 *
 * 仅支持 YAML 格式的 Frontmatter
 */
/**
 * @typedef {Object} BetterFrontmatterResult
 * @property {Object} data - 解析后的 frontmatter 数据
 * @property {string} content - 不包含 frontmatter 的内容
 * @property {boolean} isEmpty - frontmatter 是否为空
 * @property {string} original - 原始完整内容
 */
// YAML frontmatter 正则表达式
const yamlRegex = /^---\s*\n([\s\S]*?)\n\s*---\s*\n/;
/**
 * BetterFrontmatter 插件
 * @param {Object} md - markdown-it 实例
 * @param {Function} callback - 回调函数，用于接收解析结果
 */
// 保存原始内容的变量
let originalContent = '';
// 最终返回的结果
let result = {
  data: {}, // 解析后的 frontmatter 数据
  content: '', // 去除 frontmatter 后的内容
  original: '', // 原始完整内容
  isEmpty: true // 是否为空 frontmatter
};
export default function betterFrontmatterPlugin(md, callback) {
  // 在解析前保存原始内容
  md.core.ruler.before('normalize', 'save_original', saveOriginal);
  // 提取并解析 Frontmatter
  md.core.ruler.before('block', 'extract_frontmatter', parseFrontmatter);
  // 在渲染完成后调用回调函数
  md.core.ruler.after('inline', 'frontmatter_callback', state => {
    // 所有处理完成后调用回调
    callback(result);
    return true;
  });
}
const saveOriginal = (state) => {
  originalContent = state.src;
  result.original = originalContent;
  return true;
};
// 提取并解析 Frontmatter
const parseFrontmatter = (state) => {
  let frontmatterMatch = state.src.match(yamlRegex);
  if (frontmatterMatch) {
    const metaContent = frontmatterMatch[1];
    try {
      // 使用yaml解析器解析yaml格式字符串
      result.metaContent = frontmatterMatch[0];
      const metaData = yaml.load(metaContent)
      // 保存解析结果
      result.meta = result.metaContent;
      result.data = metaData;

      result.isEmpty = !metaData || Object.keys(metaData).length === 0;
      // 从原始内容中提取不含 frontmatter 的部分
      result.content = state.src.slice(frontmatterMatch[0].length).trim();
      // 替换 state.src 为不含 frontmatter 的内容
      state.src = result.content;
    }
    catch (error) {
      console.error('Error parsing front matter:', error);
      result.data = {};
      result.isEmpty = true;
      result.content = state.src;
    }
  }
  else {
    // 没有 front matter 元素
    result.data = {};
    result.isEmpty = true;
    result.content = state.src;
  }
  return true;
};
