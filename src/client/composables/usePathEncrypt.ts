import { computed } from 'vue';
import { useSessionStorage, useStorage } from "@vueuse/core";
import { useEncryptConfig } from "./useEncryptConfig";
import { usePageData } from "@vuepress/client";
import { isTokenMatched } from "@encrypt-plugin/client/utils";
import {EncryptContainer, UseEncryptStatus} from "@encrypt-plugin/shared";

const STORAGE_KEY = "__VUEPRESS_ENCRYPT_STRICT_PATH_TOKEN__";

export const usePathEncrypt = (): EncryptContainer => {
  const page = usePageData();
  const encryptData = useEncryptConfig();

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

  const getStatus = (path: string): UseEncryptStatus => {
    console.log("[usePathEncrypt] 获取状态:", path);
    const { config = {} } = encryptData;

    const matchedKeys = getPathMatchedKeys(path);
    console.log("[matchedKeys] 匹配的键:", matchedKeys);

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
        isStrictMode: false,
        isDecrypt: false,
      };
    }

    return {
      isEncrypted: false,
      isLocked: false,
      isStrictMode: false,
      isDecrypt: false,
      hint: "",
    };
  };

  const currentPath = page.value.path;

  const status = computed(() => getStatus(currentPath));

  const validate = (inputToken: string, keep = false): void => {
    console.log("[usePathEncrypt] 验证密码...");
    validatePath(currentPath, inputToken, keep);
  };

  // 空实现
  const useDecrypt = (content: string, token: string): string => {
    return ""
  }

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
    useDecrypt,
    validatePath
  };

};