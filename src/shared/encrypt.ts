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
     * Path encryption configuration
     * 
     * 路径加密配置
     */
    config?: Record<string, PasswordOptions>;
  
    /**
     * Whether to use theme-integrated layout for encryption
     * 
     * 是否使用主题集成布局进行加密（保留主题外观）
     * 
     * @default false - If false, will completely replace theme layout with encrypt layout
     */
    useThemeLayout?: boolean;

    /**
     * Theme layout configuration
     * 
     * 主题布局配置
     * 
     * @default 'Layout' - 默认使用名为Layout的组件
     */
    themeLayout?: string | {
      /**
       * Theme layout component name
       * 
       * 主题布局组件名称
       * 
       * @default 'Layout'
       */
      name?: string;
      
      /**
       * Content slot name in theme layout
       * 
       * 主题布局中的内容插槽名称
       * 
       * @default 'default'
       */
      contentSlot?: string;
    };
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
     * Whether to use theme-integrated layout for encryption
     * 
     * 是否使用主题集成布局进行加密（保留主题外观）
     * 
     * @default false - If false, will completely replace theme layout with encrypt layout
     */
    useThemeLayout?: boolean;

    /**
     * Theme layout configuration
     * 
     * 主题布局配置
     * 
     * @default 'Layout' - 默认使用名为Layout的组件
     */
    themeLayout?: string | {
      /**
       * Theme layout component name
       * 
       * 主题布局组件名称
       */
      name?: string;
      
      /**
       * Content slot name in theme layout
       * 
       * 主题布局中的内容插槽名称
       * 
       * @default 'default'
       */
      contentSlot?: string;
    };
  }