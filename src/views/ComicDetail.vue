<template>
  <div class="detail-container">
    <div class="info-card" v-if="!isRequestingDetail">
      <div class="img-div">
        <img :src="$utils.formatImgUrl(thumb.fileServer, thumb.path)" alt="加载失败"
          @click.stop="$utils.viewLargeImage($utils.formatImgUrl(thumb.fileServer, thumb.path))"
        >
        <!--<img src="@/assets/img/black.jpeg" alt="加载失败">-->
      </div>
      <div class="content-div">
        <h2 class="title">
          {{ comicDetailObject.title }}
          <sup class="comic-finished-sup-tag">{{ comicDetailObject.finished ? '（完）' : '（未完）' }}</sup>
        </h2>
        <router-link custom v-slot="{ navigate, href }"
          :to="{ name: 'Search', query: { kw: comicDetailObject.author || '未知' } }">
          <div>
            作者：
            <a class="line-link" @click="navigate" :href="href">{{ comicDetailObject.author || '未知' }}</a>
          </div>
        </router-link>
        <router-link custom v-slot="{ navigate, href }"
          :to="{ name: 'Search', query: { kw: comicDetailObject.chineseTeam || '未知' } }">
          <div>
            汉化：
            <a class="line-link" @click="navigate" :href="href"> {{ comicDetailObject.chineseTeam || '未知' }}</a>
          </div>
        </router-link>
        <div>指名：{{ comicDetailObject.viewsCount }}次</div>
        <div>分类：{{ comicDetailObject.categories?.reduce((s, c) => `${s}、${c}`) }}</div>
      </div>
    </div>
    <div class="detail-card" v-if="!isRequestingDetail">
      <div class="tag-wrap">
        <router-link :to="{ name: 'SearchTag', query: { t: tagName } }" custom v-slot="{ navigate, href }"
          v-for="tagName in comicDetailObject.tags" :key="tagName">
          <a :href="href" @click="navigate" style="text-decoration: none;">
            <tag-item>{{ tagName }}</tag-item>
          </a>
        </router-link>
      </div>
      <div class="description">
        <span v-if="isDescriptionPreview">
          {{ comicDetailObject.description.slice(0, 30) }}...
        </span>
        <span v-else>
          {{ comicDetailObject.description }}
        </span>
        <u class="toggle-btn" @click.stop="toggleDescriptionPreview()" v-if="isDescriptionShouldPreview">
          <font-awesome-icon icon="angle-down" v-if="isDescriptionPreview" />
          <font-awesome-icon icon="angle-up" v-else />
        </u>
      </div>
      <div class="func-bar">
        <div class="func-btn" id="favouriteBtn" :class="{ active: isFavourite, loading: isRequestingFavourite }" @click.stop="toggleFavourite()">
          <font-awesome-icon icon="bookmark" />收藏
        </div>
        <div class="func-btn" id="likeBtn" :class="{ active: isLiked, loading: isRequestingLike }" @click.stop="toggleLike()">
          <font-awesome-icon icon="heart" />点赞
          <div class="func-btn-badge">{{ comicDetailObject.likesCount }}</div>
        </div>
        <router-link :to="{ name: 'ComicComments', params: { comicId } }" custom v-slot="{ navigate, href }">
          <a class="func-btn" @click="navigate" :href="href">
            <font-awesome-icon icon="comment-dots" />评论
            <div class="func-btn-badge">{{ comicDetailObject.commentsCount }}</div>
          </a>
        </router-link>
      </div>
    </div>
    <div class="episodes-card" v-if="!isRequestingDetail">
      <h2>章节列表</h2>
      <div class="episodes-list">
        <router-link
          :to="{ name: 'ComicViewer', params: { comicId, order: item.order } }" custom v-slot="{ navigate, href }"
          v-for="item in episodesList" :key="item.order"
        >
          <a class="episodes-item" @click="navigate" :href="href">{{ item.title }}</a>
        </router-link>
      </div>
      <div class="state-line">
        <common-tip-block v-if="isRequestingEpisodes" :waiting="true">加载中...</common-tip-block>
        <common-tip-block v-if="!isEpisodesListEnd & !isRequestingEpisodes"
          :clickable="true" @click="getEpisodesList()"
        >
          {{ episodesList.length ? '加载更多' : '重新加载' }}
        </common-tip-block>
      </div>
    </div>
    <loading-small v-if="isRequestingDetail" />
    <div class="recommend-card"
      v-if="
        (
          (!isRecommendComicListRequestError && recommendComicList.length) ||
          isRecommendComicListRequestError
        ) && !isRequestingDetail
      "
    >
      <h2>看了這本子的人也在看</h2>
      <div class="comic-list" v-if="!isRecommendComicListRequestError">
        <item-small v-for="item in recommendComicList" :key="item._id" :item="item"
          :link="{ name: 'ComicDetail', params: { comicId: item._id } }"
        />
      </div>
      <div class="state-line" v-if="isRecommendComicListRequestError">
        <common-tip-block :clickable="true" @click="getRecommendComic()">
          重新加载
        </common-tip-block>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHeart, faEye, faCommentDots, faBookmark, faDownload, faFileZipper, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TagItem from '../components/TagItem.vue'
import CommonTipBlock from '../components/CommonTipBlock.vue'
import ItemSmall from '../components/ItemSmall.vue'
import LoadingSmall from '../components/LoadingSmall.vue'

library.add(faHeart, faEye, faCommentDots, faBookmark, faDownload, faFileZipper, faAngleDown, faAngleUp)

export default {
  name: 'ComicDetail',
  components: {
    FontAwesomeIcon,
    TagItem,
    LoadingSmall,
    ItemSmall,
    CommonTipBlock
  },
  data () {
    return {
      comicDetailObject: {},
      episodesList: [],
      nextEpisodesPage: 1,
      recommendComicList: [],
      isRecommendComicListRequestError: false,
      isFavourite: false,
      isLiked: false,
      isRequestingDetail: true,
      isRequestingEpisodes: true,
      isRequestingFavourite: false,
      isRequestingLike: false,
      isDescriptionPreview: false,
      isEpisodesListEnd: false
    }
  },
  computed: {
    thumb () {
      return this.comicDetailObject.thumb || {}
    },
    comicId () {
      return this.$route.params.comicId
    },
    isDescriptionShouldPreview () {
      return this.comicDetailObject.description
        ? this.comicDetailObject.description.length > 30
        : false
    }
  },
  methods: {
    async getComicDetail () {
      // change state.
      this.isRequestingDetail = true
      // call api.
      try {
        const comicDetailObject = await this.$api.info({
          diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId
        })
        this.comicDetailObject = comicDetailObject
        this.isFavourite = this.comicDetailObject.isFavourite
        this.isLiked = this.comicDetailObject.isLiked
        this.isDescriptionPreview = String(this.comicDetailObject.description).length > 30
        console.log('comicDetailObject', comicDetailObject)
        this.$store.commit('runtime/setWindowTitle', { nextTitle: comicDetailObject.title })
      } catch (err) {
        this.$compHelper.breakdown.call(this)
      }
      // change state.
      this.isRequestingDetail = false
    },
    async getEpisodesList () {
      this.isRequestingEpisodes = true
      try {
        const episodesObject = await this.$api.episodes({
          diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId, page: this.nextEpisodesPage
        })
        this.episodesList.push(...(episodesObject.docs || []))
        this.isEpisodesListEnd = episodesObject.page === episodesObject.pages
        this.nextEpisodesPage += !this.isEpisodesListEnd
        console.log(episodesObject)
      } catch (err) {}
      this.isRequestingEpisodes = false
    },
    async toggleFavourite () {
      if (this.isRequestingFavourite) { return }
      // change state.
      this.isRequestingFavourite = true
      // call api.
      const formerIsFavourite = this.isFavourite
      this.isFavourite = !formerIsFavourite
      try {
        const favouriteAction = await this.$api.favourite({
          diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId
        })
        this.isFavourite = favouriteAction === 'favourite'
        this.$store.commit('runtime/setIsFavouriteChanged', { nextIsFavouriteChanged: true })
      } catch (err) {
        this.isFavourite = formerIsFavourite
      }
      // change state.
      this.isRequestingFavourite = false
    },
    async toggleLike () {
      if (this.isRequestingLike) { return }
      // change state.
      this.isRequestingLike = true
      // call api.
      const formerIsLiked = this.isLiked
      const formerLikesCount = this.comicDetailObject.likesCount
      this.isLiked = !formerIsLiked
      this.comicDetailObject.likesCount = formerLikesCount + (formerIsLiked ? -1 : 1)
      try {
        const likeAction = await this.$api.like({
          diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId
        })
        this.isLiked = likeAction === 'like'
        this.comicDetailObject.likesCount = formerLikesCount + (likeAction === 'like' ? 1 : -1)
      } catch (err) {
        this.isLiked = formerIsLiked
        this.comicDetailObject.likesCount = formerLikesCount
      }
      // change state.
      this.isRequestingLike = false
    },
    async getRecommendComic () {
      try {
        this.recommendComicList = (await this.$api.recommend({
          diversionUrl: this.diversionUrl, token: this.token, comicId: this.comicId
        })).comics
        this.isRecommendComicListRequestError = false
      } catch (err) {
        this.isRecommendComicListRequestError = true
      }
    },
    async toggleDescriptionPreview () {
      this.isDescriptionPreview = !this.isDescriptionPreview
    }
  },
  watch: {
    comicId (nextValue) {
      if (!nextValue) { return }
      // init $data.
      Object.assign(this.$data, this.$options.data.call(this))
      this.getComicDetail()
      this.getEpisodesList()
      this.getRecommendComic()
    }
  },
  created () {
    this.getComicDetail()
    this.getEpisodesList()
    this.getRecommendComic()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config.less';
@import '~@/assets/themes/@{theme-name}/theme.less';
.detail-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  .info-card {
    display: flex;
    flex-direction: row;
    width: 100%;
    .img-div {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      width: 140px;
      height: 180px;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        max-height: 180px;
        border: none;
      }
    }
    .content-div {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 16px;
      height: 100%;
      line-height: 25px;
      .title {
        margin: 15px 0;
        .comic-finished-sup-tag {
          font-size: .7em;
          color: @color-font-theme;
        }
      }
      .line-link {
        display: inline;
        cursor: pointer;
        transition: .2s;
        color: @color-font-default-sub;
        &:hover {
          color: @color-font-default-highlight;
          text-decoration: underline;
        }
      }
    }
  }
  .detail-card {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    .tag-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      padding-right: 2em;
      position: relative;
      margin: 4px;
    }
    .description {
      color: @color-font-default-sub;
      padding-right: 2em;
      position: relative;
      font-weight: 300;
    }

    .toggle-btn { /* btn that toggle all description or tags */
      display: inline-block;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: pointer;
      transition: .2s;
      &:hover {
        color: @color-font-default-highlight;
      }
    }
    .func-bar {
      display: flex;
      flex-direction: row;
      margin: 10px 0;
      .func-btn {
        padding: 8px 16px;
        border-radius: .75em;
        background: @background-btn-default;
        color: lighten(@color-font-default, 10%);
        transition: .2s;
        position: relative;
        box-sizing: border-box;
        text-decoration: none;
        cursor: pointer;
        &:not(:nth-child(1)) {
          margin-left: 4px;
        }
        &.active {
          &#favouriteBtn {
            color: @color-active-highlight-1;
            background-color: fade(@color-active-highlight-1, 15%);
          }
          &#likeBtn {
            color: @color-active-highlight-2;
            background-color: fade(@color-active-highlight-2, 15%);
          }
          &#downloadBtn {
            color: @color-active-highlight-7;
            background-color: fade(@color-active-highlight-7, 15%);
          }
        }
        &.loading {
          cursor: wait;
        }
        &:hover {
          transform: translateY(-2px);
        }
        .func-btn-badge {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 1.5em;
          padding: 0 .5em;
          position: absolute;
          top: -.6em;
          right: -1em;
          font-size: .8em;
          color: @color-font-default; /* for the possible color change in toggle-btn */
          border-radius: .75em;
          background: lighten(@background-btn-highlight, 10%);
        }
      }
    }
  }

  .episodes-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-shadow: 0 0 4px 0 @color-shadow;
    border-radius: .75em;
    margin-top: 10px;
    padding: 0 14px 14px 14px;
    .episodes-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-top: -10px;
      ::selection {
        text-decoration: none;
      }
      .episodes-item {
        // border: 1px solid @color-line-default;
        background: lighten(@background-btn-default, 29%);
        padding: 6px 10px;
        margin: 2px;
        font-size: 14px;
        transition: .2s;
        color: @color-font-default;
        text-decoration: none;
        cursor: pointer;
        &:nth-last-child(1) {
          margin-right: 0;
        }
        &:not(.disabled):hover {
          transform: scale(110%)
        }
      }
    }
    .state-line {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      margin-top: 10px;
    }
  }
  .recommend-card {
    display: flex;
    flex-direction: column;
    width: 100%;
    h2 {
      margin-bottom: 10px;
      margin-top: 60px;
    }
    .comic-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
  }
}
</style>
