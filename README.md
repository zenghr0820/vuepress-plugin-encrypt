# VuePress Plugin Encrypt

一个用于 VuePress 2.x 的内容加密插件，支持页面加密和内容加密，提供多种集成方式。

## 特性

- 📄 **页面加密** - 为特定路径的页面设置密码保护
- 📝 **内容加密** - 在 Markdown 中为特定内容块设置密码保护
- 🔑 **全局密码** - 设置管理员密码，可以解锁所有加密内容
- 🌐 **多语言支持** - 支持多语言配置
- 🎨 **主题集成** - 与 VuePress 主题完美集成
- 🚀 **Vite 构建** - 使用 Vite 进行快速构建

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

## 开发

### 构建

项目使用 Vite 进行构建，这提供了更快的构建速度和更好的开发体验：

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm run build
```

构建后的文件会输出到 `lib` 目录。

## CLI 命令行工具

插件提供了命令行工具，可以用于批量加密/解密 Markdown 文件：

### 安装

全局安装以使用命令行工具：

```bash
npm install -g vuepress-plugin-encrypt
```

### 命令

#### 加密文件

```bash
vuepress-plugin-encrypt encrypt <paths...> -p <password>
```

参数说明：
- `<paths...>`: 要加密的文件或目录路径，支持多个路径
- `-p, --password <password>`: 加密密码

示例：
```bash
# 加密单个文件
vuepress-plugin-encrypt encrypt ./docs/secret.md -p mypassword

# 加密整个目录
vuepress-plugin-encrypt encrypt ./docs/secret -p mypassword

# 加密多个文件或目录
vuepress-plugin-encrypt encrypt ./docs/secret.md ./docs/private -p mypassword
```

#### 解密文件

```bash
vuepress-plugin-encrypt decrypt <paths...> -p <password>
```

参数说明：
- `<paths...>`: 要解密的文件或目录路径，支持多个路径
- `-p, --password <password>`: 解密密码

示例：
```bash
# 解密单个文件
vuepress-plugin-encrypt decrypt ./docs/secret.md -p mypassword

# 解密整个目录
vuepress-plugin-encrypt decrypt ./docs/secret -p mypassword

# 解密多个文件或目录
vuepress-plugin-encrypt decrypt ./docs/secret.md ./docs/private -p mypassword
```

### 注意事项

- 加密/解密操作会直接修改原文件，建议在操作前备份重要文件
- 目录加密会递归处理所有 .md 文件
- 确保提供正确的密码，错误的密码可能导致文件无法正确解密

## 许可证

MIT