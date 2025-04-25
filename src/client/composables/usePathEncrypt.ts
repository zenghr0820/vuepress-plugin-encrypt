import { computed } from 'vue';
import type { ComputedRef } from "vue";
import { useSessionStorage, useStorage } from "@vueuse/core";
import { useEncryptConfig } from "./useEncryptConfig";
import { useRouter, usePageLang } from "@vuepress/client";
import { isTokenMatched } from "../utils";

const STORAGE_KEY = "VUEPRESS_ENCRYPT_PATH_TOKEN";

export interface PathEncrypt {
  status: ComputedRef<PathEncryptStatus>;
  getStatus: (path: string) => PathEncryptStatus;
  validate: (token: string, keep?: boolean) => void;
  validatePath: (path: string, token: string, keep?: boolean) => void;
}

export interface PathEncryptStatus {
  isEncrypted: boolean;
  isLocked: boolean;
  hint?: string;
}

export const usePathEncrypt = (): PathEncrypt => {
  console.log("[usePathEncrypt] 开始初始化");
  
  try {
    // const lang = usePageLang();
    // console.log("[usePathEncrypt] 语言:", lang);
    
    const encryptData = useEncryptConfig();
    console.log("[usePathEncrypt] 加密数据配置已获取:", encryptData ? "成功" : "失败");
    
    const localTokenConfig = useStorage<Record<string, string>>(STORAGE_KEY, {});
    const sessionTokenConfig = useSessionStorage<Record<string, string>>(
      STORAGE_KEY,
      {},
    );

    const getPathMatchedKeys = (path: string): string[] => {
      console.log("[usePathEncrypt] 检查路径匹配:", path);
      return typeof encryptData.config === 'object' && encryptData.config !== null
        ? Object.keys(encryptData.config)
            .filter((key) => decodeURI(path).startsWith(key))
            .sort((a, b) => b.length - a.length)
        : [];
    }

    const getStatus = (path: string): PathEncryptStatus => {
      console.log("[usePathEncrypt] 获取状态:", path);
      const { config = {} } = encryptData;

      const matchedKeys = getPathMatchedKeys(path);
      console.log("[usePathEncrypt] 匹配的键:", matchedKeys);

      if (matchedKeys.length > 0) {
        const firstKeyWithHint = matchedKeys.find((key) => config[key].hint);

        return {
          isEncrypted: true,
          isLocked: matchedKeys.some(
            (key) =>
              (localTokenConfig.value[key]
                ? config[key].tokens.every(
                    (token) =>
                      !isTokenMatched(localTokenConfig.value[key], token),
                  )
                : true) &&
              (sessionTokenConfig.value[key]
                ? config[key].tokens.every(
                    (token) =>
                      !isTokenMatched(sessionTokenConfig.value[key], token),
                  )
                : true),
          ),
          hint: firstKeyWithHint ? config[firstKeyWithHint].hint! : "",
        };
      }

      return {
        isEncrypted: false,
        isLocked: false,
        hint: "",
      };
    };

    
    // const page = usePageData();
    const router = useRouter();
    console.log("[usePathEncrypt] 路由器:", router.currentRoute.value);
    let currentPath;
    // 初始化当前路径
    if (router && router.currentRoute.value) {
      currentPath = router.currentRoute.value.path;
      console.log("[GlobalEncrypt] 初始路径:", currentPath);
    } else {
      console.log("[GlobalEncrypt] 路由器未就绪");
    }
    // console.log("[usePathEncrypt] 页面数据:", page.value.path);
    console.log("[usePathEncrypt] 当前路径:", currentPath);
    
    const status = computed(() => getStatus(currentPath));

    const validate = (inputToken: string, keep = false): void => {
      console.log("[usePathEncrypt] 验证密码");
      validatePath(currentPath, inputToken, keep);
    };
    
    const validatePath = (path: string, inputToken: string, keep = false): void => {
      console.log("[usePathEncrypt] 验证路径密码:", path);
      const { config = {} } = encryptData;
      const matchedKeys = getPathMatchedKeys(path);

      // Some of the tokens matches
      for (const hitKey of matchedKeys)
        if (
          config[hitKey].tokens.some((token) => isTokenMatched(inputToken, token))
        ) {
          (keep ? localTokenConfig : sessionTokenConfig).value[hitKey] =
            inputToken;
          console.log("[usePathEncrypt] 密码验证成功");
          break;
        }
    };

    return {
      status,
      getStatus,
      validate,
      validatePath
    };
  } catch (error) {
    console.error("[usePathEncrypt] 初始化错误:", error);
    
    // 返回默认值避免应用崩溃
    return {
      status: computed(() => ({ isEncrypted: false, isLocked: false, hint: "" })),
      getStatus: () => ({ isEncrypted: false, isLocked: false, hint: "" }),
      validate: () => { console.error("[usePathEncrypt] 验证失败 - 组件未正确初始化"); },
      validatePath: () => { console.error("[usePathEncrypt] 路径验证失败 - 组件未正确初始化"); }
    };
  }
};