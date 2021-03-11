import axios from 'axios'
import {Message} from 'element-ui'
import store from '../store/index'

// 配置服务器地址
axios.create()

// 请求拦截
axios.interceptors.request.use(
  config => {
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
    return response.data
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
