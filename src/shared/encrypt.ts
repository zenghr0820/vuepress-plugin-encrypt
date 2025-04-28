import {ComputedRef} from "vue";

export type PasswordOptions =
  | string
  | string[]
  | {
  password: string | string[];
  hint?: string;
};

/**
 * Encrypt Options
 *
 * 加密选项
 *
 * @kind root
 */
export interface EncryptOptions {
  /**
   * Whether encrypt globally
   *
   * 是否全局加密
   *
   * @default false
   */
  global?: boolean;

  /**
   * Admin passwords, which has the highest authority
   *
   * 最高权限密码
   */
  admin?: PasswordOptions;

  /**
   * Encrypt locales
   *
   * 多语言化
   */
  locales?: Record<string, EncryptLocaleData>;

  /**
   * Path encryption configuration
   *
   * 路径加密配置
   */
  config?: Record<string, PasswordOptions>;


  /**
   * Details: 工作模式，普通模式加密渲染内容，严格模式加密原始内容
   *
   *
   * 'normal' | 'strict'
   *
   * @default 'normal'
   * @Required: false
   */
  mode?: EncryptPluginType;

  /**
   * Details: 将别名定向到自己的组件
   *
   * 默认替换 theme-hope 内置的加密组件
   *
   */
  replaceComponent?: ReplaceComponentConfig;

  // 新增内容容器选择器配置
  contentContainer?: string;
}

export interface PasswordConfig {
  tokens: string[];
  hint?: string;
}

/**
 * Encrypt Config
 *
 * 加密配置
 *
 * @kind root
 */
export interface EncryptConfig {
  /**
   * Whether encrypt globally
   *
   * 是否全局加密
   *
   * @default false
   */
  global?: boolean;

  /**
   * Admin passwords, which has the highest authority
   *
   * 最高权限密码
   */
  admin?: PasswordConfig;

  /**
   * Encrypt Configuration
   *
   * 加密配置
   */
  config?: Record<string, PasswordConfig>;

  /**
   * Details: 工作模式，普通模式加密渲染内容，严格模式加密原始内容
   *
   *
   * 'normal' | 'strict'
   *
   * @default 'normal'
   * @Required: false
   */
  mode?: EncryptPluginType;

  /**
   * Encrypt locales
   *
   * 多语言化
   */
  locales?: Record<string, EncryptLocaleData>;

  /**
   * Details: 将别名定向到自己的组件
   *
   * 默认替换 theme-hope 内置的加密组件
   *
   */
  replaceComponent?: ReplaceComponentConfig;

  // 新增内容容器选择器配置
  contentContainer?: string;
}


export interface EncryptLocaleData {
  /**
   * Aria label for encrypt icon
   *
   * 加密图标的无障碍标签
   */
  iconLabel: string;

  /**
   * Password placeholder
   *
   * 密码输入框的默认占位符
   */
  placeholder: string;

  /**
   * Whether remember password
   *
   * 是否记忆密码
   */
  remember: string;

  /**
   * Password error hint
   *
   * 密码错误提示
   */
  errorHint: string;
}


export enum EncryptPluginType {
  /**
   * 工作模式，普通模式加密渲染内容
   */
  Normal = "normal",
  /**
   * 严格模式加密原始内容
   */
  Strict = "strict",
}

export interface EncryptContainer {
  status: ComputedRef<UseEncryptStatus>;
  validate: (token: string, keep?: boolean) => void;
  validatePath: (path: string, token: string, keep?: boolean) => void;
  useDecrypt: (content: string, token: string) => string;
}

export interface UseEncryptStatus {
  isEncrypted: boolean;
  isLocked: boolean;
  isStrictMode: boolean;
  isDecrypt: boolean;
  hint?: string;
}

interface ReplaceComponentConfig {
  encrypt?: string,
  globalEncrypt?: string,
}


