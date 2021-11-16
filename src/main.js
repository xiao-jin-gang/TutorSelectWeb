/*
 * @Author: Rex Joush
 * @Date: 2021-08-11 15:19:50
 * @LastEditors: Rex Joush
 * @LastEditTime: 2021-08-13 20:03:37
 */
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import ViewUI from 'view-design'
import './styles/element-variables.scss'
import 'view-design/dist/styles/iview.css'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
// 引入icon-font
import './assets/alifont/iconfont.css'

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})
Element.Dialog.props.closeOnClickModal.default = false
// 使用 ViewUI
Vue.use(ViewUI)
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 引入axios实现跨域请求
// import axios from 'axios'
import qs from 'qs'
// axios.defaults.baseURL = 'http://127.0.0.1:8081'
import request from '@/utils/request'

Vue.prototype.qs = qs
// 挂载，使全局能用
Vue.prototype.$http = request
Vue.config.productionTip = false

// Vue.prototype.moment = Moment

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
