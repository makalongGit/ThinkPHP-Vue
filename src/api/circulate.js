import request from '@/utils/request'

export function createLoan(data) {
  return request({
    url: 'loan',
    method: 'post',
    data
  })
}

export function fetchBook(params) {
  return request({
    url: 'loan',
    method: 'get',
    params
  })
}

export function fetchMyBook(params) {
  return request({
    url: 'myLoan',
    method: 'get',
    params
  })
}
export function auditing(data) {
  return request({
    url: 'loan/audit/' + data.id,
    method: 'post',
    data
  })
}
