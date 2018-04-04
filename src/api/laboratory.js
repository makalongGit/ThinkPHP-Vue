import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/laboratory',
    method: 'get',
    params
  })
}

export function modifyStatus(id) {
  return request({
    url: '/laboratory/status/' + id,
    method: 'post'
  })
}

export function createLaboratory(data) {
  return request({
    url: '/laboratory',
    method: 'post',
    data
  })
}

export function updateLaboratory(data) {
  return request({
    url: '/laboratory/' + data.id,
    method: 'post',
    data
  })
}

export function deleteLaboratory(id) {
  return request({
    url: '/laboratory?ids=' + id,
    method: 'delete'
  })
}
