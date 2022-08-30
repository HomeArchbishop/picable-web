<template>
  <div class="side-bar-container">
    <div class="upwards-btn-group">
      <router-link :to="{ name: 'User' }" custom v-slot="{ navigate, href }">
        <a class="common-btn" @click="navigate" :href="href">
          <font-awesome-icon icon="user-alt" />
        </a>
      </router-link>
      <router-link :to="{ name: 'Setting' }" custom v-slot="{ navigate, href }">
        <a class="common-btn" @click="navigate" :href="href">
          <font-awesome-icon icon="gear" />
        </a>
      </router-link>
    </div>
    <div class="down-btn-group">
      <router-link :to="{ name: 'Home' }" custom v-slot="{ navigate, href }">
        <a class="common-btn" @click="navigate" :href="href">
          <font-awesome-icon icon="house" />
        </a>
      </router-link>
      <router-link custom v-slot="{ navigate, href }"
        :to="{ name: 'Search', query: { kw: $store.state.runtime.searchKeyword } }"
      >
        <a class="common-btn" @click="navigate" :href="href">
          <font-awesome-icon icon="magnifying-glass" />
        </a>
      </router-link>
      <router-link :to="{ name: 'Category' }" custom v-slot="{ navigate, href }">
        <a class="common-btn" @click="navigate" :href="href">
          <font-awesome-icon icon="book" />
        </a>
      </router-link>
      <router-link :to="{ name: 'Favourite' }" custom v-slot="{ navigate, href }">
        <a class="common-btn" @click="navigate" :href="href">
          <font-awesome-icon icon="bookmark" />
        </a>
      </router-link>
      <router-link :to="{ name: 'Recent' }" custom v-slot="{ navigate, href }">
        <a class="common-btn" @click="navigate" :href="href">
          <font-awesome-icon icon="eye" />
        </a>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHouse, faArrowLeft, faUserAlt, faGear, faMagnifyingGlass, faBook, faDownload, faBookmark, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faHouse, faArrowLeft, faUserAlt, faGear, faMagnifyingGlass, faBook, faDownload, faBookmark, faEye)
</script>

<style lang='less' scoped>
@import '~@/assets/themes/config.less';
@import '~@/assets/themes/@{theme-name}/theme.less';
.side-bar-container {
  display: flex;
  flex-direction: column;
  width: 60px;
  overflow-y: scroll;
  position: fixed;
  top: 54px;
  left: 0;
  bottom: 0;
  z-index: 90;
  overflow-x: hidden;
  overflow-y: scroll;
  background: @background-main;
  &::-webkit-scrollbar {
    display: none;
  }
}
.upwards-btn-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.down-btn-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  margin-bottom: 20px;
}
.common-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  min-width: 40px;
  max-width: 40px;
  min-height: 40px;
  max-height: 40px;
  color: @color-font-default;
  text-decoration: none;
  overflow: hidden;
  cursor: pointer;
  .hoverable-btn();
}
</style>
