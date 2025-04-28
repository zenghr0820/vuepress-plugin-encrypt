import {computed} from "vue";
import {useSessionStorage, useStorage} from "@vueuse/core";
import {useEncryptConfig} from "./useEncryptConfig";
import {EncryptContainer} from "../../shared";
import {encryptToken} from "../utils";

const STORAGE_KEY = "__VUEPRESS_ENCRYPT_STRICT_Global_PATH_TOKEN__";

export const useGlobalEncrypt = (): EncryptContainer => {
  const encryptData = useEncryptConfig();

  const storageToken = useStorage(STORAGE_KEY, "");
  const sessionToken = useSessionStorage(STORAGE_KEY, "");

  const status = computed(() => {
    const {global = false, admin} = encryptData;

    // Is globally encrypted
    const isEncrypted = global && Boolean(admin?.tokens.length);

    const isLocked =
      // Valid token exists
      isEncrypted
        ? storageToken.value
          ? // None of the token matches
          encryptData.admin!.tokens.every(
            (token) => !(token === storageToken.value),
          )
          : // None of the token matches
          encryptData.admin!.tokens.every(
            (token) => !(token === sessionToken.value),
          )
        : false;

    return {
      isEncrypted,
      isLocked,
      hint: admin?.hint ?? "",
    };
  });

  const validate = (inputToken: string, keep = false): void => {
    (keep ? storageToken : sessionToken).value = encryptToken(inputToken);
  };

  const validatePath = (path: string, token: string, keep?: boolean): void => {

  };

  const useDecrypt = (content: string, token: string): string => {
    return ""
  };


  return {
    status,
    validate,
    validatePath,
    useDecrypt,
  };
};