<template>
  <div class="user-container">
    <div v-if="!isRequestingPersonInfo">
      <div class="name-card">
        <div class="line">
          <div class="left-part">
            <radial-progress
              :diameter="111"
              :strokeWidth="10"
              :innerStrokeWidth="6"
              :completed-steps="+personInfo.exp % 300 + 1"
              :total-steps="301"
              startColor="#d66e9e"
              stopColor="#d66e9e88"
              innerStrokeColor="#00000006"
            >
              <img :src="avatarSrc" :alt="personInfo.name" v-if="avatarSrc" @click="$utils.viewLargeImage(avatarSrc)">
            </radial-progress>
            <div class="info">
              <div class="username">{{ personInfo.name }}</div>
              <div class="sub-info">
                <font-awesome-icon :icon="{ m: 'mars', f: 'venus', bot: 'robot' }[personInfo.gender]"
                  v-if="['m', 'f', 'bot'].includes(personInfo.gender)" class="gender-badge"
                />
                {{ dobToAge(personInfo.birthday)  }}岁
                &emsp;Lv{{ level }} [{{ personInfo.title }}]
              </div>
            </div>
          </div>
          <div class="right-part">
            <div role="button" class="punch-btn" :class="{ inactive: personInfo.isPunched }" @click="punch">
              <font-awesome-icon :icon="personInfo.isPunched ? 'check' : 'feather'" />
              <span v-if="personInfo.isPunched">已</span>签到
            </div>
          </div>
        </div>
        <div class="line">
          <div>
            <sup><font-awesome-icon icon="quote-left" /></sup>
            <span class="slogan">{{ personInfo.slogan }}</span>
            <sub><font-awesome-icon icon="quote-right" /></sub>
          </div>
        </div>
      </div>
      <div class="info-item">
        <div>
          <div class="label">账号</div>
        </div>
        <div>{{ personInfo.email }}</div>
      </div>
      <div class="info-item">
        <div>
          <div class="label">注册时间</div>
        </div>
        <div>{{ $utils.getCalendarTime(personInfo.created_at) }}</div>
      </div>
      <div class="info-item">
        <div>
          <div class="label">生日</div>
        </div>
        <div>{{ $utils.getDate(personInfo.birthday) }}</div>
      </div>
      <hr>
      <div class="function-line">
        <!--<div class="function-button"><font-awesome-icon icon="pen" /> 编辑资料</div>-->
        <router-link :to="{ name: 'Setting' }" custom v-slot="{ navigate, href }">
          <a class="function-button" @click="navigate" :href="href"><font-awesome-icon icon="gear" /> 设置</a>
        </router-link>
        <router-link :to="{ name: 'UserComments' }" custom v-slot="{ navigate, href }">
          <a class="function-button" @click="navigate" :href="href"><font-awesome-icon icon="comment" /> 我的评论</a>
        </router-link>
        <div class="function-button" @click="logout()"><font-awesome-icon icon="right-from-bracket" /> 退出登录</div>
      </div>
    </div>
    <div v-else>
      <loading-small />
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMars, faVenus, faRobot, faFeather, faCheck, faQuoteLeft, faQuoteRight, faPen, faGear, faRightFromBracket, faComment } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import dobToAge from 'dob-to-age'
import RadialProgress from 'vue3-radial-progress'
import { black } from '../assets/img/black'
import LoadingSmall from '../components/LoadingSmall.vue'

library.add(faMars, faVenus, faRobot, faFeather, faCheck, faQuoteLeft, faQuoteRight, faPen, faGear, faRightFromBracket, faComment)

export default {
  name: 'User',
  components: {
    FontAwesomeIcon,
    RadialProgress,
    LoadingSmall
  },
  data () {
    return {
      isRequestingPersonInfo: true,
      isRequestingMyComments: true,
      isRequestingPunch: false,
      personInfo: {},
      myCommentsList: [],
      myCommentsCurrentPage: 1,
      isFoundAny: true,
      isAll: false,
      isShouldResetComp: false
    }
  },
  computed: {
    avatarSrc () {
      return this.personInfo.avatar
        ? this.$utils.formatImgUrl(this.personInfo.avatar.fileServer, this.personInfo.avatar.path)
        : black
    },
    level () {
      return Math.max(+this.personInfo.level, ~~(+this.personInfo.exp / 300) + 1)
    }
  },
  methods: {
    dobToAge,
    async getPersonInfo () {
      // change state.
      this.isRequestingPersonInfo = true
      // call api.
      try {
        const personInfo = await this.$api.personInfo({
          diversionUrl: this.diversionUrl, token: this.token
        })
        this.personInfo = personInfo
        console.log(personInfo)
      } catch (err) {
        this.$compHelper.breakdown.call(this)
      }
      // change state.
      this.isRequestingPersonInfo = false
    },
    async punch () {
      if (this.personInfo.isPunched || this.isRequestingPunch) { return }
      // change state.
      this.isRequestingPunch = true
      // call api.
      try {
        const punchActionRes = await this.$api.punch({
          diversionUrl: this.diversionUrl, token: this.token
        })
        console.log(punchActionRes)
        // judge.
        const preLevel = this.level
        if (punchActionRes.status === 'ok') {
          this.personInfo.isPunched = true
          this.personInfo.exp += 10
          this.$swal.toast.success.fire({
            title: '签到成功'
          })
        } else /* punchActionRes.status === 'fail' */ {
          this.$swal.toast.error.fire({
            title: '哔咔被玩坏了',
            text: '签到失败。请重试...'
          })
        }
        this.personInfo.exp += 10
        if (this.level === preLevel + 1) {
          this.$swal.toast.success.fire({
            title: '恭喜升级'
          })
        }
      } catch (err) {}
      // change state.
      this.isRequestingPunch = false
    },
    async logout () {
      this.$swal.modal.warning.fire({
        title: '确定退出登录吗？',
        text: '您的浏览记录、下载将不会被删除',
        showCancelButton: true,
        cancelButtonText: '取消',
        confirmButtonText: '确认登出',
        reverseButtons: true
      }).then(result => {
        if (result.isConfirmed) {
          this.$store.commit('storage/setToken', { nextToken: '' })
          this.$router.replace({ name: 'Diversion' })
        }
      })
    }
  },
  watch: {
    token () {
      this.isShouldResetComp = true
    }
  },
  activated () {
    if (this.isShouldResetComp) {
      Object.assign(this.$data, this.$options.data.call(this))
      this.$options.created.call(this)
    }
  },
  created () {
    this.getPersonInfo()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/themes/config.less';
@import '~@/assets/themes/@{theme-name}/theme.less';
.user-container {
  .name-card {
    width: 100%;
    padding: 6px 18px;
    border-radius: 16px;
    background: lighten(@background-btn-default, 30%);
    // box-shadow: @shadow-card-default;
    .line {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 14px 0;
      .left-part {
        display: flex;
        flex-direction: row;
        align-items: center;
        img {
          height: 90px;
          width: 90px;
          border: none;
          border-radius: 90px;
        }
        .info {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          .username {
            font-size: 26px;
            margin-bottom: 2px;
            opacity: 1;
          }
          .sub-info {
            display: flex;
            flex-direction: row;
            opacity: .8;
            .gender-badge {
              margin-right: 4px;
            }
          }
        }
      }
      .right-part {
        display: flex;
        flex-direction: row;
        align-items: center;
        .punch-btn {
          font-size: 18px;
          font-weight: 600;
          text-decoration: none;
          border-radius: .75em;
          padding: 8px 12px;
          opacity: .68;
          margin-right: 12px;
          transition: .2s;
          cursor: pointer;
          &:not(.inactive):hover {
            background-color: @background-btn-default;
            color: @background-btn-highlight;
          }
          &.inactive {
            color: @background-btn-highlight;
            cursor: default;
          }
        }
      }
      div .slogan {
        margin: 0 6px;
        opacity: .78;
      }
    }
  }
  .info-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 24px 0;
    div .label {
      font-size: 18px;
      opacity: .78;
    }
  }
  hr {
    border: none;
    border-bottom: 1px solid @color-font-default-sub;
  }
  .function-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin: 24px 0;
    .function-button {
      font-size: 18px;
      text-decoration: none;
      border-radius: .35em;
      padding: 8px 12px;
      opacity: .68;
      transition: .1s;
      color: #111111;
      cursor: pointer;
      &:hover {
        background-color: @background-btn-default;
        color: @background-btn-highlight;
      }
    }
  }
}
</style>
