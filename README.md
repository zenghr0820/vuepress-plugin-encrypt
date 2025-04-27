# VuePress Plugin Encrypt

一个用于 VuePress 2.x 的内容加密插件，支持页面加密和内容加密，提供多种集成方式。

## 特性

- 📄 **页面加密** - 为特定路径的页面设置密码保护
- 📝 **内容加密** - 在 Markdown 中为特定内容块设置密码保护
- 🔑 **全局密码** - 设置管理员密码，可以解锁所有加密内容
- 🌐 **多语言支持** - 支持多语言配置
- 🎨 **主题集成** - 与 VuePress 主题完美集成

## 安装

```bash
# npm
npm install vuepress-plugin-encrypt

# yarn
yarn add vuepress-plugin-encrypt

# pnpm
pnpm add vuepress-plugin-encrypt
```

## 使用

在 VuePress 配置文件中添加插件：

```js
import { defineUserConfig } from 'vuepress'
import encryptPlugin from 'vuepress-plugin-encrypt'

export default defineUserConfig({
  plugins: [
    encryptPlugin({
      // 插件配置选项
      global: false,
      admin: {
        password: 'admin',
        hint: '请输入管理员密码',
      },
      config: {
        '/guide/': {
          password: 'guide',
          hint: '请输入指南密码',
        }
      }
    })
  ]
})
```

## 内部别名配置

如果你在使用此插件过程中遇到导入别名问题，请确保在你的 VuePress 配置中添加以下别名解析：

```js
// .vuepress/config.js
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from '@vuepress/core'
import { path } from '@vuepress/utils'

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {
      resolve: {
        alias: {
          // 为插件内部使用的别名添加解析配置
          '@encrypt-plugin/node': path.resolve(__dirname, '../../node_modules/vuepress-plugin-encrypt/lib/node'),
          '@encrypt-plugin/client': path.resolve(__dirname, '../../node_modules/vuepress-plugin-encrypt/lib/client'),
          '@encrypt-plugin/shared': path.resolve(__dirname, '../../node_modules/vuepress-plugin-encrypt/lib/shared'),
        }
      }
    }
  }),
  // ...其他配置
})
```

## 许可证

MIT 