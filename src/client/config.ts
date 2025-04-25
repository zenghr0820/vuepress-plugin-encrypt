import { defineClientConfig } from "@vuepress/client";
import LocalEncrypt from "./components/LocalEncrypt";
import GlobalEncrypt from "./components/GlobalEncrypt";
import ContentEncrypt from "./components/ContentEncrypt";
import EncryptLayout from "./layouts/EncryptLayout";
import ThemeEncryptLayout from "./layouts/ThemeEncryptLayout";
import { setupGlobalEncrypt } from "./composables/useGlobalEncrypt";

// 导入样式
import './styles/index.scss';

declare const __VUEPRESS_ENCRYPT_CONFIG__: Record<string, any>;

export default defineClientConfig({
  enhance({ app }) {
    // 注册组件
    // app.component("ZhrLocalEncrypt", LocalEncrypt);
    // app.component("ZhrContentEncrypt", ContentEncrypt);
    
    // // 注册布局组件
    // app.component("EncryptLayout", EncryptLayout);
    // app.component("ThemeEncryptLayout", ThemeEncryptLayout);
  },

  setup() {
    console.log("加密组件加载....");
    // 设置全局加密
    if (__VUEPRESS_ENCRYPT_CONFIG__.global) {
      setupGlobalEncrypt();
    }
  },

  layouts: {
    // 注册自定义布局
    EncryptLayout,
    ThemeEncryptLayout
  },

  rootComponents: [
    // 添加全局密码组件，使其在每个页面自动运行
    // GlobalEncrypt
  ],
}); 