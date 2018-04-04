import request from '@/utils/request'

export function login(username, password, loginType) {
  return request({
    url: '/account/login',
    method: 'post',
    data: {
      ac: username,
      pw: password,
      type: loginType
    }
  })
}

export function getInfo() {
  return request({
    url: '/account',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/account/logout',
    method: 'post'
  })
}

export function changePw(data) {
  return request({
    url: '/account/changePw',
    method: 'post',
    data
  })
}
