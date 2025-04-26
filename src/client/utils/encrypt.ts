// import CryptoJS from 'crypto-js';
import CryptoES from 'crypto-es';
import MarkdownIt from 'markdown-it';
import path from 'path';
import { parseFrontmatter }  from './parseFrontmatter.js'

import yaml from 'js-yaml';


const ENCRYPT_CONTAINER_BEGIN_REGEX = /^\s*encrypt\s+(encrypted\s+)?key=(\w+)\s+salt=(\w+(?:,\w+)*)\s*$/


export const encryptContent = (content: string, password: string | string[]): string => {
  const key = Array.isArray(password) ? password[0] : password;
  return CryptoES.AES.encrypt(content, key).toString();
};

export const decryptContent = (encrypted: string, password: string | string[]): string => {
  const key = Array.isArray(password) ? password[0] : password;
  try {
    const bytes = CryptoES.AES.decrypt(encrypted, key);
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
  const { data, content: markdownContent } = parseFrontmatter(content);
  // 渲染 markdown 内容
  const html = markdown.render(markdownContent, {
    frontmatter: data,
    relativePath: filePath ? path.relative(process.cwd(), filePath).replace(/\\/g, '/') : undefined
  });

  // 构建加密数据
  const plaintext = JSON.stringify({
    markdown: markdownContent,
    component: {
      template: `<div>${html}</div>`
    }
  });

  // 加密内容
  const encryptedContent = encryptContent(plaintext, password);

  // 返回加密后的完整内容
  return `---\n${yaml.dump(data)}---\n\n::: encrypt encrypted\n${encryptedContent}\n:::\n`;
};

export const decryptFrontmatter = (content: string, password: string | string[]): string => {
  // 解析 frontmatter
  const { data, content: restContent } = parseFrontmatter(content);

  const regex = /::: encrypt encrypted\s+([\s\S]+?)\s*:::/;
  const restMatch = restContent.match(regex);
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
      return `---\n${yaml.dump(data)}---\n\n${parsed.markdown}`;
    } catch (e) {
      console.error('JSON 解析错误:', e);
      throw new Error('解密内容格式不正确');
    }
  } catch (e) {
    console.error('解密错误:', e);
    throw new Error('解密失败，请检查密码是否正确');
  }
};

// 测试函数
export const testEncryption = (content: string, password: string) => {
  console.log('=== 开始测试加密解密过程 ===');
  console.log('原始内容:', content);
  console.log('测试密码:', password);
  
  try {
    // 加密
    const encrypted = encryptContent(content, password);
    console.log('加密结果:', encrypted);
    
    // 解密
    const decrypted = decryptContent(encrypted, password);
    console.log('解密结果:', decrypted);
    
    // 验证
    if (content === decrypted) {
      console.log('测试成功：加密和解密过程正常');
    } else {
      console.log('测试失败：解密结果与原始内容不匹配');
    }
  } catch (e) {
    console.error('测试过程中出现错误:', e);
  }
  
  console.log('=== 测试结束 ===');
}; 