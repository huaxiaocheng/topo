import request from '@/utils/request'

export default {
  // 获取模型列表
  getModelList () {
    return request({
      url: '/api/models',
      method: 'get'
    })
  },
  // 获取模型列表
  getModelById (id) {
    return request({
      url: '/api/model/' + id,
      method: 'get'
    })
  },
  // 获取设备列表
  getDeviceList () {
    return request({
      url: '/api/devices',
      method: 'get'
    })
  }
}
