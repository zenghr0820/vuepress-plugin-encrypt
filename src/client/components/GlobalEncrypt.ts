import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue';

/**
 * 全局加密组件
 * 
 * 这个组件的作用是为每个页面添加 ZhrLocalEncrypt 组件，ZhrLocalEncrypt 组件会处理实际的加密逻辑
 */
export const GlobalEncrypt = defineComponent({
  name: 'ZhrGlobalEncrypt',

  setup() {
    console.log("[GlobalEncrypt] setup函数开始执行");
    const isMounted = ref(false);
    
    // 只在组件挂载后进行操作
    onMounted(() => {
      console.log("[GlobalEncrypt] 组件已挂载");
      isMounted.value = true;
    });
    
    try {
      // 尝试解析 LocalEncrypt 组件
      const LocalEncrypt = resolveComponent('ZhrLocalEncrypt');
      
      // 返回渲染函数
      return (slots: any) => {
        if (!isMounted.value) {
          console.log("[GlobalEncrypt] 组件尚未完全初始化，返回null");
          return null;
        }
        
        console.log("[GlobalEncrypt] 渲染内容");
        // 使用 ZhrLocalEncrypt 包装内容
        return h(LocalEncrypt, {}, {
          default: () => slots?.default?.()
        });
      };
    } catch (error) {
      console.error("[GlobalEncrypt] 初始化错误:", error);
      
      return () => null;
    }
  },
  
  // 提供render函数来处理插槽内容
  render() {
    const renderFn = this.$setup as any;
    // 将默认插槽内容传递给setup返回的函数
    return renderFn ? renderFn(this.$slots) : null;
  }
});

export default GlobalEncrypt; 