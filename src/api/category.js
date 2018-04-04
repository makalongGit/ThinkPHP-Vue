import request from '@/utils/request'

export function getCategories() {
  return request({
    url: '/category/parent/' + 0,
    method: 'get'
  })
}

export function updateCategory(data) {
  return request({
    url: '/category/' + data.id,
    method: 'post',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'delete'
  })
}

export function createCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}
