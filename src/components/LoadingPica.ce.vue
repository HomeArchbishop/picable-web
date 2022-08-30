<template>
<div class="loading-pica-container">
  <div class="card-body">
    <img :src="currentImgSrc" alt="loading...">
  </div>
</div>
</template>

<script>
const png1 = '/img/loading/1.png'
const png2 = '/img/loading/2.png'
const png3 = '/img/loading/3.png'
const png4 = '/img/loading/4.png'
const png5 = '/img/loading/5.png'
const png6 = '/img/loading/6.png'
const png7 = '/img/loading/7.png'
const png8 = '/img/loading/8.png'
const png9 = '/img/loading/9.png'
const png10 = '/img/loading/10.png'

export default {
  name: 'LoadingPica',
  data () {
    return {
      img: [png1, png2, png3, png4, png5, png6, png7, png8, png9, png10],
      currentIndex: 0
    }
  },
  computed: {
    currentImgSrc () {
      return this.img[this.currentIndex]
    }
  },
  created () {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % 10
    }, 90)
  }
}

</script>

<style lang="less" scoped>
// @import '~@/assets/themes/config';
// @import '~@/assets/themes/@{theme-name}/theme';
.loading-pica-container {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 150;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #00000033;
  user-select: none;
  .card-body {
    padding: 30px;
    border-radius: .75em;
    img {
      width: 200px;
      height: 200px;
    }
  }
}
</style>
