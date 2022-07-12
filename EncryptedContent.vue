<template>
  <div>
      <div
        class="encrypted-header"
      >
        <p
          v-if="icon"
          class="encrypted-icon"
        >
          <i
            :class="icon"
          />
        </p>
        <p class="encrypted-title">
          {{ contentTitle }}
        </p>
        <div v-if="!encrypted">
          <p>{{ unencryptedText }}</p>
        </div>
        <div v-else-if="!decryptedComponent">
          <p>{{ encryptedText }}</p>
          <p>
            <input
              v-model.lazy="keyFromInput"
              type="password"
              autocomplete="new-password"
              @keyup.enter="onConfirm"
            >
            <button
              @click="onConfirm"
            >
              {{ decryptButtonText }}
            </button>
          </p>
        </div>
        <div v-else>
          <p>{{ decryptedText }}</p>
        </div>
      </div>
      <!-- for decrypted component -->
      <div
        v-show="!encrypted"
        ref="content"
      >
        <slot />
      </div>
      <!-- message -->
      <transition name="fade">
        <div class="message" :class="type" v-if="visible">
          <i class="icon-type iconfont" :class="'icon-'+type"></i>
          <div class="content">{{content}}
            <i v-if="hasClose" class="btn-close iconfont icon-close" @click="visible=false"></i>
          </div>
        </div>
      </transition>
      <!-- 动态组件 -->
      <component
        :is="decryptedComponent"
        v-if="decryptedComponent"
      />
  </div>
</template>

<script>
/* global EN_CONTENT_TITLE, EN_UNENCRYPTED_TEXT, EN_ENCRYPTED_TEXT,
  EN_DECRYPTED_TEXT, EN_DECRYPT_BUTTON_TEXT,
  EN_UNENCRYPTED_ICON, EN_ENCRYPTED_ICON, EN_DECRYPTED_ICON */

import aesjs from 'aes-js'
import md5 from 'md5'
import event from '@encrypt-event'

function base64ToArrayBuffer (base64) {
  const binaryString = window.atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

export default {
  name: 'EncryptedContent',
  props: {
    keyName: {
      type: String,
      required: true
    },
    owners: {
      type: String,
      required: true
    },
    encrypted: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    encryptedContent: '',
    keyFromInput: '',
    decryptedComponent: '',
    content: '',
    time: 3000,
    visible: false,
    type:'info',//'success','warning','error'
    hasClose:false,
  }),
  computed: {
    contentTitle () {
      return EN_CONTENT_TITLE
    },
    unencryptedText () {
      return EN_UNENCRYPTED_TEXT
    },
    encryptedText () {
      return EN_ENCRYPTED_TEXT
    },
    decryptedText () {
      return EN_DECRYPTED_TEXT
    },
    decryptButtonText () {
      return EN_DECRYPT_BUTTON_TEXT
    },
    icon () {
      if (!this.encrypted) {
        return EN_UNENCRYPTED_ICON || ''
      } else if (!this.decryptedComponent) {
        return EN_ENCRYPTED_ICON || ''
      } else {
        return EN_DECRYPTED_ICON || ''
      }
    }
  },
  updated () {
    if (this.encrypted && !this.encryptedContent) {
      this.encryptedContent = this.$refs.content.innerText.replace(/\s/g, '')
    }
  },
  methods: {
    onConfirm () {
      try {
        const encryptedContent = base64ToArrayBuffer(this.encryptedContent)
        const key = aesjs.utils.hex.toBytes(md5(this.keyFromInput))
        // eslint-disable-next-line new-cap
        const aesCtr = new aesjs.ModeOfOperation.ctr(key)
        const content = aesjs.utils.utf8.fromBytes(aesCtr.decrypt(encryptedContent))
        const { component } = JSON.parse(content)
        this.decryptedComponent = component
        this.$nextTick(() => {
          this.succeed();
        })
      } catch (e) {
        this.failed();
      }
      this.close();
    },
    succeed() {
      this.visible = true
      this.content = '解密成功!'
      this.type = 'success'
      this.hasClose = true
    },
    failed() {
      this.visible = true
      this.content = '密码错误!'
      this.type = 'error'
      this.hasClose = true
    },
    close() {
      window.setTimeout(() => {
        this.visible = false
        this.hasClose = false
      }, this.time);
    }
  }
}
</script>

<style>
.encrypted-header {
  padding: .1rem 1.5rem;
  border-left-width: .5rem;
  border-left-style: solid;
  margin: 1rem 0;
  border-color: darkcyan;
  background-color: lightcyan;
}
.encrypted-title {
  font-weight: 600;
}
.encrypted-icon {
  float: right;
  font-size: 1.4em;
  margin-top: 0.6em !important;
}
.encrypted-header input[type=password] {
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 30px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  margin: .5em .5em .5em 0;
}
.encrypted-header button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  transition: .1s;
  font-weight: 500;
  padding: 7px 15px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  vertical-align: middle;
}
.encrypted-header button:hover {
  box-shadow: 0 0 5px darkcyan;
}
/* message style */
/* 动画效果 淡入淡出 */
 .fade-enter-active, .fade-leave-active{
  transition: all 0.5s ease;
 }
 .fade-enter, .fade-leave-active{
  opacity: 0;
 }
 /* 不同的提示语的样式 */
 .info, .icon-info{
 background-color: #DDDDDD;/*#f0f9eb*/
  color: #909399;
 }
 .success, .icon-success{
  background-color:#f0f9eb;
  color: #67C23A;
 }
 .warning, .icon-warning{
  background-color: #fdf6ec;
  color: #e6a23c;
 }
 .error, .icon-error{
  background-color: #fef0f0;
  color: #f56c6c;
 }
 .message {
  position: fixed;
  left: 50%;
  top: 10%;
  transform: translate(-50%, -50%);
  width:300px;
  height:30px;
  line-height: 30px;
  font-size: 16px;
  padding: 10px;
  border-radius: 5px;
}

.message .content {
  width:100%;
  height:100%;
  text-align:left;
}

.message .content .icon-type{
  margin:0 10px 0 30px;
}

.message .content .btn-close{
  font-size:20px;
  margin:0 0 0 70px;
  color:#ccc;
}
</style>
