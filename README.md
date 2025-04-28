# VuePress 内容加密插件使用文档

> 该文档由 AI 自动生成，如有问题请反馈

## 插件介绍

`vuepress-plugin-encrypt` 是一个专为 VuePress 2.x 开发的内容加密插件，可以为您的文档或博客提供页面级别的密码保护和内容块加密功能。

### 特性
- **页面加密**：为特定路径下的页面设置密码保护
- **内容加密**：在 Markdown 中为特定内容块设置密码保护
- **全局管理员密码**：设置管理员密码，可以解锁所有加密内容
- **多语言支持**：支持多种语言配置
- **主题集成**：与 VuePress 主题完美集成

## 安装

```bash
# npm
npm install vuepress-plugin-encrypt

# yarn
yarn add vuepress-plugin-encrypt

# pnpm
pnpm add vuepress-plugin-encrypt
```

## 基本用法

在 VuePress 配置文件中添加插件：

```js
import { defineUserConfig } from 'vuepress'
import { encryptPlugin } from 'vuepress-plugin-encrypt'

export default defineUserConfig({
  plugins: [
    encryptPlugin({
      // 插件配置选项
      global: false,  // 是否启用全局加密
      admin: {
        password: 'admin',  // 管理员密码
        hint: '请输入管理员密码',  // 密码提示
      },
      config: {
        '/guide/': {  // 特定路径加密
          password: 'guide',
          hint: '请输入指南密码',
        }
      }
    })
  ]
})
```

## 配置详解

### 全局配置

```js
encryptPlugin({
  // 是否开启全局加密（所有页面都需要密码访问）
  global: false,
  
  // 管理员配置，管理员密码可以解锁所有加密内容
  admin: {
    password: 'admin',  // 密码
    hint: '请输入管理员密码',  // 提示文本
  },
  
  // 密码记忆选项
  remember: {
    enable: true,  // 是否启用密码记忆功能
    expire: 7,     // 密码过期时间（天）
  },
  
  // 路径加密配置
  config: {
    '/guide/': {  // 路径匹配
      password: 'guide',  // 密码
      hint: '请输入密码查看指南',  // 提示文本
    },
    '/api/': {
      password: 'api123', 
      hint: 'API文档密码',
    }
  },
  
  // 多语言配置
  locale: {
    '/': {
      placeholder: '请输入密码',
      remember: '记住密码',
      errorHint: '密码错误',
    },
    '/zh/': {
      placeholder: '请输入密码',
      remember: '记住密码',
      errorHint: '密码错误',
    },
    '/en/': {
      placeholder: 'Please enter the password',
      remember: 'Remember password',
      errorHint: 'Incorrect password',
    }
  },
  
  // 组件替换配置（与其他主题集成时使用）
  replaceComponent: {
    encrypt: "@theme-hope/modules/encrypt/components/GlobalEncrypt",
    globalEncrypt: "@theme-hope/modules/encrypt/components/GlobalEncrypt"
  }
})
```

## 内容块加密

除了整页加密外，您还可以对 Markdown 文件中的特定内容块进行加密：

```markdown
# 页面标题

这是公开内容，任何人都可以看到。

::: encrypt token=密码123
这是加密内容，只有输入正确密码才可见。
:::

这又是公开内容。
```

### 加密容器语法

加密容器的完整语法：

```markdown
::: encrypt token=密码 mode=strict
加密内容
:::
```

参数说明：
- `token`: 解锁该内容块的密码
- `mode`: 加密模式
  - 默认：仅加密渲染后的内容
  - `strict`: 严格模式，加密原始Markdown，解密后再渲染

## CLI 命令行工具

插件提供了命令行工具，用于批量加密/解密Markdown文件：

### 全局安装

```bash
npm install -g vuepress-plugin-encrypt
```

### 加密文件

```bash
vuepress-plugin-encrypt encrypt <paths...> -p <password>
```

示例：
```bash
# 加密单个文件
vuepress-plugin-encrypt encrypt ./docs/secret.md -p mypassword

# 加密整个目录
vuepress-plugin-encrypt encrypt ./docs/secret -p mypassword
```

### 解密文件

```bash
vuepress-plugin-encrypt decrypt <paths...> -p <password>
```

示例：
```bash
# 解密单个文件
vuepress-plugin-encrypt decrypt ./docs/secret.md -p mypassword
```

## 与主题集成

如果您使用的是 VuePress Theme Hope 等支持加密功能的主题，可以通过`replaceComponent`配置项进行集成：

```js
encryptPlugin({
  replaceComponent: {
    encrypt: "@theme-hope/modules/encrypt/components/LocalEncrypt",
    globalEncrypt: "@theme-hope/modules/encrypt/components/GlobalEncrypt"
  }
})
```

## 样式定制

该插件内置了默认样式，但您也可以通过CSS变量或自定义样式文件进行覆盖：

```css
/* 在您的自定义样式文件中 */
:root {
  --vp-c-accent-bg: #3eaf7c;
  --vp-c-accent-hover: #4abf8a;
  --vp-c-shadow: rgba(0, 0, 0, 0.1);
}

.vp-decrypt-modal {
  /* 自定义密码模态框样式 */
}
```

## 常见问题解答

### 密码无法记住

确保启用了记住密码功能，并检查浏览器是否允许保存Cookie：

```js
encryptPlugin({
  remember: {
    enable: true,
    expire: 7  // 7天过期
  }
})
```

### 和其他插件冲突

如果与其他插件发生冲突，尝试调整插件的加载顺序：

```js
plugins: [
  // 先加载其他插件
  otherPlugin(),
  // 最后加载加密插件
  encryptPlugin(options)
]
```

### 加密后无法搜索内容

加密内容默认对搜索引擎隐藏，这是预期行为。如果需要索引加密内容，请使用非严格模式的内容块加密。

## 开发与贡献

欢迎贡献代码或提交问题：

1. Fork 仓库
2. 克隆到本地：`git clone https://github.com/yourusername/vuepress-plugin-encrypt.git`
3. 安装依赖：`npm install`
4. 运行开发服务器：`npm run dev`
5. 构建：`npm run build`

## 兼容性说明

- 支持 VuePress 2.x
- 支持主流浏览器的最新两个版本
- 支持 Node.js 16.0.0 及以上版本

## 许可证

MIT

---

希望此文档能帮助您快速上手使用 vuepress-plugin-encrypt 插件。如有更多问题，请参考GitHub仓库的Issues或提交新的Issue。
