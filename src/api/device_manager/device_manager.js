import request from '@/utils/request'

export function get_query_configs(data) {
  return request({
    url: '/gold-digger/device_manager/get_query_configs',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true
    },
    data
  })
}

export function get_device(data) {
  return request({
    url: '/gold-digger/device_manager/get_device',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true
    },
    data
  })
}

export function get_netflow(data) {
  return request({
    url: '/gold-digger/device_manager/get_netflow',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true
    },
    data
  })
}
