/**
 * 确保文档已加载完成后执行回调
 * @param callback 回调函数
 */
function onDocumentReady(callback: () => void): void {
  if (typeof document === 'undefined') return;

  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    // 如果文档已经准备好，延迟执行以确保DOM更新完成
    setTimeout(callback, 1);
  } else {
    // 否则等待文档加载完成
    document.addEventListener('DOMContentLoaded', () => {
      callback();
    });
  }
}

/**
 * 注入CSS字符串到文档中
 * @param cssString CSS内容
 * @param id 可选的标识符
 */
export function injectCSS(cssString: string, id = 'vuepress-plugin-encrypt-css'): void {
  if (typeof document === 'undefined') return;

  // 在文档准备好后注入样式
  onDocumentReady(() => {
    try {
      // 检查是否已存在样式元素
      let styleEl = document.getElementById(id) as HTMLStyleElement;

      if (!styleEl) {
        // 如果不存在，创建新的样式元素
        styleEl = document.createElement('style');
        styleEl.id = id;
        styleEl.setAttribute('type', 'text/css');
        document.head.appendChild(styleEl);

        // 确保样式被正确应用
        setTimeout(() => {
          styleEl.innerHTML = cssString;
        }, 0);
      } else {
        // 已存在则更新内容
        styleEl.innerHTML = cssString;
      }
    } catch (error) {
      console.error('Error injecting CSS:', error);
    }
  });
}

// 密码模态框样式
export const passwordModalCSS = `
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  10% {
    transform: translateX(-9px);
  }

  20% {
    transform: translateX(8px);
  }

  30% {
    transform: translateX(-7px);
  }

  40% {
    transform: translateX(6px);
  }

  50% {
    transform: translateX(-5px);
  }

  60% {
    transform: translateX(4px);
  }

  70% {
    transform: translateX(-3px);
  }

  80% {
    transform: translateX(2px);
  }

  90% {
    transform: translateX(-1px);
  }
}

.vp-decrypt-layer {
  z-index: 99;
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  height: calc(80vh - var(--navbar-height));
  margin-top: var(--navbar-height);

  text-align: center;
}

.vp-decrypt-layer.expand {
  margin-top: 0;
}

.vp-decrypt-modal {
  width: calc(100% - 8rem);
  max-width: 420px;
  margin: 2rem;
  padding: 2rem;
  border-radius: 1.5rem;

  box-shadow: 2px 2px 10px 6px var(--vp-c-shadow);

  transition: box-shadow var(--vp-t-color);
  
  @media (max-width: 959px) {
    width: calc(100% - 5rem);
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    width: calc(100% - 3rem);
    box-shadow: none;
  }
}

.vp-decrypt-hint {
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 2;
}

.vp-decrypt-hint.tried {
  color: #f00;

  animation-name: shake;
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}

.vp-decrypt-hint svg {
  width: 1.25em;
  height: 1.25em;
}

.vp-decrypt-input input {
  width: calc(100% - 3rem);
  margin-top: 1.25rem;
  padding: 0 1.5rem;
  border: 2px solid var(--vp-c-accent-bg);
  border-radius: 0.5rem;

  background: var(--vp-c-bg) !important;
  color: var(--vp-c-text) !important;
  outline: none;

  font-size: 1rem;
  line-height: 2;

  transition:
    background var(--vp-t-color),
    color var(--vp-t-color);
}

.vp-remember-password {
  margin-top: 0.5rem;
  color: var(--vp-c-text-mute);
  font-size: 14px;
  text-align: start;
}

.vp-remember-password input[type="checkbox"] {
  position: relative;
  vertical-align: text-bottom;
  height: 1em;
  margin-inline-end: 18px;
  cursor: pointer;
  appearance: none;
}

.vp-remember-password input[type="checkbox"]::after {
  content: " ";
  position: absolute;
  top: 0;
  display: inline-block;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  padding-inline-start: 0;
  border: 1px solid var(--vp-c-border);
  border-radius: 50%;
  background: var(--vp-c-control);
  text-align: center;
  visibility: visible;
}

.vp-remember-password input[type="checkbox"]:checked::after {
  content: "";
  border-color: var(--vp-c-accent-bg);
  background: var(--vp-c-accent-bg);
}

.vp-remember-password input[type="checkbox"]:checked::before {
  content: "";
  position: absolute;
  inset-inline-start: 5px;
  top: 2px;
  z-index: 1;
  width: 2px;
  height: 6px;
  border: solid var(--vp-c-white);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.vp-remember-password label {
  display: inline-block;
}

.vp-decrypt-submit {
  width: 70px;
  margin-top: 1.5rem;
  border-width: 0;
  border-radius: 0.5rem;
  background: var(--vp-c-accent-bg);
  color: var(--vp-c-text);
  outline: none;
  font-size: 1.2rem;
  line-height: 2;
  transition: color var(--vp-t-color);
}

.vp-decrypt-submit:hover {
  background: var(--vp-c-accent-hover);
}
`;