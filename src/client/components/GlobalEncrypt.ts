import type { SlotsType, VNode } from "vue";
import { defineComponent, h, onMounted, ref} from 'vue';
import { useGlobalEncrypt } from '../composables';
import PasswordModal from './PasswordModal';

export default defineComponent({
  name: "GlobalEncrypt",

  slots: Object as SlotsType<{
    default: () => VNode[] | VNode | null;
  }>,

  setup(_props, { slots }) {
    const { status, validate } = useGlobalEncrypt();

    const isMounted = ref(false);

    onMounted(() => {
      isMounted.value = true;
    });

    return (): VNode => {
      const { isEncrypted, isLocked, hint } = status.value;

      return isEncrypted
        ? isMounted.value
          ? isLocked
            ? h(PasswordModal, {
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