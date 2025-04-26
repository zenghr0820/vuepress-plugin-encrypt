import CryptoES from 'crypto-es';
import {EncryptOptions, EncryptConfig, PasswordOptions, PasswordConfig} from "../shared";

const hashPasswords = (passwords: unknown, key: string): string[] | null => {
  if (typeof passwords === "string") return [CryptoES.SHA256(passwords as string).toString()];

  if (Array.isArray(passwords))
    return passwords
      .map((password) => {
        if (typeof password === "string") return CryptoES.SHA256(password as string).toString();
        console.log(`${key} config is invalid. `);
        return null;
      })
      .filter((item): item is string => item !== null);


  console.log(`${key} config is invalid. `);

  return null;
};

/**
 * 将密码选项转换为密码配置
 */
export const convertPasswordOptions = (options: PasswordOptions): PasswordConfig => {
  if (typeof options === "string" || Array.isArray(options))
    return { tokens: hashPasswords(options, "encrypt.admin") };

  return {
    tokens: hashPasswords(options.password, "encrypt.admin.password"),
    hint: options.hint,
  };
};

// EncryptOptions => EncryptConfig
export const convertEncryptOptions = (options: EncryptOptions): EncryptConfig => {
  // 配置
  const config: EncryptConfig = {
    global: options.global || false,
    admin: options.admin ? convertPasswordOptions(options.admin) : undefined,
    config: {},
    locales: {},
    mode: options.mode,
    // 接收用户自定义选择器
    contentContainer: options.contentContainer,
  };


  // 处理配置
  if (options.config) {
    Object.entries(options.config).forEach(([key, value]) => {
      if (config.config) {
        config.config[key] = convertPasswordOptions(value);
      }
    });
  }

  return config;
};


// export enum EncryptPluginType {
//   /**
//    * 工作模式，普通模式加密渲染内容
//    */
//   Normal = "normal",
//   /**
//    * 严格模式加密原始内容
//    */
//   Strict = "strict",
// }