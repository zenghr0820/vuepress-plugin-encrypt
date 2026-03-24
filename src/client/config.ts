import {defineClientConfig} from "@vuepress/client";
import {onMounted} from 'vue';
import { useEncryptConfig } from "./composables/useEncryptConfig";
import { default as LocalEncrypt } from "./components/LocalEncrypt";
import { default as GlobalEncrypt } from "./components/GlobalEncrypt";
import { version } from '../../package.json'

declare const __VUEPRESS_ENCRYPT_CONFIG__: Record<string, any>;

export default defineClientConfig({
  enhance({app}) {
    // 注册组件
    app.component("LocalEncrypt", LocalEncrypt);
    app.component("GlobalEncrypt", GlobalEncrypt);
  },
  setup() {
    // 获取插件配置
    const encryptData = useEncryptConfig();
    console.log("encryptData = ", encryptData)
    const style = encryptData?.style || null;
    if (style) {
      console.log("style = ", encryptData)
      const root = document.documentElement
      const set = (key, val) => val && root.style.setProperty(key, val)
      set('--encrypt-c-bg', style.colorBg)
      set('--encrypt-c-text', style.colorText)
      set('--encrypt-c-text-mute', style.colorTextMute)
      set('--encrypt-c-border', style.colorBorder)
      set('--encrypt-c-shadow', style.colorShadow)
      set('--encrypt-c-accent-bg', style.colorAccentBg)
      set('--encrypt-c-accent-hover', style.colorAccentHover)
      set('--encrypt-c-white', style.colorWhite)

      set('--encrypt-t-color', style.tColor)
      set('--encrypt-navbar-height', style.navbarHeight)
    }


    onMounted(() => {
      console.log(
        `\n %c 🎉🎉🎉 %c %c ✨ vuepress-plugin-encrypt v${version}  Ready !! ✨ %c %c 🎉🎉🎉 \n`,
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
