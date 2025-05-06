import type { VNode } from "vue";
import { defineComponent, h, nextTick, ref, onMounted } from "vue";
import {usePageFrontmatter, usePageLang} from "@vuepress/client";

import { LockIcon } from "./icons";

import {useThemeLocaleData} from "../../client/composables";
import "../styles/password-modal.scss";


export default defineComponent({
  name: "PasswordModal",

  props: {
    /**
     * Password hint
     */
    hint: String,

    /**
     * Whether is fullscreen
     *
     * 是否是全屏
     */
    full: Boolean,

    /**
     * Whether to show title
     *
     * 是否显示标题
     */
    showTitle: Boolean,
  },

  emits: ["verify"],

  setup(props, { emit }) {
    const frontmatter = usePageFrontmatter();
    const password = ref("");
    const hasTried = ref(false);
    const remember = ref(false);
    const ready = ref(false);

    // 获取主题语言
    const lang = usePageLang();
    const locale = useThemeLocaleData(lang.value);

    let hintHandler: number | null = null;

    // 组件挂载时注入CSS
    onMounted(() => {
      // if (!cssInitialized) {
      //   // 只在首次加载时注入全局CSS
      //   injectCSS(passwordModalCSS, 'password-modal-styles');
      //   cssInitialized = true;
      // }
      
      // 确保组件渲染同步
      nextTick(() => {
        ready.value = true;
      });

      // 组件卸载时清理
      return () => {
        if (hintHandler) {
          clearTimeout(hintHandler);
          hintHandler = null;
        }
      };
    });

    const verify = (): void => {
      // Clear previous handler
      if (hintHandler) clearTimeout(hintHandler);
      hasTried.value = false;

      emit("verify", password.value, remember.value);

      void nextTick().then(() => {
        hasTried.value = true;

        hintHandler = setTimeout(() => {
          hasTried.value = false;
        }, 1000) as unknown as number;
      });
    };

    return (): VNode | null => {
      // 等待组件和样式准备好
      if (!ready.value) return null;
      
      return h(
        "div",
        {
          class: [
            "vp-decrypt-layer",
            { expand: props.full || frontmatter },
          ],
        },
        [
          // props.showTitle ? h(PageTitle) : null,
          null,
          h("div", { class: "vp-decrypt-modal" }, [
            h(
              "div",
              { class: ["vp-decrypt-hint", { tried: hasTried.value }] },
              hasTried.value
                ? locale.errorHint
                : h(LockIcon, { "aria-label": locale.iconLabel }),
            ),
            props.hint
              ? h("div", { class: "vp-decrypt-hint" }, props.hint)
              : null,
            h("div", { class: "vp-decrypt-input" }, [
              h("input", {
                type: "password",
                value: password.value,
                placeholder: locale.placeholder,
                onInput: ({ target }: InputEvent) => {
                  password.value = (target as HTMLInputElement).value;
                },
                onKeydown: ({ key }: KeyboardEvent) => {
                  if (key === "Enter") verify();
                },
              }),
            ]),
            h("div", { class: "vp-remember-password" }, [
              h("input", {
                id: "remember-password",
                type: "checkbox",
                value: remember.value,
                onChange: () => {
                  remember.value = !remember.value;
                },
              }),
              h("label", { for: "remember-password" }, locale.remember),
            ]),
            h(
              "button",
              {
                type: "button",
                class: "vp-decrypt-submit",
                onClick: () => {
                  verify();
                },
              },
              "OK",
            ),
          ]),
        ],
      );
    };
  },
});
