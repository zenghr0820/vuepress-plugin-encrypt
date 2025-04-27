import { Plugin } from "@vuepress/core";
import { getDirname, path } from "@vuepress/utils";
import markdownContainer from 'markdown-it-container';
import { type EncryptOptions } from "../shared/encrypt.js";
import { encryptContent, encryptFrontmatter, decryptContent, decryptFrontmatter } from "../client/utils/encrypt.js";
import {convertEncryptOptions} from "./getEncryptConfig.js";

const __dirname = getDirname(import.meta.url);

export const PLUGIN_NAME = "vuepress-plugin-encrypt";
export const ENCRYPT_CONTAINER_BEGIN_REGEX = /encrypt encrypted token=([^\s:]+)/

export const encryptPlugin = (options: EncryptOptions): Plugin => (app) => {
  // 配置
  const config = convertEncryptOptions(options);
  if (app.env.isDebug) console.log(`${PLUGIN_NAME} : \n`, config)


  return {
    name: PLUGIN_NAME,

    define: {
      __VUEPRESS_ENCRYPT_CONFIG__: config,
    },

    extendsMarkdown: (md, app ) => {
      md.use(markdownContainer, 'encrypt', {
        validate (params) {
          return params.match(ENCRYPT_CONTAINER_BEGIN_REGEX)
        },
        render (tokens, idx) {
          const m = tokens[idx].info.match(ENCRYPT_CONTAINER_BEGIN_REGEX)
          if (tokens[idx].nesting === 1) {
            // opening tag
            return `<Encrypt token="${m[1]}" mode="strict">`
          } else {
            // closing tag
            return '</Encrypt>\n'
          }
        }
      });
    },

    clientConfigFile: path.resolve(__dirname, "../client/config.js"),

  };
};

export * from "../shared/encrypt.js";
export { encryptContent, encryptFrontmatter, decryptContent, decryptFrontmatter };

export default encryptPlugin; 