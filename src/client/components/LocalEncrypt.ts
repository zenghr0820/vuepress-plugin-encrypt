import type { SlotsType, VNode } from "vue";
import { defineComponent, h, onMounted, ref, computed, nextTick } from 'vue';
import { useAutoSelectEncrypt, useEncryptConfig } from '../composables';
import PasswordModal from './PasswordModal';

/**
 * 本地加密组件
 * 支持两种模式：
 * 1. 普通模式：只加密渲染后的内容
 * 2. 严格模式：加密原始内容，解密后再渲染
 */
export default defineComponent({
  name: "LocalEncrypt",

  props: {
    token: {
      type: String,
      default: ""
    },
    mode: {
      type: String,
      default: ""
    }
  },

  slots: Object as SlotsType<{
    default: () => VNode[] | VNode | null;
  }>,

  setup(props, { slots }) {
    // 内容相关状态
    const decryptedContent = ref("");
    const isDecrypted = ref(false);
    const originalEncryptedContent = ref("");
    const encryptedContentRef = ref(null);
    const contentContainer = ref(null);

    // 自动选择
    const encryptHandle = useAutoSelectEncrypt(props.token, props.mode);
    // 组件状态
    const isMounted = ref(false);
    const { status, validate } = encryptHandle;
    // 获取插件配置
    const encryptData = useEncryptConfig();

    /**
     * 在组件挂载后初始化
     */
    onMounted(() => {
      isMounted.value = true;

      // 动态探测内容容器
      contentContainer.value = document.querySelector(
        // 优先使用配置的选择器，默认探测常见选择器
        encryptData?.contentContainer ||
        "#main-content, main, .content, [vp-content]"
      );
      
      // 如果是严格模式，获取原始加密内容
      if (props.mode === 'strict') {
        nextTick(() => {
          if (encryptedContentRef.value) {
            originalEncryptedContent.value = encryptedContentRef.value.textContent || "";
          }
          if (encryptedContentRef.value && !isDecrypted.value) {
            // 尝试解密
            console.log("try decrypt...");
            decryptedContent.value = encryptHandle.useDecrypt(originalEncryptedContent.value, props.token);
            isDecrypted.value = true;
          }
        });
      }
    });

    /**
     * 渲染函数
     */
    return (): VNode[] | VNode | null => {
      const { isEncrypted, isLocked, hint, isStrictMode } = status.value;

      // 如果不需要加密，直接显示原始内容
      if (!isEncrypted) {
        return slots.default();
      }
      
      // 如果组件未挂载，返回空
      if (!isMounted.value) {
        return null;
      }

      if (isStrictMode && originalEncryptedContent.value === "") {
        return h('div', {
          ref: encryptedContentRef,
          style: { display: "none" }  // 隐藏原始内容
        }, slots.default());
      }

      // 如果内容被锁定
      if (isLocked) {
        // 对于严格模式，我们需要先捕获原始内容再显示密码框
        if (isStrictMode && originalEncryptedContent.value === "") {
          return h('div', {
            ref: encryptedContentRef,
            style: { display: "none" }  // 隐藏原始内容
          }, slots.default());
        }
        
        // 显示密码输入框
        return h(PasswordModal, {
          showTitle: false,
          full: true,
          hint,
          onVerify: validate,
        });
      } else if (isStrictMode) {
        return h('div', {
          class: 'vuepress-markdown-body', // 添加与VuePress正常内容相同的类名
          innerHTML: decryptedContent.value
        });
      }
      
      // 普通模式或非严格模式，直接显示默认内容
      return slots.default();
    };
  },
});