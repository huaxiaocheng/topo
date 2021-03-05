import axios from 'axios'
import {Message} from 'element-ui'
import store from '../store/index'

// 配置服务器地址
axios.create()

// 请求拦截
axios.interceptors.request.use(
  config => {
    if (config.headers.Authorization !== 'Basic Z3NrOmdzaw==' && store.getters.getAccount !== '' && store.getters.getAccount !== null && store.getters.getAccount !== 'null') {
      config.headers.Authorization = 'Bearer ' + JSON.parse(store.getters.getAccount).access_token
    }
    config.cancelToken = new axios.CancelToken(function (cancel) {
      store.commit('pushToken', {cancelToken: cancel})
    })
    return config
  },
  error => {
    return Promise.error(error)
  })

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    if (response.data.code === 0) {
      return response.data.data
    } else {
      let msg = response.data.msg
      if (response.data.code === 8) {
        msg = '用户名或密码错误'
      }
      Message({
        message: msg,
        type: 'error'
      })
      return false
    }
  },
  function (error) {
    if (axios.isCancel(error)) {
      // 为了终结promise链，就是实际请求不会走到.catch(rej=>{});这样就不会触发错误提示
      return new Promise(() => {})
    } else {
      Message({
        message: '服务器内部错误',
        type: 'error'
      })
    }
    return Promise.reject(error)
  })

export default axios
