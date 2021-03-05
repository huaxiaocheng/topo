import request from '@/utils/request'

export default {
  // 所有设备
  getDeviceAll () {
    return request({
      url: '/api/device/device/all/data?clientId=18',
      method: 'get'
    })
  },
  // 点位
  getPointList: function (sn, productId) {
    return request({
      url: '/api/device/device/point/data?sn=' + sn + '&productId=' + productId,
      method: 'get'
    })
  }
}
