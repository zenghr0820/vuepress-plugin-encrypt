import { computed } from 'vue';
import { useSessionStorage, useStorage } from "@vueuse/core";
import { useEncryptConfig } from "./useEncryptConfig";
import { usePageData } from "@vuepress/client";
import { isTokenMatched } from "../utils";
import {EncryptContainer, UseEncryptStatus} from "../../shared";

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
    return typeof encryptData.config === 'object' && encryptData.config !== null
      ? Object.keys(encryptData.config)
        .filter((key) => decodeURI(path).startsWith(key))
        .sort((a, b) => b.length - a.length)
      : [];
  }

  const getStatus = (path: string): UseEncryptStatus => {
    const { config = {} } = encryptData;

    const matchedKeys = getPathMatchedKeys(path);

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
    validatePath(currentPath, inputToken, keep);
  };

  // 空实现
  const useDecrypt = (content: string, token: string): string => {
    return ""
  }

  const validatePath = (path: string, inputToken: string, keep = false): void => {
    const { config = {} } = encryptData;
    const matchedKeys = getPathMatchedKeys(path);

    // Some of the tokens matches
    for (const hitKey of matchedKeys)
      if (
        config[hitKey].tokens.some((token) => isTokenMatched(inputToken, token))
      ) {
        (keep ? localTokenConfig : sessionTokenConfig).value[hitKey] =
          inputToken;
        break;
      }
  };

  return {
    status,
    validate,
    useDecrypt,
    validatePath
  };

};