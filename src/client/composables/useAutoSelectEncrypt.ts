import {EncryptContainer} from "../../shared";
import {usePathEncrypt} from "./usePathEncrypt";
import {useStrictEncrypt} from "./useStrictEncrypt";

// 自动选择加密容器
export const useAutoSelectEncrypt = (token: string, mode: string): EncryptContainer => {

  if ('strict' === mode) {
    return useStrictEncrypt(token, mode);
  }

  return usePathEncrypt();
}


