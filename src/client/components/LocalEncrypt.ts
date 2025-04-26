import type { SlotsType, VNode, PropType } from "vue";
import { defineComponent, h, onMounted, ref, Teleport, computed } from 'vue';
import { usePathEncrypt, useEncryptConfig } from '../composables';
import PasswordModal from './PasswordModal';

export default defineComponent({
  name: "Encrypt",

  props: {
    keyName: String,
    owners: String,
    encrypted: Boolean
  },

  slots: Object as SlotsType<{
    default: () => VNode[] | VNode | null;
  }>,

  setup(_props, { slots }) {
    console.log(_props)
    const isMounted = ref(false);
    const { status, validate } = usePathEncrypt();

    // 获取插件配置
    const encryptData = useEncryptConfig();

    const contentContainer = ref(null);

    onMounted(() => {
      isMounted.value = true;
      // 动态探测内容容器
      contentContainer.value = document.querySelector(
        // 优先使用配置的选择器，默认探测常见选择器
        encryptData?.contentContainer ||
        "#main-content, main, .content, [vp-content]"
      );
    });

    return (): VNode[] | VNode | null => {
      const { isEncrypted, isLocked, hint } = status.value;

      return isEncrypted
        ? isMounted.value
          ? isLocked
            ? h(PasswordModal, {
              showTitle: false,
              full: true,
              hint,
              onVerify: validate,
            })
            : slots.default()
          : null
        : slots.default();
    };
  },

});