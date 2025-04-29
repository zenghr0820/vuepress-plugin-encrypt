import {EncryptLocaleInfo} from "../../node/locales";
import {EncryptLocaleData} from "../../shared";
import {useEncryptConfig} from "./useEncryptConfig";

const DefaultLang = "/";

export const useThemeLocaleData= (lang : string): EncryptLocaleData => {
  const encryptConfig = useEncryptConfig()
  if (encryptConfig && encryptConfig.locales && encryptConfig.locales[lang]) {
    return encryptConfig.locales[lang]
  }
  if (EncryptLocaleInfo[lang]) {
    return EncryptLocaleInfo[lang]
  }

  return EncryptLocaleInfo[DefaultLang]
}