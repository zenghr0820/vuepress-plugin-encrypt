# VuePress 加密插件 (vuepress-plugin-zhr-encrypt)

一个用于 VuePress 2.x 的内容加密插件，支持页面加密和内容加密，提供多种集成方式。

## 特点

- ✨ 支持完全替换主题布局的密码保护
- ✨ 支持与主题集成的密码保护（显示模糊化的主题）
- ✨ 支持插入到主题插槽的内容加密
- ✨ 支持路径级加密和组件级加密
- ✨ 自适应暗黑模式
- ✨ 支持自动恢复原主题布局

## 安装

```bash
npm install vuepress-plugin-zhr-encrypt
# 或者
yarn add vuepress-plugin-zhr-encrypt
# 或者
pnpm add vuepress-plugin-zhr-encrypt
```

## 使用方法

### 1. 配置插件

在你的 VuePress 配置文件中添加插件：

```js
// .vuepress/config.js 或 config.ts
import { defineUserConfig } from 'vuepress'
import { encryptPlugin } from 'vuepress-plugin-zhr-encrypt'

export default defineUserConfig({
  plugins: [
    encryptPlugin({
      // 全局加密（可选）
      global: false,
      
      // 管理员密码（可选）
      admin: {
        password: 'your-admin-password',
        hint: '请输入管理员密码'
      },
      
      // 特定路径加密
      config: {
        '/guide/': {
          password: 'guide-password',
          hint: '请输入 guide 路径的密码'
        },
        '/advanced/': [
          'password1', 
          'password2'
        ]
      },
      
      // 是否使用主题集成布局（可选，默认false）
      // true - 显示模糊的主题背景
      // false - 完全替换主题
      useThemeLayout: false,
      
      // 主题布局组件名称（可选，默认'Layout'）
      // 用于指定解密后使用的原主题布局组件名称
      themeLayout: 'Layout'
    })
  ]
})
```

### 2. 页面加密 - 完全替换主题布局

在插件配置中设置 `useThemeLayout: false`（默认），当用户访问受保护的页面时：

1. 插件会完全替换页面布局为加密布局
2. 用户将只能看到密码输入界面，不会看到任何原有主题元素
3. 输入正确密码后，页面会恢复原有主题和内容

这种方式最安全，因为在验证前完全不显示任何原始布局信息。

### 3. 页面加密 - 与主题集成

在插件配置中设置 `useThemeLayout: true`，当用户访问受保护的页面时：

1. 插件会保留原主题布局，但将其模糊化处理
2. 在模糊背景上方显示密码输入界面
3. 输入正确密码后，模糊效果消失，显示正常内容

这种方式可以保留主题的视觉一致性，同时保护内容。

### 4. 内容加密 - 插入到主题插槽

在 Markdown 文件中使用组件加密特定内容：

```md
# 页面标题

<ZhrLocalEncrypt>

这里是受保护的内容，只有输入正确密码后才能查看。

</ZhrLocalEncrypt>
```

如果要插入到主题的特定位置，可以使用 `ZhrContentEncrypt` 组件：

```vue
<!-- .vuepress/client.ts -->
import { defineClientConfig } from 'vuepress/client'
import { ZhrContentEncrypt } from 'vuepress-plugin-zhr-encrypt/client'

export default defineClientConfig({
  enhance({ app }) {
    // 在主题的特定插槽中注册加密内容
    app.component('TopContent', () => 
      h(ZhrContentEncrypt, {
        password: 'your-password',
        hint: '请输入密码查看特殊内容'
      }, () => h('div', {}, '这是仅管理员可见的内容'))
    )
  }
})
```

### 5. 自定义主题布局恢复

如果你的主题使用的不是默认的 `Layout` 组件，可以通过 `themeLayout` 配置项指定主题布局组件的名称。插件会在解密后自动使用该布局组件渲染内容。

例如，对于使用自定义布局名称的主题：

```js
// .vuepress/config.js
export default defineUserConfig({
  plugins: [
    encryptPlugin({
      // ...其他配置
      
      // 指定主题使用的布局组件名称
      themeLayout: 'MyCustomThemeLayout'
    })
  ]
})
```

## 自定义加密布局

如果想自定义加密页面的外观，可以创建自己的布局组件：

```vue
<!-- .vuepress/layouts/MyEncryptLayout.vue -->
<script setup>
import { ZhrThemeEncryptLayout } from 'vuepress-plugin-zhr-encrypt/client'
</script>

<template>
  <ZhrThemeEncryptLayout>
    <!-- 可以添加自定义内容 -->
  </ZhrThemeEncryptLayout>
</template>

<style>
/* 自定义样式 */
</style>
```

然后在配置文件中注册这个布局：

```js
// .vuepress/config.js
export default {
  // ...
  theme: {
    layouts: {
      ThemeEncrypt: path.resolve(__dirname, './layouts/MyEncryptLayout.vue')
    }
  }
}
```

## API 参考

### 插件选项

- `global`: 是否全局加密 (boolean)
- `admin`: 管理员密码配置 (string | string[] | PasswordConfig)
- `config`: 路径特定加密配置 (Record<string, PasswordConfig>)
- `useThemeLayout`: 是否使用主题集成布局 (boolean)
- `themeLayout`: 主题布局组件名称 (string)，默认为 'Layout'

### 组件

- `ZhrEncryptLayout`: 加密布局组件，完全替换主题布局
- `ZhrThemeEncryptLayout`: 主题集成加密布局，保留模糊的主题背景
- `ZhrLocalEncrypt`: 用于在Markdown中加密特定内容的组件
- `ZhrContentEncrypt`: 用于插入到主题插槽的加密组件
- `ZhrGlobalEncrypt`: 全局加密组件（自动注册，无需手动使用）

## 许可证

MIT 