import {defineClientConfig} from "@vuepress/client";
import { onMounted } from 'vue';
import LocalEncrypt from "./components/LocalEncrypt";
import {setupGlobalEncrypt} from "./composables/useGlobalEncrypt";

// 导入样式
import './styles/index.scss';


// 版本信息
const version = '2.0.13'; // 当前版本，也可以通过import.meta.env变量注入


declare const __VUEPRESS_ENCRYPT_CONFIG__: Record<string, any>;

export default defineClientConfig({
  enhance({app}) {
    // 注册组件
    app.component("Encrypt", LocalEncrypt);
  },
  setup() {
    onMounted(() => {
      console.log(
        `%c Vuepress 加密插件 v${version}✨ \n`,
        `background: #eb507e; padding:5px; font-size:12px; color: #f9f4dc;`,
        `color: #51c4d3; font-size:12px;`
      );
    });
    // 设置全局加密
    if (__VUEPRESS_ENCRYPT_CONFIG__.global) {
      setupGlobalEncrypt();
    }
  },

  rootComponents: [],
});
