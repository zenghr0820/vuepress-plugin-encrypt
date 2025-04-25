import { inject, provide, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEncryptConfig } from "./useEncryptConfig";

/**
 * 全局加密状态
 */
export function useGlobalEncrypt() {
  const encryptConfig = useEncryptConfig();
  const route = useRoute();
  const router = useRouter();
  
  const isEncrypted = ref(false);
  const isDecrypted = ref(false);
  const isLocked = ref(true);
  
  /**
   * 设置全局加密
   */
  const setupGlobalEncrypt = (): void => {
    // 检查是否需要全局加密
    if (encryptConfig.global) {
      isEncrypted.value = true;
      
      // 路由拦截
      router.beforeEach((to, from, next) => {
        if (isLocked.value) {
          // 存储尝试访问的路径
          sessionStorage.setItem("vuepress-encrypt-redirect", to.fullPath);
          // 重定向到密码页面
          next({ path: "/auth" });
        } else {
          next();
        }
      });
    }
  };
  
  /**
   * 验证密码
   */
  const verifyPassword = (password: string): boolean => {
    const { admin } = encryptConfig;
    
    if (!admin?.tokens?.length) {
      return false;
    }
    
    // 验证密码
    if (admin.tokens.includes(password)) {
      isLocked.value = false;
      isDecrypted.value = true;
      
      // 重定向到之前尝试访问的页面
      const redirectPath = sessionStorage.getItem("vuepress-encrypt-redirect");
      if (redirectPath) {
        router.push(redirectPath);
        sessionStorage.removeItem("vuepress-encrypt-redirect");
      }
      
      return true;
    }
    
    return false;
  };
  
  return {
    isEncrypted,
    isDecrypted,
    isLocked,
    setupGlobalEncrypt,
    verifyPassword
  };
}

/**
 * 设置全局加密
 */
export const setupGlobalEncrypt = (): void => {
  const { setupGlobalEncrypt: setup } = useGlobalEncrypt();
  setup();
}; 