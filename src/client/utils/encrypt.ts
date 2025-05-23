import CryptoES from 'crypto-es';
import MarkdownIt from 'markdown-it';
import {parseFrontmatter} from './parseFrontmatter.js'
import yaml from 'js-yaml';

export const encryptContent = (content: string, password: string | string[]): {
  token: string,
  encryptText: string
} => {
  const key = Array.isArray(password) ? password[0] : password;
  const token = CryptoES.SHA256(key).toString();
  return handleEncrypt(content, token, false);
};

export const handleEncrypt = (content: string, token: string, isHash: boolean): {
  token: string,
  encryptText: string
} => {
  if (isHash) {
    token = CryptoES.SHA256(token).toString();
  }
  return {
    token: token,
    encryptText: CryptoES.AES.encrypt(content, token).toString()
  };
};

export const decryptContent = (encrypted: string, password: string | string[]): string => {
  const key = Array.isArray(password) ? password[0] : password;
  const token = CryptoES.SHA256(key).toString();
  return handleDecrypt(encrypted, token, false)
};

export const handleDecrypt = (content: string, token: string, isHash: boolean): string => {
  try {
    if (isHash) {
      token = CryptoES.SHA256(token).toString();
    }
    const bytes = CryptoES.AES.decrypt(content, token);
    const decrypted = bytes.toString(CryptoES.enc.Utf8);
    if (!decrypted) {
      console.warn("没有需要解密的内容")
    }
    return decrypted;
  } catch (e) {
    console.error('解密错误:', e);
    throw new Error('解密失败，请检查密码是否正确');
  }
};

export const encryptFrontmatter = (content: string, password: string | string[], filePath?: string): string => {
  const markdown = new MarkdownIt();
  // 解析 frontmatter
  const parsed = parseFrontmatter(content);
  // 渲染 markdown 内容
  const html = markdown.render(parsed.content, {
    frontmatter: parsed.data,
    relativePath: filePath ? resolveRelative(filePath) : undefined
  });

  // 构建加密数据
  const plaintext = JSON.stringify({
    markdown: parsed.content,
    component: {
      template: `<div>${html}</div>`
    }
  });

  // 加密内容
  const encrypted = encryptContent(plaintext, password);

  // 返回加密后的完整内容
  return `${parsed.metaContent}::: encrypt encrypted token=${encrypted.token}\n${encrypted.encryptText}\n:::\n`;
};

export const decryptFrontmatter = (content: string, password: string | string[]): string => {
  // 解析 frontmatter
  const parsedFm = parseFrontmatter(content);

  const regex = /^::: encrypt encrypted .*?\n([\s\S]*?)\n:::/m;
  const restMatch = parsedFm.content.match(regex);
  if (!restMatch || restMatch.length <= 0) {
    console.warn("没有找到需要解密的内容")
    return
  }
  // 提取加密内容 - 使用更简单的方法
  const encryptedContent = restMatch[1];

  try {
    // 解密内容
    const decrypted = decryptContent(encryptedContent, password);

    try {
      // 尝试解析为 JSON
      const parsed = JSON.parse(decrypted);
      if (!parsed.markdown) {
        throw new Error('解密内容格式不正确');
      }
      return `${parsedFm.metaContent}${parsed.markdown}`;
    } catch (e) {
      console.error('JSON 解析错误:', e);
      throw new Error('解密内容格式不正确');
    }
  } catch (e) {
    console.error('解密错误:', e);
    throw new Error('解密失败，请检查密码是否正确');
  }
};


// 解析相对路径
function resolveRelative(relativePath) {
  return new URL(relativePath, import.meta.url).pathname;
}