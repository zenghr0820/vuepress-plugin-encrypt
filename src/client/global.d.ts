import type { Component } from 'vue';

/**
 * 布局组件名称类型
 */
export type LayoutName = 'Layout' | 'NotFound' | string;

/**
 * 主题布局配置类型
 */
export interface ThemeLayoutConfig {
  /**
   * 主题布局组件名称
   * @default 'Layout'
   */
  name: LayoutName;
  
  /**
   * 主题布局中的内容插槽名称
   * @default 'default'
   */
  contentSlot?: string;
}

/**
 * 声明全局组件类型
 */
declare global {
  const Layout: Component;
  const NotFound: Component;
  const Content: Component;
}

export {}; 