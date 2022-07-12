vuepress 文章加密组件

**config.js**
```js
[
  '@zenghr/encrypt',
  {
    contentTitle: '加密的内容',
    unencryptedText: '内容如下所示，它应该在发布时加密.',
    encryptedText: '这部分内容已被加密，你需要输入正确的密钥才能查看.',
    decryptedText: '加密内容已成功解密，如下所示: ',
    decryptButtonText: '解密',
    decryptFailText: '解密失败！',
    unencryptedIcon: undefined,
    encryptedIcon: undefined,
    decryptedIcon: undefined
  }
]
```