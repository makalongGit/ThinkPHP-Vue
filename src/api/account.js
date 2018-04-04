import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/account/student',
    method: 'get',
    params
  })
}

export function updateAccount(data) {
  return request({
    url: '/account/' + data.uid,
    method: 'post',
    data
  })
}
