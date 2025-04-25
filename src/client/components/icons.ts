import type { VNode } from "vue";
import { h } from "vue";

export interface IconBaseProps {
  name?: string;
  color?: string;
  ariaLabel?: string;
}

/**
 * Icon Base Component
 */
export const IconBase = (
  { name = "", color = "currentColor", ariaLabel }: IconBaseProps, 
  { attrs, slots }: { attrs?: Record<string, any>; slots?: { default?: () => VNode | VNode[] } }
) => {
  return h(
    "svg",
    {
      "xmlns": "http://www.w3.org/2000/svg",
      "aria-hidden": ariaLabel ? "false" : "true",
      ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
      ...attrs,
      "fill": "none",
      "stroke": color,
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: ["icon", `${name}-icon`],
    },
    slots?.default ? slots.default() : []
  );
};

/**
 * Lock Icon
 */
export const LockIcon = () =>
  h(IconBase, { name: "lock" }, {
    default: () => [
      h("rect", {
        x: "3",
        y: "11",
        width: "18",
        height: "11",
        rx: "2",
        ry: "2",
      }),
      h("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }),
    ],
  });

// 设置显示名称  
(LockIcon as any).displayName = "LockIcon";
