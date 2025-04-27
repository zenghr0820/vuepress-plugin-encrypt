import {defineClientConfig} from "@vuepress/client";
import { onMounted } from 'vue';
import LocalEncrypt from "./components/LocalEncrypt";
import {getDirname, path} from "@vuepress/utils";
import fs from "fs";
import {setupGlobalEncrypt} from "@encrypt-plugin/client/composables";

// 导入样式
import './styles/index.scss';

const __dirname = getDirname(import.meta.url);

// 版本信息
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8')
)


declare const __VUEPRESS_ENCRYPT_CONFIG__: Record<string, any>;

export default defineClientConfig({
  enhance({app}) {
    // 注册组件
    app.component("Encrypt", LocalEncrypt);
  },
  setup() {
    onMounted(() => {
      console.log(
        `%c Vuepress 加密插件 v${packageJson.version}✨ \n`,
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
