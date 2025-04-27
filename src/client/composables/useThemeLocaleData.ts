import {EncryptLocaleInfo} from "@encrypt-plugin/node/locales";
import {EncryptLocaleData} from "@encrypt-plugin/shared";
import {useEncryptConfig} from "./useEncryptConfig";

const DefaultLang = "zh-CN";

export const useThemeLocaleData= (lang : string): EncryptLocaleData => {
  const encryptConfig = useEncryptConfig()
  if (encryptConfig && encryptConfig.locales && encryptConfig.locales[lang]) {
    return encryptConfig.locales[lang]
  }
  if (lang) {
    return EncryptLocaleInfo[lang]
  }

  return EncryptLocaleInfo[DefaultLang]
}