import {defineClientConfig} from "@vuepress/client";
import { onMounted } from 'vue';
import LocalEncrypt from "./components/LocalEncrypt";
import {setupGlobalEncrypt} from "./composables/useGlobalEncrypt";

declare const __VUEPRESS_ENCRYPT_CONFIG__: Record<string, any>;

export default defineClientConfig({
  enhance({app}) {
    // 注册组件
    app.component("Encrypt", LocalEncrypt);
  },
  setup() {
    onMounted(() => {
      console.log(__APP_VERSION__)
      console.log(
        `\n %c 🎉🎉🎉 %c %c ✨ vuepress-plugin-encrypt v${__APP_VERSION__}  Happy !! ✨ %c %c 🎉🎉🎉 \n`,
        'background: #add7fb; padding:5px 0;',
        'background: #58b0fc; padding:5px 0;',
        'color: #fff; background: #030307; padding:5px 0;',
        'background: #58b0fc; padding:5px 0;',
        'background: #add7fb; padding:5px 0;'
      );
    });
    // 设置全局加密
    if (__VUEPRESS_ENCRYPT_CONFIG__.global) {
      setupGlobalEncrypt();
    }
  },

  rootComponents: [],
});
