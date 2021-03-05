import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  account: null, // 当前登录的账号信息
  cancelTokenArr: [], // 请求列表
  // websocket
  ws: null,
  wsLock: null, // 锁，用于断线重连时不进入死循环
  wsStatus: false, // 连接状态
  wsTime: null // 定时器，用于断线时定时尝试重连
}

const getters = {
  getAccount (state) {
    if (state.account === null) {
      state.account = localStorage.getItem('account')
    }
    return state.account
  }
}

const mutations = {
  setAccount (state, account) {
    state.account = account
    localStorage.setItem('account', account)
  },
  pushToken (state, payload) {
    state.cancelTokenArr.push(payload.cancelToken)
  },
  clearToken (state) {
    state.cancelTokenArr.forEach(item => {
      item('路由跳转取消请求')
    })
    state.cancelTokenArr = []
  }
}

const actions = {
  asynSetAccount (context, account) {
    context.commit('setAccount', account)
  },
  asynClean (context) {
    context.commit('setAccount', null)
    localStorage.setItem('account', null)
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
