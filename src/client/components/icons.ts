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
      xmlns: "http://www.w3.org/2000/svg",
      class: ["icon", `${name}-icon`],
      viewBox: "0 0 1024 1024",
      fill: color,
      "aria-label": ariaLabel ?? `${name} icon`,
      ...attrs,
    },
    slots?.default ? slots.default() : []
  );
};

/**
 * Lock Icon
 */
export const LockIcon = () =>
  h(IconBase, { name: "lock" }, () =>
    h("path", {
      d: "M787.168 952.268H236.832c-30.395 0-55.033-24.638-55.033-55.033V429.45c0-30.395 24.638-55.034 55.033-55.034h82.55V264.35c0-106.38 86.238-192.618 192.618-192.618S704.618 157.97 704.618 264.35v110.066h82.55c30.395 0 55.033 24.639 55.033 55.034v467.785c0 30.395-24.639 55.033-55.033 55.033zM484.483 672.046v115.122h55.034V672.046c31.99-11.373 55.033-41.605 55.033-77.496 0-45.592-36.958-82.55-82.55-82.55s-82.55 36.958-82.55 82.55c0 35.89 23.042 66.123 55.033 77.496zM622.067 264.35c0-60.788-49.28-110.067-110.067-110.067s-110.067 49.28-110.067 110.067v110.066h220.135V264.35z",
    }),
  );

// 设置显示名称  
LockIcon.displayName = "LockIcon";
