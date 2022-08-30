<template>
  <div class="loading-small-container">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  </div>
</template>

<style scoped lang="less">
.loading-small-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 300px;
  .line {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 15px;
    margin-left: 4px;
    background-color: #d66e9e;
    &:nth-last-child(1) {
      animation: loadingLine 1.5s 1s infinite;
    }
    &:nth-last-child(2) {
      animation: loadingLine 1.5s 0.5s infinite;
    }
    &:nth-last-child(3) {
      animation: loadingLine 1.5s 0s infinite;
    }
  }
}

@keyframes loadingLine {
  0% {
    height: 15px;
  }
  50% {
    height: 35px;
  }
  100% {
    height: 15px;
  }
}
</style>
