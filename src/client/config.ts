import {defineClientConfig} from "@vuepress/client";
import {onMounted} from 'vue';
import { default as LocalEncrypt } from "./components/LocalEncrypt";
import { default as GlobalEncrypt } from "./components/GlobalEncrypt";

declare const __VUEPRESS_ENCRYPT_CONFIG__: Record<string, any>;

export default defineClientConfig({
  enhance({app}) {
    // 注册组件
    app.component("LocalEncrypt", LocalEncrypt);
    app.component("GlobalEncrypt", GlobalEncrypt);
  },
  setup() {
    onMounted(() => {
      console.log(
        `\n %c 🎉🎉🎉 %c %c ✨ vuepress-plugin-encrypt v${__APP_VERSION__}  Ready !! ✨ %c %c 🎉🎉🎉 \n`,
        'background: #add7fb; padding:5px 0;',
        'background: #58b0fc; padding:5px 0;',
        'color: #fff; background: #030307; padding:5px 0;',
        'background: #58b0fc; padding:5px 0;',
        'background: #add7fb; padding:5px 0;'
      );
    });
  },

  rootComponents: [],
});
