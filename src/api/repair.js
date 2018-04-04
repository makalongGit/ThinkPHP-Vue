import request from '@/utils/request'

export function createRepair(data) {
  return request({
    url: 'repair',
    method: 'post',
    data
  })
}

export function fetchList(params) {
  return request({
    url: 'repair',
    method: 'get',
    params
  })
}

export function modifyStatus(id) {
  return request({
    url: 'repair/status/' + id,
    method: 'post'
  })
}
