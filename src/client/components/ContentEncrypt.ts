import { defineComponent, h, resolveComponent } from 'vue';

/**
 * 内容加密组件
 * 
 * 这个组件可以插入到主题的任何插槽中，用于加密特定位置的内容
 * 实际的加密处理由 ZhrLocalEncrypt 组件负责
 */
export const ContentEncrypt = defineComponent({
  name: 'ContentEncrypt',

  props: {
    /**
     * 自定义CSS类
     */
    customClass: {
      type: String,
      default: '',
    }
  },

  setup(props, { slots }) {
    console.log("[ContentEncrypt] 初始化");
    
    try {
      // 尝试解析 LocalEncrypt 组件
      const LocalEncrypt = resolveComponent('ZhrLocalEncrypt');
      
      return () => {
        // 如果没有内容，不需要加密，直接返回空
        if (!slots.default) {
          return null;
        }
        
        // 使用 ZhrLocalEncrypt 组件包装内容
        console.log('[ContentEncrypt] 使用 ZhrLocalEncrypt 处理内容');
        return h('div', { 
          class: ['content-encrypt', props.customClass],
          style: {
            position: 'relative',
            backgroundColor: 'var(--vp-c-bg)',
            color: 'var(--vp-c-text-1)',
            borderRadius: '8px',
            padding: '24px',
            margin: '16px 0',
            border: '1px solid var(--vp-c-divider)'
          }
        }, [
          h(LocalEncrypt, {}, {
            default: () => slots.default?.()
          })
        ]);
      };
    } catch (error) {
      console.error('[ContentEncrypt] 初始化失败:', error);
      return () => h('div', { 
        class: 'content-encrypt-error',
        style: {
          padding: '16px',
          backgroundColor: '#fff2f0',
          color: '#cf1322',
          borderRadius: '4px'
        }
      }, [
        h('p', '内容加密组件初始化失败，请检查控制台错误信息')
      ]);
    }
  }
});

export default ContentEncrypt; 