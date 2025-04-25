declare module 'vue' {
  export const ref: any;
  export const reactive: any;
  export const provide: any;
  export const inject: any;
  export const watch: any;
  export const computed: any;
  export const defineComponent: any;
  export const resolveComponent: any;
  export const getCurrentInstance: any;
  export const h: any;
  export const onMounted: any;
  export const nextTick: any;
  export type VNode = any;
  export type PropType<T> = any;
  export type SlotsType<T> = any;
  export type FunctionalComponent<P = {}> = (props: P, ctx: any) => any;
  export type ComputedRef<T> = { value: T };
  export type DefineComponent<Props, Setup, Data = any> = any;
  export interface ComponentOptions {
    [key: string]: any;
  }
}

declare module 'vue-router' {
  export function useRoute(): any;
  export function useRouter(): any;
  export interface RouteLocationNormalized {
    fullPath: string;
    path: string;
    query: Record<string, string | string[]>;
  }
}

declare module '*.vue' {
  const component: any;
  export default component;
}

declare module '@vuepress/helper' {
  export type DefaultLocaleInfo = any;
}

declare module '@vueuse/core' {
  export function useSessionStorage<T>(key: string, defaultValue: T): any;
  export function useStorage<T>(key: string, defaultValue: T): any;
}
