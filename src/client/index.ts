// 导出所有组件
export * from './components/index.js';

// 导出所有布局组件
export * from './layouts/index.js';

// 导出所有组合式API
export * from './composables/index.js';

// 导出所有工具函数
export * from './utils/index.js';

// 导入样式
import './styles/index.scss';

// 导出明确的组件引用，方便用户使用
import { LocalEncrypt as ZhrLocalEncrypt, GlobalEncrypt as ZhrGlobalEncrypt, ContentEncrypt as ZhrContentEncrypt } from './components/index.js';
import { EncryptLayout as ZhrEncryptLayout, ThemeEncryptLayout as ZhrThemeEncryptLayout } from './layouts/index.js';
export { ZhrLocalEncrypt, ZhrGlobalEncrypt, ZhrEncryptLayout, ZhrThemeEncryptLayout, ZhrContentEncrypt };
