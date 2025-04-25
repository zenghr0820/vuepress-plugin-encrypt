import { computed, resolveComponent } from 'vue';
import { useEncryptConfig } from './useEncryptConfig';
import { useRouter } from '@vuepress/client';

/**
 * 主题布局切换工具
 * 用于管理主题布局和加密布局之间的切换
 */
export const useThemeLayoutSwitch = () => {
  const router = useRouter();
  const config = useEncryptConfig();
  const currentPath = router.currentRoute.value?.path || '';
  
  // 获取主题布局信息
  const themeLayout = computed(() => {
    // 解析主题布局配置
    if (typeof config.themeLayout === 'string') {
      return {
        name: config.themeLayout,
        contentSlot: 'default'
      };
    } else if (config.themeLayout && typeof config.themeLayout === 'object') {
      return {
        name: config.themeLayout.name || 'Layout',
        contentSlot: config.themeLayout.contentSlot || 'default'
      };
    } else {
      return {
        name: 'Layout',
        contentSlot: 'default'
      };
    }
  });

  /**
   * 获取布局组件
   * 尝试获取当前主题的原始布局组件
   */
  const resolveThemeLayout = () => {
    // 使用Vue的resolveComponent API替代window.__VUE__.app
    let layoutComponent = null;
    
    try {
      try {
        // 尝试使用resolveComponent解析组件
        layoutComponent = resolveComponent(themeLayout.value.name);
        console.log(`[useThemeLayoutSwitch] 解析主题布局: ${themeLayout.value.name}`, layoutComponent ? '成功' : '失败');
      } catch (err) {
        console.warn(`[useThemeLayoutSwitch] 无法解析组件 ${themeLayout.value.name}:`, err);
      }
    } catch (e) {
      console.error('[useThemeLayoutSwitch] 获取主题布局失败:', e);
    }
    
    return layoutComponent;
  };

  return {
    currentPath,
    themeLayout,
    resolveThemeLayout
  };
};

export default useThemeLayoutSwitch; 