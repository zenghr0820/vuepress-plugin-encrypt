import {computed} from 'vue';
import {useSessionStorage, useStorage} from "@vueuse/core";
import {EncryptContainer, UseEncryptStatus} from "../../shared";
import {encryptToken, encryptSecret, decryptSecret, handleDecrypt, isTokenMatched} from "../../client";

const STORAGE_KEY = "__VUEPRESS_ENCRYPT_STRICT_TOKEN__";

// 严格模式加密
export const useStrictEncrypt = (token: string, mode: string): EncryptContainer => {

  const localTokenConfig = useStorage<Record<string, string>>(STORAGE_KEY, {});
  const sessionTokenConfig = useSessionStorage<Record<string, string>>(
    STORAGE_KEY,
    {},
  );

  const currentPath = window.location.pathname;

  // 判断token是否已解锁
  const isUnlocked = computed(() => {
    const inputSecret = localTokenConfig.value[currentPath] || sessionTokenConfig.value[currentPath];
    // 解密
    const inputPwd = decryptSecret(inputSecret, currentPath);
    return inputPwd === token;
  });

  // 获取加密状态
  const getStatus = (): UseEncryptStatus => {

    return {
      isEncrypted: true,
      isLocked: !isUnlocked.value,
      isStrictMode: true,
      isDecrypt: false,
      hint: ''
    };

  };

  // 加密状态
  const status = computed(() => getStatus());

  // 校验
  const validate = (inputToken: string, keep = false): void => {
    // 验证密码与token是否匹配
    const isValid = isTokenMatched(inputToken, token);

    if (isValid) {
      // 存储token
      const configStorage = keep ? localTokenConfig : sessionTokenConfig;
      // 避免重复添加
      if (!configStorage.value[currentPath]) {
        // 加密
        configStorage.value[currentPath] = encryptSecret(encryptToken(inputToken), currentPath);
      }

      // 解密

    }
  };

  // 解密
  const useDecrypt = (content: string, token: string): string => {
    // 使用提供的解密函数
    const decryptText = handleDecrypt(content, token, false);
    // 解析JSON
    const parsed = JSON.parse(decryptText);
    if (!parsed.markdown) {
      console.log('解密内容格式不正确');
    }
    return parsed.component.template;
  }

  const validatePath = (path: string, inputToken: string, keep = false): void => {

  };

  return {
    status,
    validate,
    useDecrypt,
    validatePath,
  };

};