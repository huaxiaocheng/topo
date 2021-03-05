import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import store from '../store/index'

// 连接
export function wsConnection () {
  wsDisconnect(0)
  let socket = new SockJS(globalData.websocketUrl)
  store.state.ws = Stomp.over(socket)
  let headers = {}
  store.state.ws.connect(
    headers,
    frame => {
      if (store.state.wsLock) {
        console.log('锁线程锁已还原')
        window.clearInterval(store.state.wsTime)
        store.state.wsLock = false // 还原锁
      }
      store.state.wsStatus = true
      console.log('websocket连接成功')
    },
    err => {
      // 连接发生错误时的处理函数
      console.log('websocket连接失败', err)
      if (!store.state.wsLock) {
        wsReconnect()
      }
    }
  )
}
// 断开连接
export function wsDisconnect (force) { // force用于区分用户手动的断开连接和重连自动进行的连接
  if (store.state.ws !== null) {
    store.state.ws.disconnect()
    store.state.ws = null
    store.state.wsStatus = false
    if (force) {
      window.clearInterval(store.state.wsTime)
      store.state.wsLock = null
    }
  }
}
// 重连
export function wsReconnect () {
  if (store.state.wsLock) return
  store.state.wsLock = true
  // 断开重连机制,尝试发送消息,捕获异常发生时重连
  store.state.wsTime = window.setInterval(() => {
    console.log('websocket尝试重连')
    wsConnection()
  }, 5000)
}
