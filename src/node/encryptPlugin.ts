// @ts-ignore
import { Plugin } from "@vuepress/core";
import { getDirname, path } from "@vuepress/utils";
import { type EncryptOptions, type EncryptConfig, type PasswordOptions, type PasswordConfig } from "../shared/encrypt.js";
import { encryptContent, encryptFrontmatter, decryptContent, decryptFrontmatter } from "../client/utils/encrypt.js";

const __dirname = getDirname(import.meta.url);

export const PLUGIN_NAME = "vuepress-plugin-zhr-encrypt";


/**
 * 将密码选项转换为密码配置
 */
export const convertPasswordOptions = (options: PasswordOptions): PasswordConfig => {
  if (typeof options === "string")
    return { tokens: [options] };
  
  if (Array.isArray(options))
    return { tokens: options };

  return {
    tokens: Array.isArray(options.password) ? options.password : [options.password],
    hint: options.hint,
  };
};

export const encryptPlugin = (options: EncryptOptions): Plugin => {
  // 配置
  const config: EncryptConfig = {
    global: options.global || false,
    admin: options.admin ? convertPasswordOptions(options.admin) : undefined,
    config: {},
    // 是否使用主题集成布局（ThemeEncrypt）而非完全替换布局（Encrypt）
    useThemeLayout: options.useThemeLayout || false,
    // 主题布局组件名称
    themeLayout: options.themeLayout || 'Layout',
  };

  // 处理配置
  if (options.config) {
    Object.entries(options.config).forEach(([key, value]) => {
      if (config.config) {
        config.config[key] = convertPasswordOptions(value);
      }
    });
  }

  return {
    name: PLUGIN_NAME,

    define: {
      __VUEPRESS_ENCRYPT_CONFIG__: config,
    },

    clientConfigFile: path.resolve(__dirname, "../client/config.js"),

    // 为需要加密的页面设置自定义布局
    // extendsPage(page) {
    //   // 检查是否需要加密此页面
    //   const needEncrypt = Object.keys(config.config || {}).some(keyPath => {
    //     return page.path.startsWith(keyPath);
    //   });

    //   // 如果需要加密，设置自定义布局
    //   if (needEncrypt) {
    //     // 保存原布局，以便在解锁后可以恢复
    //     if (page.frontmatter.layout && 
    //         page.frontmatter.layout !== 'Encrypt' && 
    //         page.frontmatter.layout !== 'ThemeEncrypt') {
    //       page.frontmatter.originalLayout = page.frontmatter.layout;
    //     }
        
    //     // 确定要使用的布局组件名称
    //     let layoutName = config.useThemeLayout ? 'ThemeEncrypt' : 'Encrypt';
        
    //     // 如果页面已指定加密布局，则优先使用页面指定的
    //     if (page.frontmatter.encryptLayout && typeof page.frontmatter.encryptLayout === 'string') {
    //       layoutName = page.frontmatter.encryptLayout;
    //     }
        
    //     // 设置为加密布局
    //     page.frontmatter.layout = layoutName;
        
    //     console.log(`[${PLUGIN_NAME}] 页面 ${page.path} 应用加密布局: ${layoutName}`);
        
    //     // 添加头部脚本，确保配置在客户端可用
    //     if (page.frontmatter.head) {
    //       page.frontmatter.head.push(['script', {}, `window.__VUEPRESS_ENCRYPT_CONFIG__ = ${JSON.stringify(config)};`]);
    //     } else {
    //       page.frontmatter.head = [
    //         ['script', {}, `window.__VUEPRESS_ENCRYPT_CONFIG__ = ${JSON.stringify(config)};`]
    //       ];
    //     }
    //   }
    // }
  };
};

export * from "../shared/encrypt.js";
export { encryptContent, encryptFrontmatter, decryptContent, decryptFrontmatter };

export default encryptPlugin; 