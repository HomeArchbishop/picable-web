<template>
  <div class="buffer-container"></div>
</template>

<script>
export default {
  name: 'Buffer',
  created () {
    this.$router.replace({ name: 'Diversion' })
  }
}
</script>

<style>
/* <style lang="less" scoped> */
/* @import '~@/assets/themes/config'; */
/* @import '~@/assets/themes/@{theme-name}/theme'; */
.buffer-container {
  height: 70vh;
}
</style>
