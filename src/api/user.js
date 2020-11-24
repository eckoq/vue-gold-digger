import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/gold-digger/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/gold-digger/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/gold-digger/user/logout',
    method: 'post'
  })
}
