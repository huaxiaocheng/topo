import request from '@/utils/request'

export default {
  login (data) {
    return request({
      headers: {
        'Authorization': 'Basic Z3NrOmdzaw=='
      },
      url: '/api/auth/oauth/token?username=' + data.username + '&password=' + data.password + '&grant_type=password&scope=server&client_code=GSK',
      method: 'post'
    })
  },
  logout () {
    return request({
      url: '/api/auth/token/logout',
      method: 'delete'
    })
  }
}
