import request from '@/utils/request'

export function createBook(data) {
  return request({
    url: 'order',
    method: 'post',
    data
  })
}

export function fetchBook(params) {
  return request({
    url: 'order',
    method: 'get',
    params
  })
}

export function fetchMyBook(params) {
  return request({
    url: 'myOrder',
    method: 'get',
    params
  })
}

export function auditing(data) {
  return request({
    url: 'order/audit/' + data.id,
    method: 'post',
    data
  })
}

export function deleteBooking(id) {
  return request({
    url: 'order/' + id,
    method: 'delete'
  })
}
