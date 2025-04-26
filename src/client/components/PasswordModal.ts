import type { VNode } from "vue";
import { defineComponent, h, nextTick, ref } from "vue";
import {usePageFrontmatter, usePageLang} from "@vuepress/client";

import { LockIcon } from "./icons";

import {useThemeLocaleData} from "../../client/composables";

export default defineComponent({
  name: "ZhrPasswordModal",

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

    // 获取主题语言
    const lang = usePageLang();
    console.log("[usePathEncrypt] 语言:", lang);
    const locale = useThemeLocaleData(lang.value);

    let hintHandler: number | null = null;

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

    return (): VNode =>
      h(
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
  },
});
