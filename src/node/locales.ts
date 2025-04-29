import type { EncryptLocaleData } from '../shared/encrypt'

// 定义本地化信息类型
export type DefaultLocaleInfo = Record<string, EncryptLocaleData>;

export const EncryptLocaleInfo: Record<string, EncryptLocaleData> = {
  '/': {
    iconLabel: '加密',
    placeholder: '请输入密码',
    remember: '记住密码',
    errorHint: '请输入正确的密码！'
  },
  'en': {
    iconLabel: 'Encrypt',
    placeholder: 'Enter password',
    remember: 'Remember password',
    errorHint: 'Please enter the correct password!'
  },
  'zh-CN': {
    iconLabel: '加密',
    placeholder: '请输入密码',
    remember: '记住密码',
    errorHint: '请输入正确的密码！'
  },
  'zh-tw': {
    iconLabel: '加密',
    placeholder: '請輸入密碼',
    remember: '記住密碼',
    errorHint: '請輸入正確的密碼！'
  }
};