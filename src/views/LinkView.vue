<template>
  <div class="link-container">
    <div class="tip-wrap">
      <div class="tip-content">
        <span class="text">你即将前往链接 ({{ timeCountDown }}s)</span>
        <div class="link-show-box">
          <a :href="validLink" @click.prevent="open()">{{ validLink }}</a>
        </div>
        <strong class="small-text">请做好准备应对浏览器历史记录</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['link'])

const validLink = ref('')
if (/^(https|http):\/\//.test(props.link)) {
  validLink.value = `${props.link}`
} else if (/^\/\//.test(props.link)) {
  validLink.value = `https:${props.link}`
} else {
  validLink.value = `https://${props.link}`
}
console.log(validLink.value)

function open () {
  clearInterval(interval)
  clearTimeout(timeout)
  window.open(validLink.value)
}

const timeCountDown = ref(3)
const interval = setInterval(() => {
  timeCountDown.value -= 1
}, 1000)
const timeout = setTimeout(() => {
  open()
}, 3200)
</script>

<style lang="less" scoped>
.link-container {
  position: fixed;
  right: 0;
  left: 60px;
  top: 54px;
  bottom: 0;
  height: calc(100% - 54px - 20px);
  overflow-y: scroll;
  .tip-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .tip-content {
      width: 90%;
      position: relative;
      top: -4em;
      max-width: 450px;
      .text {
        color: #858585;
        font-size: 1.3rem;
      }
      .small-text {
        color: #858585;
      }
      .link-show-box {
        background: #00000010;
        padding: 10px 10px 10px 2rem;
        margin: 5px 0;
        border-radius: .3rem;
      }
    }
  }
}
</style>
