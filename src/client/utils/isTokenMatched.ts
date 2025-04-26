import CryptoES from 'crypto-es';

export const isTokenMatched = (token = "", storedHash: string): boolean => {
  if (!token || !storedHash) return false;
  
  // 使用SHA256生成令牌的哈希值
  const tokenHash = CryptoES.SHA256(token).toString();
  
  // 使用恒定时间比较以防止时序攻击
  return tokenHash === storedHash;
};
