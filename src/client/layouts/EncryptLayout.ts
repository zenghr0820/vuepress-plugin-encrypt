import type { VNode } from "vue";
import { defineComponent, h, computed, resolveComponent, getCurrentInstance } from 'vue';
import { useEncryptConfig } from '../composables/useEncryptConfig';
import LocalEncrypt from '../components/LocalEncrypt';

/**
 * 加密布局组件
 * 当页面需要加密时，会使用此布局替换原主题布局
 * LocalEncrypt 组件包含外部主题布局组件，提供加密保护
 */
export const EncryptLayout = defineComponent({
  name: 'ZhrEncryptLayout', // 使用独特的名称避免冲突

  setup() {
    console.log("[EncryptLayout] 加密布局组件初始化");
    const instance = getCurrentInstance();
    
    // 获取加密配置
    const encryptConfig = useEncryptConfig();
    
    // 计算要使用的布局组件名称
    const layoutName = computed(() => {
      // 优先使用前端指定的布局
    //   if (frontmatter.value.originalLayout) {
    //     console.log('[EncryptLayout] 使用前端指定布局:', frontmatter.value.originalLayout);
    //     return frontmatter.value.originalLayout;
    //   }
      // 其次使用配置中的布局
      if (encryptConfig.themeLayout) {
        const name = typeof encryptConfig.themeLayout === 'string'
          ? encryptConfig.themeLayout
          : encryptConfig.themeLayout.name || 'Layout';
        console.log('[EncryptLayout] 使用配置中布局:', name);
        return name;
      }
      // 默认使用 Layout
      console.log('[EncryptLayout] 使用默认布局: Layout');
      return 'Layout';
    });
    
    // 加密组件包含外部主题布局组件
    return (): VNode => {
      // 避免循环引用：检查要渲染的组件是否是自己
      const targetName = layoutName.value;
      const selfName = instance?.type?.name || 'ZhrEncryptLayout';
      
      if (targetName === selfName || targetName === 'ZhrEncryptLayout') {
        console.warn(`[EncryptLayout] 检测到循环引用风险: ${targetName} === ${selfName}`);
        // 降级处理：渲染一个基本内容而不是递归自身
        return h(LocalEncrypt, {}, () => [
          h('div', { class: 'encrypt-layout-default' }, [
            h('Content')
          ])
        ]);
      }
      console.log(layoutName)
      const reLa = resolveComponent(targetName)
      console.log(reLa)
      console.log(`[EncryptLayout] 渲染布局: ${targetName}`);
      return h(LocalEncrypt, () => [h(reLa)]);
    };
  }
});

export default EncryptLayout; 