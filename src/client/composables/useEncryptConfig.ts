import { type EncryptConfig } from "@encrypt-plugin/shared";

// 定义全局变量，这会被插件注入
declare const __VUEPRESS_ENCRYPT_CONFIG__: EncryptConfig;

/**
 * 获取加密配置
 * 这是获取用户设置参数的主要函数
 */
export const useEncryptConfig = (): EncryptConfig => {
  // 首先尝试从全局变量获取
  if (typeof __VUEPRESS_ENCRYPT_CONFIG__ !== 'undefined') {
    return __VUEPRESS_ENCRYPT_CONFIG__;
  }

  // 返回空配置
  console.warn("[useEncryptConfig] 未找到加密配置，返回空配置");
  return { global: false, config: {} };
};