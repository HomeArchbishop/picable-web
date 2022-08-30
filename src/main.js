import { createApp } from 'vue'
import { mapGetters, mapState } from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import apis from './apis'
import utils from './assets/utils'
import Mousetrap from './plugins/mousetrap'
import swalPlugin, { swal } from './plugins/sweetalert-picable/sweetalert-picable'
import compHelper from './plugins/component-helper'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import tippyPicable from './plugins/tippy-picable'
import styleUtils from './plugins/style-utils'

if (window.innerWidth < 600) {
  swal.toast.fire({
    title: '小屏幕样式可能不适配哦',
    text: '尝试换个大点的窗口吧。（小屏幕适配在更进了！）',
    timer: 4000
  })
}

const app = createApp(App)

  .use(store)
  .use(router)
  .use(apis)
  .use(utils)
  .use(Mousetrap)
  .use(swalPlugin)
  .use(compHelper)
  .use(tippyPicable)
  .use(styleUtils)
  .use(VueDOMPurifyHTML)

  .mixin({
    computed: {
      ...mapState({
        token: state => state.storage.token
      }),
      ...mapGetters({
        diversionUrl: 'runtime/currentDiversionUrl'
      })
    }
  })

router.isReady().then(() => {
  app.mount('#app')
})
