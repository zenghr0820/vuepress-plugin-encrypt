import { type EncryptConfig } from "../../shared/encrypt";

// 定义全局变量，这会被插件注入
declare const __VUEPRESS_ENCRYPT_CONFIG__: EncryptConfig;

/**
 * 获取加密配置
 * 这是获取用户设置参数的主要函数
 */
export const useEncryptConfig = (): EncryptConfig => {
  try {
    // 首先尝试从全局变量获取
    if (typeof __VUEPRESS_ENCRYPT_CONFIG__ !== 'undefined') {
      return __VUEPRESS_ENCRYPT_CONFIG__;
    }
    
    // 如果全局变量不可用，尝试从window对象获取
    if (typeof window !== 'undefined' && 
        window.__VUEPRESS_ENCRYPT_CONFIG__) {
      return window.__VUEPRESS_ENCRYPT_CONFIG__;
    }
    
    // 返回空配置
    console.warn("[useEncryptConfig] 未找到加密配置，返回空配置");
    return { global: false, config: {} };
  } catch (error) {
    console.error("[useEncryptConfig] 获取配置失败:", error);
    // 返回默认空配置
    return { global: false, config: {} };
  }
};

// 为TypeScript声明window全局变量
declare global {
  interface Window {
    __VUEPRESS_ENCRYPT_CONFIG__?: EncryptConfig;
  }
}

/**
 * 全局加密配置接口
 */
export interface GlobalEncryptOptions {
  /**
   * 全局密码，用于路径加密
   */
  password: string;

  /**
   * 加密提示信息
   */
  hint?: string;

  /**
   * 需要加密的路径
   * 支持glob模式，例如 '/guide/**'
   */
  paths?: string | string[];
}

export interface EncryptOptions {
  /**
   * 本地密码配置
   */
  local?: {
    /**
     * 密码，用于加密内容
     */
    passwords: string[];
    
    /**
     * 加密提示信息
     */
    hint?: string;
  };

  /**
   * 全局路径加密配置
   */
  global?: GlobalEncryptOptions;

  /**
   * 是否使用主题布局集成模式
   * - true: 将在主题布局中插入密码输入界面，保留主题的导航栏、侧边栏等组件
   * - false: 完全替换主题布局，只显示密码输入界面
   * @default false
   */
  useThemeLayout?: boolean;

  /**
   * 主题布局配置，当useThemeLayout为true时生效
   */
  themeLayout?: {
    /**
     * 内容插槽名称，用于将密码输入界面插入到主题布局的指定位置
     * @default 'default'
     */
    contentSlot?: string;

    /**
     * 主题特定的额外配置
     * 可以根据不同主题的布局结构添加特定配置
     */
    [key: string]: any;
  };
}