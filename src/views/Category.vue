<template>
  <div class="category-container">
    <div class="display-card">
      <h2 class="title">应用</h2>
      <div class="item-wrap" v-if="!appList.length && !webList.length">
        <loading-item-small v-for="i in 5" :key="i" />
      </div>
      <div class="item-wrap">
        <item-small v-for="item in appList" :key="item._id + item.title" :item="item"
          :link="{ name: item.toName }" />
      </div>
    </div>
    <div class="display-card">
      <h2 class="title">小程序</h2>
      <div class="item-wrap" v-if="!appList.length && !webList.length">
        <loading-item-small v-for="i in 8" :key="i" />
      </div>
      <div class="item-wrap">
        <item-small v-for="item in webList" :key="item._id + item.title" :item="item"
          :link="{ name: 'Link', query: { link: item.link } }" />
        <item-small v-if="postWebItem.title" :item="postWebItem" :link="{ name: 'PostWeb' }" />
      </div>
    </div>
    <div class="display-card">
      <h2 class="title">分类</h2>
      <div class="item-wrap" v-if="!cateList.length">
        <loading-item-small v-for="i in 12" :key="i" />
      </div>
      <div class="item-wrap">
        <item-small v-for="item in cateList" :key="item._id + item.title" :item="item"
          :link="{ name: 'SearchCategory', query: { c: item.title } }" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingItemSmall from '../components/LoadingItemSmall.vue'
import ItemSmall from '../components/ItemSmall.vue'

export default {
  name: 'Category',
  components: {
    LoadingItemSmall,
    ItemSmall
  },
  data () {
    return {
      appList: [],
      webList: [],
      postWebItem: {},
      cateList: []
    }
  },
  computed: {
    ...mapState({
      categoryList: state => state.runtime.categoryList // contain web & app & cate.
    })
  },
  methods: {
    async getCategoryList () {
      try {
        const categoryList = await this.$api.categories({
          diversionUrl: this.diversionUrl, token: this.token
        })
        this.$store.commit('runtime/setCategoryList', { nextCategoryList: categoryList })
        console.log(this.categoryList)
        // set values in each data.
        this.categoryList.forEach(item => {
          if (item.isWeb) {
            if (item.title !== '嗶咔鍋貼') {
              this.webList.push(item)
            } else {
              this.postWebItem = item
            }
            return
          }
          if (item.isApp) {
            this.appList.push(item)
            return
          }
          this.cateList.push(item)
        })
      } catch (err) {
        this.$compHelper.breakdown.call(this)
      }
    }
  },
  created () {
    if (!this.categoryList.length) {
      this.getCategoryList()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config.less';
@import '~@/assets/themes/@{theme-name}/theme.less';
.category-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  .display-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 300px;
    .title {
      margin-bottom: 10px;
    }
    .item-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
      width: 100%;
    }
  }
}
</style>
