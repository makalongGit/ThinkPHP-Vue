import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/device',
    method: 'get',
    params
  })
}

export function modifyStatus(id) {
  return request({
    url: '/device/status/' + id,
    method: 'post'
  })
}

export function createDevice(data) {
  return request({
    url: '/device',
    method: 'post',
    data
  })
}

export function updateDevice(data) {
  return request({
    url: '/device/' + data.id,
    method: 'post',
    data
  })
}

export function deleteDevice(id) {
  return request({
    url: '/device?ids=' + id,
    method: 'delete'
  })
}
