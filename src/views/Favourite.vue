<template>
  <div class="favourite-container">
    <div class="display-card">
      <div v-if="isFoundAny">
        <item-large v-for="item in favouriteComicList" :key="item._id"
          :item="item" :link="{ name: 'ComicDetail', params: { comicId: item._id } }"
        />
      </div>
      <div class="tip-layer">
        <common-tip-block v-if="isFoundAny && isUpdating" :waiting="true">正在加载</common-tip-block>
        <common-tip-block v-if="!isFoundAny">什么都没有</common-tip-block>
        <common-tip-block v-if="isFoundAny && isAll">没有更多了</common-tip-block>
        <common-tip-block v-if="favouriteComicList.length && !isAll && !isUpdating"
          :clickable="true" @click="updatePageComic()"
        >
          加载更多
        </common-tip-block>
      </div>
    </div>
  </div>
</template>

<script>
import ItemLarge from '../components/ItemLarge.vue'
import CommonTipBlock from '../components/CommonTipBlock.vue'

export default {
  name: 'Favourite',
  components: { ItemLarge, CommonTipBlock },
  data () {
    return {
      isPageFirstEnter: true,
      favouriteComicList: [],
      favouriteComicTotalCnt: 0,
      nextPage: 1, // for 'comic' type
      isUpdating: true, // for 'comic' type
      isAll: false, // for 'comic' type
      isFoundAny: true, // for 'comic' type
      isShouldResetComp: false
    }
  },
  methods: {
    async updatePageComic () { // for 'comic' type.
      // change states.
      this.isUpdating = true
      // call api to update.
      try {
        const myFavouriteListObject = await this.$api.myFavourite({
          diversionUrl: this.diversionUrl, token: this.token, page: this.nextPage
        })
        this.favouriteComicList.push(...myFavouriteListObject.docs)
        this.favouriteComicTotalCnt = myFavouriteListObject.total
        if (myFavouriteListObject.page === myFavouriteListObject.pages) {
          this.isAll = true
        } else {
          this.nextPage += 1
        }
        if (!myFavouriteListObject.pages) {
          this.isFounAny = false
        }
      } catch (err) {
        if (!this.favouriteComicList.length) {
          this.$compHelper.breakdown.call(this)
        }
      }
      // change states.
      this.isUpdating = false
    }
  },
  watch: {
    token () {
      this.isShouldResetComp = true
    }
  },
  async activated () {
    // special: if should reset, just do it
    if (this.isShouldResetComp) {
      Object.assign(this.$data, this.$options.data.call(this))
      this.$options.created.call(this)
      return
    }
    // if favourite comics changed
    if (this.isPageFirstEnter) {
      this.isPageFirstEnter = false
      return
    }
    if (this.$store.state.runtime.isFavouriteChanged) {
      console.log('!!!!! isFavouriteChanged')
      this.$store.commit('runtime/setIsFavouriteChanged', { nextIsFavouriteChanged: false })
      Object.assign(this.$data, this.$options.data.call())
      this.isPageFirstEnter = false
      this.$options.created.call(this)
    }
  },
  created () {
    this.updatePageComic()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config.less';
@import '~@/assets/themes/@{theme-name}/theme.less';
.favourite-container {
  .display-card {
    width: 100%;
    .menu-area {
      width: 100%;
      padding: 15px;
      box-shadow: @shadow-card-default;
      border-radius: .75em;
      .type-list {
        display: flex;
        overflow-x: scroll;
        width: 50%;
        &::-webkit-scrollbar {
          display: none;
        }
        .type-item{
          display: flex;
          min-width: 2em;
          cursor: pointer;
          transition: .2s;
          &:not(:nth-child(1)) {
            margin-left: 10px;
          }
          &:hover {
            color: @color-font-default-highlight;
          }
          &.current {
            cursor: default;
            color: @color-font-default-highlight;
          }
        }
      }
    }
    .tip-layer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 10px;
    }
    form {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 20px;
      width: 100%;
      position: relative;
      .icon {
        display: inline;
        transform: translateX(34px);
        color: @color-font-default-sub;
        z-index: 1;
      }
      input {
        width: 8em;
        display: inline-block;
        box-sizing: border-box;
        background: transparent;
        padding: 9px 18px 9px 40px;
        border-radius: 20px;
        border: 2px solid @color-line-default-sub;
        font-family: inherit;
        font-size: 1em;
        transition: .2s;
        color: @color-font-default-sub;
        &:focus {
          box-shadow: 0 0 3px 0 inset @color-line-default-sub;
          border-color: darken(@color-line-default-sub, .4);
          width: 50%;
        }
        &:not(:focus) + .search-tip {
          display: none;
        }
        outline: none;
      }
      .search-tip {
        display: inline-block;
        position: absolute;
        right: 16px;
        font-size: .9em;
        color: @color-font-default-sub;
      }
    }
    .item-block {
      display: inline-flex;
      background: @background-btn-default;
      border-radius: .75em;
      margin-top: 10px;
      margin-right: 10px;
      padding: 4px 9px;
      font-size: 14px;
      line-height: 2em;
      cursor: pointer;
      transition: .2s;
      font-weight: 300;
      &:nth-last-child(1) {
        margin-right: 0;
      }
      &.highlight {
        color: lighten(@color-font-default, 20%);
        background: lighten(@background-btn-highlight, 20%);
      }
      &:hover {
        transform: scale(110%);
        color: lighten(@color-font-default, 20%);
        background: lighten(@background-btn-highlight, 15%);
      }
    }
  }
}
</style>
