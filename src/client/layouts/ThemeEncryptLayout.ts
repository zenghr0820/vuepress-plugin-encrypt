import type { VNode } from "vue";
import { defineComponent, h, computed, resolveComponent, getCurrentInstance } from 'vue';
import { usePageFrontmatter } from '@vuepress/client';
import LocalEncrypt from '../components/LocalEncrypt';
import type { ThemeLayoutConfig } from '../global.d';

/**
 * 与主题集成的加密布局组件
 * 
 * 这个布局组件会尝试利用主题的布局结构，将加密内容插入到主题布局的特定位置
 * LocalEncrypt 组件包含外部主题布局组件，提供加密保护
 */
export const ThemeEncryptLayout = defineComponent({
  name: 'ZhrThemeEncryptLayout', // 使用独特的名称避免冲突

  setup() {
    console.log("[ThemeEncryptLayout] 初始化");
    const frontmatter = usePageFrontmatter();
    const instance = getCurrentInstance();
    
    // 主题布局配置
    const themeLayout = computed(() => {
      const config = frontmatter.value.themeLayout || { name: 'Layout', contentSlot: 'default' };
      return config as ThemeLayoutConfig | string;
    });
    
    // 解析主题布局组件和内容插槽
    const layoutInfo = computed(() => {
      let name = 'Layout';
      let slot = 'default';
      
      if (typeof themeLayout.value === 'string') {
        name = themeLayout.value;
      } else if (typeof themeLayout.value === 'object') {
        name = themeLayout.value.name || 'Layout';
        slot = themeLayout.value.contentSlot || 'default';
      }
      
      return { name, slot };
    });
    
    // 加密组件包含外部主题布局组件
    return (): VNode => {
      const { name: layoutName } = layoutInfo.value;
      const selfName = instance?.type?.name || 'ZhrThemeEncryptLayout';
      
      console.log(`[ThemeEncryptLayout] 使用主题布局: ${layoutName}`);
      
      // 检查循环引用
      if (layoutName === selfName || 
          layoutName === 'ZhrThemeEncryptLayout' || 
          layoutName === 'ThemeEncryptLayout') {
        console.warn(`[ThemeEncryptLayout] 检测到循环引用风险: ${layoutName}`);
        // 降级处理：直接渲染内容
        return h(LocalEncrypt, {}, () => [
          h('div', { class: 'theme-encrypt-layout-default' }, [
            h('Content')
          ])
        ]);
      }
      
      try {
        // 尝试解析主题布局组件
        return h(LocalEncrypt, {}, () => [h(resolveComponent(layoutName))]);
      } catch (error) {
        console.error(`[ThemeEncryptLayout] 无法解析主题布局组件 ${layoutName}:`, error);
        
        // 降级到基本布局，仍使用 LocalEncrypt 包装
        return h(LocalEncrypt, {}, () => [
          h('div', { class: 'theme-encrypt-layout-fallback' }, [
            h('Content')
          ])
        ]);
      }
    };
  }
});

export default ThemeEncryptLayout; 