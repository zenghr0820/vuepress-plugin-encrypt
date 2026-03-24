# vuepress-plugin-encrypt 内容加密插件使用文档
一个 VuePress 插件，是一个专为 VuePress 2.x 开发的内容加密插件，可以为您的文档或博客提供页面级别的密码保护和内容块加密功能


## 声明
> [!CAUTION]
> 该文档由 AI 自动生成，如有问题请反馈
>
> 该插件代码提取自 [vuepress-theme-hope](https://theme-hope.vuejs.press/zh/) 内置加密组件，在其基础上添加 CLI 加密/解密功能
>
> 请不要使用该加密功能用于任何敏感、机密的文章与档案，或是使用不当，造成的后果请你自负，本插件作者和贡献者对此不承担任何责任。插件仅供学习交流使用。

## 功能
- [x] CLI命令实现内容加密
- [x] 路由加密
- [x] 自定义密码组
- [ ] 自定义记住状态时长
- [ ] 自定义验证界面

## 特性

- 📄 **页面加密** - 为特定路径的页面设置密码保护
- 📝 **内容加密** - 在 Markdown 中为特定内容块设置密码保护
- 🔑 **全局密码** - 设置管理员密码，可以解锁所有加密内容
- 🌐 **多语言支持** - 支持多语言配置
- 🎨 **主题集成** - 与 VuePress 主题完美集成
- ~~🚀 **Vite 构建** - 使用 Vite 进行快速构建~~ 

## 工作模式
- 内容加密模式
  - 普通模式：不改变原始内容，加密渲染内容
  
    （该模式方便修改，但是如果是公开仓库部署，内容还是会暴露）
  - 严格模式：加密原始内容
    
    （该模式不方便修改，每次修改完需要重新加密，但即使是公开仓库，内容不会暴露）
- 路由加密模式（该模式如果是公开仓库部署，内容还是会暴露）



## 安装
```bash
# npm
npm install vuepress-plugin-encrypt

# yarn
yarn add vuepress-plugin-encrypt

# pnpm
pnpm add vuepress-plugin-encrypt
```

## 工作原理
### 内容加密模式（普通）
Markdwon文档 -> markdown-it解析渲染成html -> 加密html -> cache缓存加密内容 -> 通过plugin解密html -> 在页面中添加解密后的html
### 内容加密模式（严格）
Markdwon文档 -> build -> 加密原始内容 -> plugin解密原始内容 -> markdown-it解析渲染成html
### 路由加密模式
访问页面 -> 拦截路由 -> 验证密码 -> 释放路由 -> 显示页面


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

## 🔐 CLI 命令行 - AES 加密

插件提供了命令行工具，使用 **AES** ，用于批量加密/解密Markdown文件

```bash
CLI 工具用于加密/解密内容

Options:
  -V, --version                 output the version number
  -h, --help                    display help for command

Commands:
  encrypt [options] <paths...>  加密 Markdown 文件 -p 加密密码
  decrypt [options] <paths...>  解密 Markdown 文件 -p 解密密码
  help [command]                display help for command
```

### 通过 npm scripts 调用（推荐）

在 package.json 中添加

```json
{
  "scripts": {
    "encrypt": "vp-encrypt encrypt",
    "decrypt": "vp-encrypt decrypt"
  }
}
```

然后运行加密/解密

```bash
npm run encrypt -- <加密文件 or 文件夹> -p <加密密码>
npm run decrypt -- <解密文件 or 文件夹> -p <解密密码>
```

### 或者使用 npx 直接运行

```bash
npx vp-encrypt [options]

```

### 🌰举个栗子

```bash
# 加密单个文件
npx vp-encrypt encrypt ./docs/secret.md -p mypassword
# 加密整个目录
npx vp-encrypt encrypt ./docs/secret.md -p mypassword

# 解密
npx vp-encrypt decrypt ./docs/secret.md -p mypassword
```

### 📂加密案例

```markdown
# 页面标题

这是公开内容，任何人都可以看到。

::: encrypt token=密码123
这是加密内容，只有输入正确密码才可见。
:::

这又是公开内容。
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
      passwords: ['api123', 'backup123'],  # 密码组
      hint: 'API文档密码（可尝试备份密码）',
    }
  },
  
  // 多语言配置
  locale: {
    '/': {
      placeholder: '请输入密码',
      remember: '记住密码',
      errorHint: '密码错误',
    },
    'zh-CN': {
      placeholder: '请输入密码',
      remember: '记住密码',
      errorHint: '密码错误',
    },
    'en': {
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


## 与主题集成

如果您使用的是 `VuePress Theme Hope` 支持加密功能的主题，可以不用配置，插件默认集成 `VuePress Theme Hope` 

### 注册组件 Component 集成

插件默认注册两个全局组件

**LocalEncrypt** 和 **GlobalEncrypt** 

`LocalEncrypt` 组件负责 路由加密，你可以在你的主题布局组件中添加该组件，实现加载加密功能

```vue
<Layout>
    <HomePage>
    	<LocalEncrypt>
            <NormalPage />
        </LocalEncrypt>
    </HomePage>
</Layout>
```

`GlobalEncrypt` 组件负责 全局加密，你可以在你的主题布局组件中添加该组件，实现加载加密功能

```vue
<Layout>
    <GlobalEncrypt>
    	<HomePage />
    </GlobalEncrypt>
</Layout>
```

### 别名方式集成

如果是其他支持加密功能的主题，你可以使用别名替换成该组件，配置如下

```js
encryptPlugin({
  replaceComponent: {
    encrypt: "@theme-hope/modules/encrypt/components/LocalEncrypt",
    globalEncrypt: "@theme-hope/modules/encrypt/components/GlobalEncrypt"
  }
})
```

## 常见问题解答

### 加密模式如何选择？

- 使用`strict`模式保护敏感技术文档
- 使用`normal`模式保护普通博客内容
- 两种模式可混合使用

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



## ❌️ 俺不中嘞

**vite** 编译后 出现 `/* empty css */` 问题，俺不中了 😭 就这样了吧不解决了

```js
import "./styles/index.scss"
# 编译后
/* empty css */
```

最后使用 JS 强制注入CSS字符串到页面中

相同的问题 [Why does Vite sometimes replace my CSS imports with /* empty css */](https://stackoverflow.com/questions/79203941/why-does-vite-sometimes-replace-my-css-imports-with-empty-css) 

> 修改为 TSC 打包

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
