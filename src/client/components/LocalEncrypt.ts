import type { SlotsType, VNode, PropType } from "vue";
import { defineComponent, h, onMounted, ref, watch, computed } from 'vue';
import { usePathEncrypt } from '../composables/usePathEncrypt';
import PasswordModal from './PasswordModal';

export default defineComponent({
  name: "ZhrLocalEncrypt",

  slots: Object as SlotsType<{
    default: () => VNode[] | VNode | null;
  }>,

  setup(_props, { slots }) {
    console.log("[ZhrLocalEncrypt] setup函数开始执行");
    const isMounted = ref(false);
    
    try {
      console.log("[ZhrLocalEncrypt] 尝试使用usePathEncrypt");
      const { status, validate } = usePathEncrypt();
      
      onMounted(() => {
        console.log("[ZhrLocalEncrypt] 组件已挂载");
        isMounted.value = true;
      });

      return (): VNode[] | VNode | null => {
        console.log("[ZhrLocalEncrypt] render函数执行, isMounted=", isMounted.value);
        
        if (!isMounted.value) {
          console.log("[ZhrLocalEncrypt] 组件尚未挂载，返回null");
          return null;
        }
        
        const { isEncrypted, isLocked, hint } = status.value;
        console.log("[ZhrLocalEncrypt] 状态检查: ", { isEncrypted, isLocked });

        return isEncrypted
          ? isLocked
            ? h(PasswordModal, {
                showTitle: true,
                full: true,
                hint,
                onVerify: validate,
              })
            : slots.default?.()
          : slots.default?.();
      };
    } catch (error) {
      console.error("[ZhrLocalEncrypt] 初始化错误:", error);
      
      // 出错后返回一个简单的渲染函数，避免整个组件崩溃
      return () => h('div', { class: 'encrypt-error' }, [
        h('p', '加密组件初始化失败，请检查控制台错误信息')
      ]);
    }
  },

  extendsPage(page) {
    console.log("extendsPage函数执行, page=", page);
  }
});